import { getAllOrders, updateOrderStatus } from '../services/orderService.js';
import { lsGetAll } from '../storage/localStorage.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CONFIG = {
  Processing: { cls: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30',   dot: 'bg-amber-500' },
  Shipped:    { cls: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30',      dot: 'bg-blue-500' },
  Delivered:  { cls: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30', dot: 'bg-emerald-500' },
  Cancelled:  { cls: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/30',         dot: 'bg-red-500' }
};

function statusBadge(status) {
  const cfg = STATUS_CONFIG[status] || { cls: 'bg-gray-700 text-gray-300', dot: 'bg-gray-400' };
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}">
    <span class="w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0"></span>${status}
  </span>`;
}

export const template = `
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Orders</h1>
        <p id="orders-count" class="text-sm text-gray-400 mt-0.5"></p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-5 flex flex-wrap gap-3 shadow-sm">
      <div class="relative flex-1 min-w-52">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
        </svg>
        <input id="search-input" type="text" placeholder="Search by order ID or customer..."
          class="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-xl text-sm bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
      </div>
      <select id="status-filter"
        class="border border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-700">
        <option value="">All Statuses</option>
        ${STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>

    <!-- Status summary -->
    <div id="status-summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"></div>

    <!-- Table -->
    <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm">
      <div id="orders-table"></div>
      <div id="pagination" class="flex items-center justify-between px-5 py-3 border-t border-gray-700"></div>
    </div>
  </div>
`;

export async function init() {
  const PAGE_SIZE = 10;
  let allOrders = await getAllOrders();
  const allUsers = lsGetAll('users');
  let statusFilter = '';
  let searchQuery = '';
  let currentPage = 1;

  function getUserName(userId) {
    const u = allUsers.find(u => u.id === String(userId));
    return u ? `${u.firstName} ${u.lastName}` : String(userId);
  }

  // Status summary cards
  function renderStatusSummary() {
    const summaryEl = document.getElementById('status-summary');
    if (!summaryEl) return;
    const counts = STATUSES.reduce((acc, s) => {
      acc[s] = allOrders.filter(o => o.status === s).length;
      return acc;
    }, {});
    const cfg = STATUS_CONFIG;
    summaryEl.innerHTML = STATUSES.map(s => `
      <div class="bg-gray-800 rounded-xl border border-gray-700 px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-red-500 transition-colors ${statusFilter === s ? 'border-red-500 ring-2 ring-red-900/40' : ''}"
           data-status-quick="${s}">
        <span class="w-2.5 h-2.5 rounded-full ${cfg[s].dot} flex-shrink-0"></span>
        <div>
          <p class="text-lg font-bold text-white">${counts[s]}</p>
          <p class="text-xs text-gray-400">${s}</p>
        </div>
      </div>
    `).join('');

    summaryEl.querySelectorAll('[data-status-quick]').forEach(el => {
      el.addEventListener('click', () => {
        const s = el.dataset.statusQuick;
        statusFilter = statusFilter === s ? '' : s;
        document.getElementById('status-filter').value = statusFilter;
        currentPage = 1;
        renderStatusSummary();
        renderTable();
      });
    });
  }

  function getFiltered() {
    return [...allOrders]
      .reverse()
      .filter(o => !statusFilter || o.status === statusFilter)
      .filter(o => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return o.id.toLowerCase().includes(q) || getUserName(o.userId).toLowerCase().includes(q);
      });
  }

  function renderTable() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const countEl = document.getElementById('orders-count');
    if (countEl) countEl.textContent = `${allOrders.length} order${allOrders.length !== 1 ? 's' : ''}`;

    const tableEl = document.getElementById('orders-table');
    if (!tableEl) return;

    if (paginated.length === 0) {
      tableEl.innerHTML = `
        <div class="p-16 text-center">
          <svg class="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-gray-400 font-medium">No orders found</p>
        </div>`;
    } else {
      tableEl.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th class="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order ID</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Items</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th class="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              ${paginated.map(o => {
                const itemsSummary = (o.items || []).map(i => `${i.name} ×${i.qty}`).join(', ');
                return `
                  <tr class="border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors cursor-pointer" data-order-id="${o.id}">
                    <td class="py-3.5 px-5">
                      <span class="font-mono text-xs font-semibold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg">#${o.id.toUpperCase()}</span>
                    </td>
                    <td class="py-3.5 px-4 font-semibold text-white">${getUserName(o.userId)}</td>
                    <td class="py-3.5 px-4 text-gray-400 max-w-44">
                      <span class="line-clamp-1 text-xs">${itemsSummary || '—'}</span>
                      <span class="text-xs text-gray-500">${(o.items || []).length} item${(o.items || []).length !== 1 ? 's' : ''}</span>
                    </td>
                    <td class="py-3.5 px-4 font-bold text-white">$${(o.total || 0).toFixed(2)}</td>
                    <td class="py-3.5 px-4">${statusBadge(o.status)}</td>
                    <td class="py-3.5 px-4 text-gray-500 text-xs">${o.date || '—'}</td>
                    <td class="py-3.5 px-4 text-right">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>`;
    }

    // Row click → detail
    tableEl.addEventListener('click', (e) => {
      const row = e.target.closest('[data-order-id]');
      if (row) navigate(`/orders/${row.dataset.orderId}`);
    });

    // Pagination
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    if (totalPages <= 1 && filtered.length > 0) {
      paginationEl.innerHTML = `<span class="text-sm text-gray-400">${filtered.length} order${filtered.length !== 1 ? 's' : ''}</span>`;
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
  }

  document.getElementById('status-filter').addEventListener('change', (e) => {
    statusFilter = e.target.value;
    currentPage = 1;
    renderStatusSummary();
    renderTable();
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    renderTable();
  });

  renderStatusSummary();
  renderTable();
}
