import { apiGet } from './api.js';
import { config } from '../config/config.js';
import { mockUsers } from '../storage/mockData.js';

function normalize(c) {
  return {
    id: c.uid ?? c.id,
    firstName: c.first_name ?? c.firstName,
    lastName: c.last_name ?? c.lastName,
    email: c.email,
    registeredDate: c.created_at
      ? new Date(c.created_at).toLocaleDateString()
      : (c.registeredDate ?? null),
    is_verified: c.is_verified ?? false,
  };
}

export async function findAllCustomers() {
  if (config.MOCK.customers) return mockUsers.map(normalize);

  const data = await apiGet(config.API.user, '/users/');
  return data.map(normalize);
}

export async function findCustomerById(id) {
  if (config.MOCK.customers) {
    return mockUsers.map(normalize).find(c => c.id === id) || null;
  }

  try {
    const data = await apiGet(config.API.user, `/users/${id}`);
    return normalize(data);
  } catch {
    return null;
  }
}

export async function deleteCustomer(_id) {
  throw new Error('Delete customer is not supported yet');
}