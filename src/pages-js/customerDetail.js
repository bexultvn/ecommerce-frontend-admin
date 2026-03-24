import { findCustomerById, deleteCustomer } from '../services/customerService.js';
import { lsGetAll } from '../storage/localStorage.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-5xl mx-auto">
    <div id="customer-detail-content">
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    </div>
  </div>
`;

const STATUS_CONFIG = {
  Processing: { cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500' },
  Shipped:    { cls: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',    dot: 'bg-blue-500' },
  Delivered:  { cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Cancelled:  { cls: 'bg-red-50 text-red-700 ring-1 ring-red-200',       dot: 'bg-red-500' }
};

function statusBadge(status) {
  const cfg = STATUS_CONFIG[status] || { cls: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' };
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}">
    <span class="w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0"></span>${status}
  </span>`;
}

const AVATAR_COLORS = [
  'from-orange-500 to-violet-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-pink-500 to-rose-600',
  'from-cyan-400 to-blue-600',
];

export async function init({ id }) {
  const contentEl = document.getElementById('customer-detail-content');
  if (!contentEl) return;

  const customer = await findCustomerById(id);
  if (!customer) {
    contentEl.innerHTML = `
      <div class="text-center py-20">
        <p class="text-slate-500 mb-4">Customer not found.</p>
        <a href="#/customers" class="text-orange-600 hover:underline text-sm font-medium">← Back to Customers</a>
      </div>`;
    return;
  }

  const allOrders = lsGetAll('orders');
  const customerOrders = allOrders.filter(o => o.userId === customer.id).reverse();
  const totalSpent = customerOrders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;
  const deliveredCount = customerOrders.filter(o => o.status === 'Delivered').length;

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  const initial = fullName.charAt(0).toUpperCase();
  const gradIdx = parseInt(id.replace(/\D/g, '')) % AVATAR_COLORS.length;
  const avatarGrad = AVATAR_COLORS[gradIdx];

  const addr = customer.address;
  const addrStr = addr && (addr.street || addr.houseNumber)
    ? `${addr.street} ${addr.houseNumber}, ${addr.zipCode}`.trim()
    : 'No address on file';

  contentEl.innerHTML = `
    <!-- Back -->
    <div class="flex items-center justify-between mb-6">
      <a href="#/customers" class="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors text-sm font-medium group">
        <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Customers
      </a>
      <button id="delete-customer-btn"
        class="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Delete Customer
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <!-- Profile card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGrad} text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
            ${initial}
          </div>
          <h2 class="text-xl font-bold text-slate-900">${fullName}</h2>
          <p class="text-slate-500 text-sm mt-1">${customer.email}</p>
          ${customer.registeredDate ? `<p class="text-xs text-slate-400 mt-1">Joined ${customer.registeredDate}</p>` : ''}
        </div>

        <div class="border-t border-slate-100 mt-5 pt-5 space-y-3">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm text-slate-600">${customer.email}</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-sm text-slate-600">${addrStr}</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
            </svg>
            <span class="text-sm font-mono text-slate-500">ID: ${customer.id}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="lg:col-span-2 grid grid-cols-2 gap-3">
        ${[
          { label: 'Total Orders', value: customerOrders.length, icon: 'bg-orange-50 text-orange-600', svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>` },
          { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: 'bg-emerald-50 text-emerald-600', svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` },
          { label: 'Avg Order Value', value: `$${avgOrder.toFixed(2)}`, icon: 'bg-violet-50 text-violet-600', svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>` },
          { label: 'Delivered Orders', value: deliveredCount, icon: 'bg-amber-50 text-amber-600', svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>` },
        ].map(s => `
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl ${s.icon} flex items-center justify-center flex-shrink-0">${s.svg}</div>
            <div>
              <p class="text-xl font-bold text-slate-900">${s.value}</p>
              <p class="text-xs text-slate-500">${s.label}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Order history -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-semibold text-slate-900">Order History</h3>
        <span class="text-sm text-slate-500">${customerOrders.length} order${customerOrders.length !== 1 ? 's' : ''}</span>
      </div>
      ${customerOrders.length === 0
        ? `<div class="p-12 text-center text-slate-500 text-sm">No orders yet.</div>`
        : `<div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th class="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Order ID</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Items</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th class="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                ${customerOrders.map(o => `
                  <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onclick="window.location.hash='#/orders/${o.id}'">
                    <td class="py-3.5 px-5">
                      <span class="font-mono text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">#${o.id.toUpperCase()}</span>
                    </td>
                    <td class="py-3.5 px-4 text-slate-500 text-xs max-w-48">
                      <span class="line-clamp-1">${(o.items || []).map(i => `${i.name} ×${i.qty}`).join(', ')}</span>
                    </td>
                    <td class="py-3.5 px-4 font-bold text-slate-900">$${(o.total || 0).toFixed(2)}</td>
                    <td class="py-3.5 px-4">${statusBadge(o.status)}</td>
                    <td class="py-3.5 px-4 text-slate-400 text-xs">${o.date || '—'}</td>
                    <td class="py-3.5 px-4">
                      <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>`
      }
    </div>
  `;

  document.getElementById('delete-customer-btn').addEventListener('click', () => {
    showModal({
      title: 'Delete Customer',
      body: `Are you sure you want to delete <strong>${fullName}</strong>? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteCustomer(customer.id);
          showToast('Customer deleted', 'success');
          navigate('/customers');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });
}
