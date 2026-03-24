import { findAllCustomers, deleteCustomer } from '../services/customerService.js';
import { lsGetAll } from '../storage/localStorage.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Customers</h1>
        <p id="customers-count" class="text-sm text-gray-400 mt-0.5"></p>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-5 shadow-sm">
      <div class="relative">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
        </svg>
        <input id="search-input" type="text" placeholder="Search by name or email..."
          class="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-xl text-sm bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm">
      <div id="customers-table"></div>
      <div id="pagination" class="flex items-center justify-between px-5 py-3 border-t border-gray-700"></div>
    </div>
  </div>
`;

const AVATAR_COLORS = [
  'bg-red-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-rose-500'
];

function avatarColor(id) {
  const idx = parseInt(id.replace(/\D/g, '')) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] || AVATAR_COLORS[0];
}

export async function init() {
  const PAGE_SIZE = 10;
  let allCustomers = await findAllCustomers();
  const allOrders = lsGetAll('orders');
  let searchQuery = '';
  let currentPage = 1;

  // Build order stats per customer
  function getCustomerStats(customerId) {
    const customerOrders = allOrders.filter(o => o.userId === customerId);
    const totalSpent = customerOrders.reduce((s, o) => s + (o.total || 0), 0);
    return { orderCount: customerOrders.length, totalSpent };
  }

  function getFiltered() {
    if (!searchQuery) return allCustomers;
    const q = searchQuery.toLowerCase();
    return allCustomers.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  function renderTable() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const countEl = document.getElementById('customers-count');
    if (countEl) countEl.textContent = `${allCustomers.length} customer${allCustomers.length !== 1 ? 's' : ''}`;

    const tableEl = document.getElementById('customers-table');
    if (!tableEl) return;

    if (paginated.length === 0) {
      tableEl.innerHTML = `
        <div class="p-16 text-center">
          <svg class="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p class="text-gray-400 font-medium">No customers found</p>
        </div>`;
    } else {
      tableEl.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th class="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Address</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Orders</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Spent</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
                <th class="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              ${paginated.map(c => {
                const addr = c.address;
                const addrStr = addr && (addr.street || addr.houseNumber)
                  ? `${addr.street} ${addr.houseNumber}, ${addr.zipCode}`.trim()
                  : '—';
                const initial = (c.firstName || c.email || '?').charAt(0).toUpperCase();
                const avColor = avatarColor(c.id);
                const { orderCount, totalSpent } = getCustomerStats(c.id);
                return `
                  <tr class="border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors cursor-pointer" data-customer-id="${c.id}">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full ${avColor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          ${initial}
                        </div>
                        <div>
                          <p class="font-semibold text-white">${c.firstName || ''} ${c.lastName || ''}</p>
                          <p class="text-xs text-gray-500">ID: ${c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-gray-300">${c.email}</td>
                    <td class="py-3.5 px-4 text-gray-500 text-xs">${addrStr}</td>
                    <td class="py-3.5 px-4">
                      <span class="font-semibold text-white">${orderCount}</span>
                      <span class="text-gray-500 text-xs ml-1">orders</span>
                    </td>
                    <td class="py-3.5 px-4 font-semibold text-white">$${totalSpent.toFixed(2)}</td>
                    <td class="py-3.5 px-4 text-gray-500 text-xs">${c.registeredDate || '—'}</td>
                    <td class="py-3.5 px-4 text-right">
                      <button data-action="delete" data-id="${c.id}"
                        class="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>`;
    }

    // Pagination
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    if (totalPages <= 1 && filtered.length > 0) {
      paginationEl.innerHTML = `<span class="text-sm text-gray-400">${filtered.length} customer${filtered.length !== 1 ? 's' : ''}</span>`;
    } else {
      paginationEl.innerHTML = `
        <span class="text-sm text-gray-400">
          ${filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}
        </span>
        <div class="flex gap-2">
          <button id="prev-page" ${currentPage <= 1 ? 'disabled' : ''}
            class="px-4 py-2 border border-gray-600 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700'} transition-colors">Prev</button>
          <span class="px-3 py-2 text-sm font-medium text-gray-400">${currentPage} / ${totalPages}</span>
          <button id="next-page" ${currentPage >= totalPages ? 'disabled' : ''}
            class="px-4 py-2 border border-gray-600 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700'} transition-colors">Next</button>
        </div>`;

      document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderTable(); }
      });
      document.getElementById('next-page')?.addEventListener('click', () => {
        if (currentPage < totalPages) { currentPage++; renderTable(); }
      });
    }

    // Row click → detail, delete button
    tableEl.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        const customer = allCustomers.find(c => c.id === id);
        showModal({
          title: 'Delete Customer',
          body: `Are you sure you want to delete <strong>${customer?.firstName || ''} ${customer?.lastName || ''}</strong>? This cannot be undone.`,
          onConfirm: async () => {
            try {
              await deleteCustomer(id);
              allCustomers = await findAllCustomers();
              renderTable();
              showToast('Customer deleted', 'success');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }
        });
        return;
      }

      const row = e.target.closest('[data-customer-id]');
      if (row) navigate(`/customers/${row.dataset.customerId}`);
    });
  }

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    renderTable();
  });

  renderTable();
}
