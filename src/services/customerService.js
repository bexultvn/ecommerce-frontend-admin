import { apiGet, apiDelete } from './api.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { config } from '../config/config.js';

function normalize(c) {
  return {
    id: c.id,
    firstName: c.firstName || c.firstname,
    lastName: c.lastName || c.lastname,
    email: c.email,
    address: c.address || { street: '', houseNumber: '', zipCode: '' }
  };
}

export async function findAllCustomers() {
  if (config.USE_MOCK) {
    return lsGetAll('users').map(normalize);
  }
  return (await apiGet('/customer')).map(normalize);
}

export async function findCustomerById(id) {
  if (config.USE_MOCK) {
    const user = lsGetAll('users').find(u => u.id === String(id));
    return user ? normalize(user) : null;
  }
  try {
    return normalize(await apiGet(`/customer/${id}`));
  } catch {
    return null;
  }
}

export async function deleteCustomer(id) {
  if (config.USE_MOCK) {
    const updated = lsGetAll('users').filter(u => u.id !== String(id));
    lsSet('users', updated);
    return;
  }
  return apiDelete(`/customer/${id}`);
}
