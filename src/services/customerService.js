import { getUser } from '../core/auth.js';
import { config } from '../config/config.js';

function authHeaders() {
  const user = getUser();
  const headers = { 'Content-Type': 'application/json' };
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
  return headers;
}

function normalize(c) {
  return {
    id: c.uid,
    firstName: c.first_name,
    lastName: c.last_name,
    email: c.email,
    registeredDate: c.created_at ? new Date(c.created_at).toLocaleDateString() : null,
    is_verified: c.is_verified,
  };
}

export async function findAllCustomers() {
  const res = await fetch(`${config.BASE_URL}/users/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch customers');
  const data = await res.json();
  return data.map(normalize);
}

export async function findCustomerById(id) {
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
