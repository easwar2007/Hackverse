import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  MongoClient,
  MongoNetworkError,
  MongoServerError,
  MongoServerSelectionError,
  ObjectId,
  type Db,
  type WithId,
} from 'mongodb';

const SESSION_COOKIE = 'hackverse_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_HASH_BYTES = 64;

interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

interface SessionDocument {
  _id: string;
  userId: ObjectId;
  expiresAt: Date;
}

interface PublicUser {
  id: string;
  name: string;
  email: string;
}

interface MemoryCollection<T> {
  createIndex: (...args: unknown[]) => Promise<void>;
  findOne: (query: Record<string, unknown>) => Promise<(T & { _id?: ObjectId | string }) | null>;
  insertOne: (document: T) => Promise<{ insertedId: ObjectId | string }>;
  deleteOne: (query: Record<string, unknown>) => Promise<{ deletedCount: number }>;
}

interface MemoryDatabase {
  collection: <T>(name: string) => MemoryCollection<T>;
}

interface AuthConfig {
  mongoUri?: string;
  databaseName?: string;
  isProduction: boolean;
}

interface DnsAnswer {
  type: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  Answer?: DnsAnswer[];
}

class AuthError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

let clientPromise: Promise<MongoClient> | undefined;

function createMemoryDatabase(): MemoryDatabase {
  const users = new Map<string, Record<string, unknown>>();
  const sessions = new Map<string, Record<string, unknown>>();

  return {
    collection<T>(name: string): MemoryCollection<T> {
      const collectionData = (name === 'users' ? users : sessions) as Map<string, Record<string, unknown>>;

      return {
        async createIndex() {
          return;
        },
        async findOne(query: Record<string, unknown>) {
          const entries = Array.from(collectionData.values() as Iterable<Record<string, unknown>>);
          const match = entries.find((document) => {
            return Object.entries(query).every(([key, value]) => {
              const currentValue = document[key];
              if (value instanceof Date && currentValue instanceof Date) {
                return value.getTime() === currentValue.getTime();
              }
              return currentValue === value;
            });
          });
          return (match as (T & { _id?: ObjectId | string }) | null) ?? null;
        },
        async insertOne(document: T) {
          const record = document as Record<string, unknown> & { _id?: ObjectId | string };
          const id = typeof record._id === 'string' ? record._id : `memory-${Date.now()}-${Math.random().toString(16).slice(2)}`;
          const stored = { ...record, _id: id } as Record<string, unknown>;
          collectionData.set(id, stored);
          return { insertedId: id };
        },
        async deleteOne(query: Record<string, unknown>) {
          for (const [key, entry] of Array.from(collectionData.entries())) {
            const matches = Object.entries(query).every(([queryKey, queryValue]) => {
              const currentValue = entry[queryKey];
              if (queryValue instanceof Date && currentValue instanceof Date) {
                return queryValue.getTime() === currentValue.getTime();
              }
              return currentValue === queryValue;
            });
            if (matches) {
              collectionData.delete(key);
              return { deletedCount: 1 };
            }
          }
          return { deletedCount: 0 };
        },
      };
    },
  };
}

async function queryDnsOverHttps(name: string, type: 'SRV' | 'TXT'): Promise<DnsAnswer[]> {
  const providers = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
  ];
  let lastError: unknown;

  for (const url of providers) {
    try {
      const response = await fetch(url, {
        headers: { accept: 'application/dns-json' },
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) throw new Error(`DNS-over-HTTPS request failed with status ${response.status}.`);
      const result = await response.json() as DnsResponse;
      if (result.Status !== 0) throw new Error(`DNS lookup failed with status ${result.Status}.`);
      return result.Answer || [];
    } catch (error) {
      lastError = error;
    }
  }

  console.error('MongoDB DNS-over-HTTPS lookup failed:', lastError);
  throw new AuthError(
    'Could not resolve MongoDB Atlas records. Check your internet connection, DNS, and Atlas hostname.',
    503,
  );
}

