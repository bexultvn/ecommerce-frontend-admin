import { setUser, clearUser, getUser } from '../core/auth.js';
import { config } from '../config/config.js';
import { mockAdminUsers } from '../storage/mockData.js';

export async function login(email, password) {
  if (config.MOCK.auth) {
    const admin = mockAdminUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const userToStore = {
      uid: admin.id,
      email: admin.email,
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      role: 'admin',
    };

    setUser(userToStore);
    return userToStore;
  }

  const res = await fetch(`${config.API.auth}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || 'Invalid credentials');
  }

  const userToStore = {
    uid: data.user.uid,
    email: data.user.email,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    role: 'admin',
  };

  setUser(userToStore);
  return userToStore;
}

export function logout() {
  clearUser();
}

export function getCurrentUser() {
  return getUser();
}