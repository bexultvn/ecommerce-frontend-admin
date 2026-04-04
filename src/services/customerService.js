import { getUser } from '../core/auth.js';
import { config } from '../config/config.js';
import { mockUsers } from '../storage/mockData.js';

function authHeaders() {
  const user = getUser();
  const headers = { 'Content-Type': 'application/json' };
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
  return headers;
}

function normalize(c) {
  return {
    id: c.uid ?? c.id,
    firstName: c.first_name ?? c.firstName,
    lastName: c.last_name ?? c.lastName,
    email: c.email,
    registeredDate: c.created_at ? new Date(c.created_at).toLocaleDateString() : (c.registeredDate ?? null),
    is_verified: c.is_verified ?? false,
  };
}

export async function findAllCustomers() {
  if (config.MOCK.customers) return mockUsers.map(normalize);
  const res = await fetch(`${config.BASE_URL}/users/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch customers');
  return (await res.json()).map(normalize);
}

export async function findCustomerById(id) {
  if (config.MOCK.customers) return mockUsers.map(normalize).find(c => c.id === id) || null;
  try {
    const res = await fetch(`${config.BASE_URL}/users/${id}`, { headers: authHeaders() });
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  }
}

export async function deleteCustomer(_id) {
  throw new Error('Delete customer is not supported yet');
}
