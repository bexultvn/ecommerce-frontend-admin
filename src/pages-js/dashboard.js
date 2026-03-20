import { lsGetAll } from '../storage/localStorage.js';

export const template = `
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    <div id="stats-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"></div>
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold mb-4">Recent Orders</h2>
      <div id="recent-orders-table"></div>
    </div>
  </div>
`;

function statusBadge(status) {
  const map = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  };
  const cls = map[status] || 'bg-gray-100 text-gray-800';
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}">${status}</span>`;
}

export function init() {
  const products = lsGetAll('products');
  const users = lsGetAll('users');
  const orders = lsGetAll('orders');
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const statsGrid = document.getElementById('stats-grid');
  statsGrid.innerHTML = [
    {
      label: 'Total Products',
      value: products.length,
      color: 'bg-blue-50 text-blue-500',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
    },
    {
      label: 'Total Customers',
      value: users.length,
      color: 'bg-purple-50 text-purple-500',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
    },
    {
      label: 'Total Orders',
      value: orders.length,
      color: 'bg-yellow-50 text-yellow-500',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
    },
    {
      label: 'Total Revenue',
      value: `$${revenue.toFixed(2)}`,
      color: 'bg-red-50 text-red-500',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    }
  ].map(({ label, value, color, icon }) => `
    <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div class="w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0">
        ${icon}
      </div>
      <div>
        <div class="text-2xl font-bold">${value}</div>
        <div class="text-sm text-gray-500">${label}</div>
      </div>
    </div>
  `).join('');

  const allUsers = lsGetAll('users');
  const getUserName = (userId) => {
    const u = allUsers.find(u => u.id === String(userId));
    return u ? `${u.firstName} ${u.lastName}` : userId;
  };

  const recentOrders = [...orders].reverse().slice(0, 5);
  const ordersContainer = document.getElementById('recent-orders-table');

  if (recentOrders.length === 0) {
    ordersContainer.innerHTML = '<p class="text-gray-500 text-sm">No orders yet.</p>';
    return;
  }

  ordersContainer.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left py-2 px-3 font-medium text-gray-500">Order ID</th>
            <th class="text-left py-2 px-3 font-medium text-gray-500">Customer</th>
            <th class="text-left py-2 px-3 font-medium text-gray-500">Total</th>
            <th class="text-left py-2 px-3 font-medium text-gray-500">Status</th>
            <th class="text-left py-2 px-3 font-medium text-gray-500">Date</th>
          </tr>
        </thead>
        <tbody>
          ${recentOrders.map(o => `
            <tr class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3 font-mono text-xs text-gray-500">${o.id}</td>
              <td class="py-3 px-3">${getUserName(o.userId)}</td>
              <td class="py-3 px-3 font-medium">$${(o.total || 0).toFixed(2)}</td>
              <td class="py-3 px-3">${statusBadge(o.status)}</td>
              <td class="py-3 px-3 text-gray-500">${o.date || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
