export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const AUTH_STORAGE_KEY = 'hackverse_auth_user';
const USER_STORAGE_KEY = 'hackverse_local_users';

function readLocalUsers(): Record<string, { id: string; name: string; email: string; password: string }> {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      const demoUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@hackverse.app',
        password: 'Password123',
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ [demoUser.email]: demoUser }));
      return { [demoUser.email]: demoUser };
    }
    return JSON.parse(stored) as Record<string, { id: string; name: string; email: string; password: string }>;
  } catch {
    return {};
  }
}

function writeLocalUsers(users: Record<string, { id: string; name: string; email: string; password: string }>) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function setLocalSession(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function readLocalSession(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) as AuthUser : null;
  } catch {
    return null;
  }
}

async function requestLocalFallback<T>(path: string, body?: unknown): Promise<T> {
  if (path === '/api/auth/session') {
    return { user: readLocalSession() } as T;
  }

  if (path === '/api/auth/signup') {
    const values = body as { name?: string; email?: string; password?: string } | undefined;
    const name = values?.name?.trim() || 'User';
    const email = (values?.email || '').trim().toLowerCase();
    const password = values?.password || '';

    if (!email || !password || password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    const users = readLocalUsers();
    if (users[email]) {
      throw new Error('An account with that email already exists.');
    }

    const user: AuthUser = {
      id: `local-${Date.now()}`,
      name,
      email,
    };

    users[email] = {
      ...user,
      password,
    };
    writeLocalUsers(users);
    setLocalSession(user);
    return { user } as T;
  }

  if (path === '/api/auth/login') {
    const values = body as { email?: string; password?: string } | undefined;
    const email = (values?.email || '').trim().toLowerCase();
    const password = values?.password || '';
    const users = readLocalUsers();
    const savedUser = users[email];

    if (!savedUser || savedUser.password !== password) {
      throw new Error('Email or password is incorrect.');
    }

    const user: AuthUser = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    };
    setLocalSession(user);
    return { user } as T;
  }

  if (path === '/api/auth/logout') {
    setLocalSession(null);
    return {} as T;
  }

  throw new Error('Authentication API unavailable.');
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  try {
    const response = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = typeof result.error === 'string' ? result.error : 'Authentication request failed.';
      if (response.status === 404 || response.status === 503) {
        return requestLocalFallback<T>(path, body);
      }
      throw new Error(message);
    }

    return result as T;
  } catch (error) {
    if (error instanceof TypeError) {
      return requestLocalFallback<T>(path, body);
    }
    if (error instanceof Error && error.message.includes('Authentication API unavailable')) {
      throw error;
    }
    if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
      return requestLocalFallback<T>(path, body);
    }
    throw error;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const result = await request<{ user: AuthUser | null }>('/api/auth/session');
  return result.user;
}

export async function signUp(name: string, email: string, password: string): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>('/api/auth/signup', { name, email, password });
  return result.user;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>('/api/auth/login', { email, password });
  return result.user;
}

export async function signOut(): Promise<void> {
  await request('/api/auth/logout', {});
}
