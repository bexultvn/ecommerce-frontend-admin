import { apiGet, apiPut } from './api.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { config } from '../config/config.js';

const ORDERS_KEY = 'orders';

export async function getAllOrders() {
  if (config.MOCK.orders) {
    return lsGetAll(ORDERS_KEY);
  }
  return apiGet('/orders');
}

export async function updateOrderStatus(id, status) {
  if (config.MOCK.orders) {
    const orders = lsGetAll(ORDERS_KEY);
    const idx = orders.findIndex(o => o.id === String(id));
    if (idx === -1) throw new Error('Order not found');
    orders[idx].status = status;
    lsSet(ORDERS_KEY, orders);
    return orders[idx];
  }
  return apiPut(`/orders/${id}/status`, { status });
}
