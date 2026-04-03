import { setUser, clearUser } from '../core/auth.js';
import { config } from '../config/config.js';

export async function login(email, password) {
  const res = await fetch(`${config.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid credentials');
  }

  const data = await res.json();
  const userToStore = {
    uid: data.user.uid,
    email: data.user.email,
    token: data.access_token,
    refresh_token: data.refresh_token,
    role: 'admin',
  };
  setUser(userToStore);
  return userToStore;
}

export function logout() {
  clearUser();
}