async function resolveSrvConnectionString(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) return uri;

  const parsedUri = new URL(uri);
  const srvName = `_mongodb._tcp.${parsedUri.hostname}`;
  const [srvAnswers, txtAnswers] = await Promise.all([
    queryDnsOverHttps(srvName, 'SRV'),
    queryDnsOverHttps(parsedUri.hostname, 'TXT'),
  ]);
  const hosts = srvAnswers
    .filter(answer => answer.type === 33)
    .map(({ data }) => {
      const match = data.match(/^(\d+)\s+\d+\s+(\d+)\s+([a-z\d.-]+)\.?$/i);
      if (!match) throw new AuthError('MongoDB Atlas returned an invalid SRV record.', 503);
      const port = Number(match[2]);
      if (port < 1 || port > 65_535) throw new AuthError('MongoDB Atlas returned an invalid SRV port.', 503);
      return `${match[3]}:${port}`;
    });

  if (hosts.length === 0) {
    throw new AuthError('MongoDB Atlas did not return any SRV hosts for the configured cluster.', 503);
  }

  const options = new URLSearchParams();
  for (const answer of txtAnswers.filter(record => record.type === 16)) {
    const txt = answer.data.match(/"([^"]*)"/g)?.map(part => part.slice(1, -1)).join('') ?? answer.data;
    for (const [key, value] of new URLSearchParams(txt)) {
      if (['authSource', 'replicaSet', 'loadBalanced'].includes(key) && !options.has(key)) {
        options.set(key, value);
      }
    }
  }
  for (const [key, value] of parsedUri.searchParams) options.set(key, value);
  if (!options.has('tls') && !options.has('ssl')) options.set('tls', 'true');

  const remainder = uri.slice('mongodb+srv://'.length);
  const authorityEnd = remainder.search(/[/?#]/);
  const authority = authorityEnd === -1 ? remainder : remainder.slice(0, authorityEnd);
  const userInfo = authority.includes('@') ? authority.slice(0, authority.lastIndexOf('@') + 1) : '';
  const path = parsedUri.pathname === '/' ? '' : parsedUri.pathname;
  const query = options.toString();
  return `mongodb://${userInfo}${hosts.join(',')}${path}${query ? `?${query}` : ''}`;
}

async function getDatabase(config: AuthConfig): Promise<Db | MemoryDatabase> {
  if (!config.mongoUri) {
    console.warn('MongoDB is not configured; using in-memory auth fallback for local development.');
    return createMemoryDatabase();
  }

  if (!clientPromise) {
    clientPromise = resolveSrvConnectionString(config.mongoUri)
      .then(uri => new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect())
      .catch((error: unknown) => {
        clientPromise = undefined;
        throw error;
      });
  }

  try {
    const client = await clientPromise;
    const database = client.db(config.databaseName || 'hackverse');
    await Promise.all([
      database.collection<UserDocument>('users').createIndex({ email: 1 }, { unique: true }),
      database.collection<SessionDocument>('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]);
    return database;
  } catch (error) {
    if (!config.isProduction) {
      console.warn('MongoDB unavailable; using in-memory auth fallback for local development.', error);
      return createMemoryDatabase();
    }
    throw error;
  }
}

function publicUser(user: { _id?: ObjectId | string; name: string; email: string }): PublicUser {
  const id = user._id instanceof ObjectId ? user._id.toHexString() : String(user._id ?? '');
  return { id, name: user.name, email: user.email };
}

function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new AuthError('Enter a valid email address.', 400);
  }
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError('Enter a valid email address.', 400);
  }
  return email;
}

function parsePassword(value: unknown): string {
  if (typeof value !== 'string' || value.length < 8 || Buffer.byteLength(value, 'utf8') > 1024) {
    throw new AuthError('Password must be at least 8 characters and no more than 1024 bytes.', 400);
  }
  return value;
}

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, PASSWORD_HASH_BYTES, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key);
      }
    });
  });
}

async function createPasswordHash(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await deriveKey(password, salt);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash || !/^[\da-f]{32}$/.test(salt) || !/^[\da-f]{128}$/.test(hash)) {
    return false;
  }
  const derivedKey = await deriveKey(password, salt);
  return timingSafeEqual(derivedKey, Buffer.from(hash, 'hex'));
}

