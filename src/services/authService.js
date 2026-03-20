import { setUser, clearUser } from '../core/auth.js';
import { lsGetAll } from '../storage/localStorage.js';

export function login(email, password) {
  const admins = lsGetAll('admin_users');
  const admin = admins.find(a => a.email === email && a.password === password);
  if (!admin) {
    throw new Error('Invalid admin credentials');
  }
  const { password: _pw, ...safeAdmin } = admin;
  setUser(safeAdmin);
  return safeAdmin;
}

export function logout() {
  clearUser();
}
