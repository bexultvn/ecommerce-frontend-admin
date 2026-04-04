import { setUser, clearUser } from '../core/auth.js';
import { config } from '../config/config.js';
import { mockAdminUsers } from '../storage/mockData.js';

export async function login(email, password) {
  if (config.MOCK.auth) {
    const admin = mockAdminUsers.find(u => u.email === email && u.password === password);
    if (!admin) throw new Error('Invalid credentials');
    const userToStore = { uid: admin.id, email: admin.email, token: 'mock-token', role: 'admin' };
    setUser(userToStore);
    return userToStore;
  }

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