function sessionTokenFromRequest(request: IncomingMessage): string | undefined {
  const cookieHeader = request.headers.cookie;
  const match = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([a-f\\d]{64})(?:;|$)`, 'i'));
  return match?.[1];
}

function setSessionCookie(response: ServerResponse, token?: string, isProduction = false): void {
  const value = token
    ? `${SESSION_COOKIE}=${token}; Max-Age=${SESSION_DURATION_SECONDS}; HttpOnly; SameSite=Lax; Path=/`
    : `${SESSION_COOKIE}=; Max-Age=0; HttpOnly; SameSite=Lax; Path=/`;
  response.setHeader('Set-Cookie', isProduction ? `${value}; Secure` : value);
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function createSession(
  database: Db,
  user: WithId<UserDocument>,
  response: ServerResponse,
  config: AuthConfig,
): Promise<void> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  await database.collection<SessionDocument>('sessions').insertOne({
    _id: hashToken(token),
    userId: user._id,
    expiresAt,
  });
  setSessionCookie(response, token, config.isProduction);
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function getSafeDatabaseError(error: unknown): AuthError | undefined {
  let cause: unknown = error;
  let hasNetworkErrorCode = false;
  let hasTlsHandshakeError = false;
  while (cause instanceof Error) {
    if ('code' in cause && typeof cause.code === 'string') {
      if (['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT'].includes(cause.code)) {
        hasNetworkErrorCode = true;
      }
      if (cause.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') {
        hasTlsHandshakeError = true;
      }
    }
    cause = cause.cause;
  }

  if (hasTlsHandshakeError) {
    return new AuthError(
      'MongoDB Atlas rejected the TLS connection. Check Atlas Network Access for your current public IP, and check whether your VPN, proxy, or firewall is blocking outbound TLS on port 27017.',
      503,
    );
  }

  if (
    error instanceof MongoServerSelectionError ||
    error instanceof MongoNetworkError ||
    hasNetworkErrorCode
  ) {
    return new AuthError(
      'Cannot reach MongoDB. Check the connection string and allow your current IP in MongoDB Atlas Network Access.',
      503,
    );
  }

  if (error instanceof MongoServerError && (error.code === 18 || error.code === 8000)) {
    return new AuthError(
      'MongoDB rejected the database credentials. Check the Atlas database user and password in .env.local.',
      503,
    );
  }

  return undefined;
}

export async function handleAuthRequest(
  request: IncomingMessage,
  response: ServerResponse,
  path: string,
  body: unknown,
  config: AuthConfig,
): Promise<boolean> {
  const isSessionRequest = path === '/api/auth/session' && request.method === 'GET';
  const isSignup = path === '/api/auth/signup' && request.method === 'POST';
  const isLogin = path === '/api/auth/login' && request.method === 'POST';
  const isLogout = path === '/api/auth/logout' && request.method === 'POST';
  if (!isSessionRequest && !isSignup && !isLogin && !isLogout) return false;

  try {
    const token = sessionTokenFromRequest(request);
    if (isSessionRequest && !token) {
      sendJson(response, 200, { user: null });
      return true;
    }
    if (isLogout && !token) {
      setSessionCookie(response, undefined, config.isProduction);
      sendJson(response, 200, { success: true });
      return true;
    }

    const database = await getDatabase(config) as any;
    const users = database.collection('users');
    const sessions = database.collection('sessions');

    if (isSessionRequest) {
      if (!token) {
        sendJson(response, 200, { user: null });
        return true;
      }
      const session = await sessions.findOne({ _id: hashToken(token), expiresAt: { $gt: new Date() } });
      const user = session ? await users.findOne({ _id: session.userId }) : null;
      if (!session || !user) {
        setSessionCookie(response, undefined, config.isProduction);
        sendJson(response, 200, { user: null });
        return true;
      }
      sendJson(response, 200, { user: publicUser(user) });
      return true;
    }

    if (isSignup) {
      if (!body || typeof body !== 'object') throw new AuthError('Invalid sign-up request.', 400);
      const values = body as Record<string, unknown>;
      const name = typeof values.name === 'string' ? values.name.trim() : '';
      if (name.length < 1 || name.length > 100) throw new AuthError('Enter a name between 1 and 100 characters.', 400);
      const email = parseEmail(values.email);
      const password = parsePassword(values.password);
      const user: UserDocument = {
        name,
        email,
        passwordHash: await createPasswordHash(password),
        createdAt: new Date(),
      };
      try {
        const { insertedId } = await users.insertOne(user);
        const savedUser = { ...user, _id: insertedId };
        await createSession(database, savedUser, response, config);
        sendJson(response, 201, { user: publicUser(savedUser) });
      } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
          throw new AuthError('An account with that email already exists.', 409);
        }
        throw error;
      }
      return true;
    }

    if (isLogin) {
      if (!body || typeof body !== 'object') throw new AuthError('Invalid sign-in request.', 400);
      const values = body as Record<string, unknown>;
      const email = parseEmail(values.email);
      const password = parsePassword(values.password);
      const user = await users.findOne({ email });
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        throw new AuthError('Email or password is incorrect.', 401);
      }
      await createSession(database, user, response, config);
      sendJson(response, 200, { user: publicUser(user) });
      return true;
    }

    if (token) await sessions.deleteOne({ _id: hashToken(token) });
    setSessionCookie(response, undefined, config.isProduction);
    sendJson(response, 200, { success: true });
    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      sendJson(response, error.statusCode, { error: error.message });
      return true;
    }
    const databaseError = getSafeDatabaseError(error);
    if (databaseError) {
      console.error('Authentication database request failed:', error);
      sendJson(response, databaseError.statusCode, { error: databaseError.message });
      return true;
    }
    console.error('Authentication request failed:', error);
    sendJson(response, 500, { error: 'Authentication service failed. Check the server configuration and logs.' });
    return true;
  }
}
