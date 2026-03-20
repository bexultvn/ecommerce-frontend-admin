import { getAllOrders, updateOrderStatus } from '../services/orderService.js';
import { lsGetAll } from '../storage/localStorage.js';
import { showToast } from '../components/toast.js';

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CLASSES = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export const template = `
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Orders</h1>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
      <select id="status-filter"
        class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors">
        <option value="">All Statuses</option>
        ${STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
      <input id="search-input" type="text" placeholder="Search by order ID or customer..."
        class="flex-1 min-w-48 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors" />
    </div>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div id="orders-table"></div>
      <div id="pagination" class="flex items-center justify-between px-4 py-3 border-t border-gray-100"></div>
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

  function getFiltered() {
    return allOrders
      .filter(o => !statusFilter || o.status === statusFilter)
      .filter(o => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return o.id.toLowerCase().includes(q) || getUserName(o.userId).toLowerCase().includes(q);
      });
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      allOrders = await getAllOrders();
      renderTable();
      showToast('Order status updated', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function renderTable() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const paginated = [...filtered].reverse().slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const tableContainer = document.getElementById('orders-table');
    if (!tableContainer) return;

    if (paginated.length === 0) {
      tableContainer.innerHTML = '<p class="text-gray-500 text-sm p-6 text-center">No orders found.</p>';
    } else {
      tableContainer.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.map(o => {
                const itemsSummary = (o.items || [])
                  .map(i => `${i.name} ×${i.qty}`)
                  .join(', ');
                const statusCls = STATUS_CLASSES[o.status] || 'bg-gray-100 text-gray-800';
                const statusOptions = STATUSES
                  .map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`)
                  .join('');
                return `
                  <tr class="border-b border-gray-50 hover:bg-gray-50">
                    <td class="py-3 px-4 font-mono text-xs text-gray-500">${o.id}</td>
                    <td class="py-3 px-4 font-medium">${getUserName(o.userId)}</td>
                    <td class="py-3 px-4 text-gray-500 max-w-48">
                      <span class="line-clamp-1 text-xs">${itemsSummary || '-'}</span>
                    </td>
                    <td class="py-3 px-4 font-medium">$${(o.total || 0).toFixed(2)}</td>
                    <td class="py-3 px-4">
                      <select data-order-id="${o.id}"
                        class="status-select border border-gray-200 rounded px-2 py-1 text-xs font-medium ${statusCls} focus:outline-none cursor-pointer">
                        ${statusOptions}
                      </select>
                    </td>
                    <td class="py-3 px-4 text-gray-500 text-xs">${o.date || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    tableContainer.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        handleStatusChange(orderId, newStatus);
      });
    });

    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    paginationEl.innerHTML = `
      <span class="text-sm text-gray-500">
        Showing ${filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}
      </span>
      <div class="flex gap-2">
        <button id="prev-page" ${currentPage <= 1 ? 'disabled' : ''}
          class="px-3 py-1 border border-gray-300 rounded text-sm ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'} transition-colors">Prev</button>
        <button id="next-page" ${currentPage >= totalPages ? 'disabled' : ''}
          class="px-3 py-1 border border-gray-300 rounded text-sm ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'} transition-colors">Next</button>
      </div>
    `;

    document.getElementById('prev-page')?.addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; renderTable(); }
    });
    document.getElementById('next-page')?.addEventListener('click', () => {
      if (currentPage < totalPages) { currentPage++; renderTable(); }
    });
  }

  document.getElementById('status-filter').addEventListener('change', (e) => {
    statusFilter = e.target.value;
    currentPage = 1;
    renderTable();
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    renderTable();
  });

  renderTable();
}
