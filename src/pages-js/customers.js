import { findAllCustomers, deleteCustomer } from '../services/customerService.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export const template = `
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Customers</h1>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
      <input id="search-input" type="text" placeholder="Search by name or email..."
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors" />
    </div>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div id="customers-table"></div>
      <div id="pagination" class="flex items-center justify-between px-4 py-3 border-t border-gray-100"></div>
    </div>
  </div>
`;

export async function init() {
  const PAGE_SIZE = 10;
  let allCustomers = await findAllCustomers();
  let searchQuery = '';
  let currentPage = 1;

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

    const tableContainer = document.getElementById('customers-table');
    if (!tableContainer) return;

    if (paginated.length === 0) {
      tableContainer.innerHTML = '<p class="text-gray-500 text-sm p-6 text-center">No customers found.</p>';
    } else {
      tableContainer.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Address</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.map(c => {
                const addr = c.address;
                const addrStr = addr && (addr.street || addr.houseNumber || addr.zipCode)
                  ? `${addr.street} ${addr.houseNumber}, ${addr.zipCode}`.trim().replace(/^,|,$/, '').trim()
                  : '-';
                const initial = (c.firstName || c.email || '?').charAt(0).toUpperCase();
                return `
                  <tr class="border-b border-gray-50 hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                          ${initial}
                        </div>
                        <span class="font-medium">${c.firstName || ''} ${c.lastName || ''}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-600">${c.email}</td>
                    <td class="py-3 px-4 text-gray-500 text-xs">${addrStr}</td>
                    <td class="py-3 px-4">
                      <button data-action="delete" data-id="${c.id}"
                        class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

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

    tableContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn || btn.dataset.action !== 'delete') return;
      const id = btn.dataset.id;
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
    });
  }

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    renderTable();
  });

  renderTable();
}
