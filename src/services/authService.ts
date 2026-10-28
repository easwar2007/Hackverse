export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach the authentication server. Make sure the development server is running and try again.');
    }
    throw error;
  }
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof result.error === 'string'
      ? result.error
      : response.status === 404
        ? 'The authentication API is unavailable. Start the app with npm run dev and try again.'
        : `Authentication request failed (${response.status}).`;
    throw new Error(message);
  }

  return result as T;
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
