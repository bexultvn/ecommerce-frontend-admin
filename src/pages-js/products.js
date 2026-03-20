import { getAll, createProduct, updateProduct, deleteProduct } from '../services/productService.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { showProductFormModal } from '../components/productFormModal.js';

export const template = `
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <button id="add-product-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add Product
      </button>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
      <input id="search-input" type="text" placeholder="Search products..."
        class="flex-1 min-w-48 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors" />
      <select id="category-filter"
        class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
      </select>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div id="products-table"></div>
      <div id="pagination" class="flex items-center justify-between px-4 py-3 border-t border-gray-100"></div>
    </div>
  </div>
`;

export async function init() {
  const PAGE_SIZE = 10;
  let allProducts = await getAll();
  let searchQuery = '';
  let categoryFilter = '';
  let currentPage = 1;

  function getFiltered() {
    return allProducts
      .filter(p => !categoryFilter || p.categoryName === categoryFilter)
      .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())));
  }

  function renderTable() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const tableContainer = document.getElementById('products-table');
    if (!tableContainer) return;

    if (paginated.length === 0) {
      tableContainer.innerHTML = '<p class="text-gray-500 text-sm p-6 text-center">No products found.</p>';
    } else {
      tableContainer.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Image</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                <th class="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.map(p => `
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <img src="${p.image || 'https://placehold.co/40x40?text=?'}" alt="${p.name}"
                      class="w-10 h-10 rounded object-cover border border-gray-100" />
                  </td>
                  <td class="py-3 px-4 font-medium max-w-48">
                    <span class="line-clamp-1">${p.name}</span>
                  </td>
                  <td class="py-3 px-4 text-gray-500">${p.categoryName}</td>
                  <td class="py-3 px-4 font-medium">$${p.price.toFixed(2)}</td>
                  <td class="py-3 px-4">${p.stock ?? p.availableQuantity}</td>
                  <td class="py-3 px-4">
                    <button data-action="edit" data-id="${p.id}"
                      class="text-blue-500 hover:text-blue-700 text-sm font-medium mr-3 transition-colors">Edit</button>
                    <button data-action="delete" data-id="${p.id}"
                      class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              `).join('')}
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

    tableContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'edit') {
        const product = allProducts.find(p => p.id === id);
        showProductFormModal({
          product,
          onSave: async (data) => {
            try {
              await updateProduct(id, data);
              allProducts = await getAll();
              renderTable();
              showToast('Product updated', 'success');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }
        });
      }

      if (action === 'delete') {
        const product = allProducts.find(p => p.id === id);
        showModal({
          title: 'Delete Product',
          body: `Are you sure you want to delete <strong>${product?.name || 'this product'}</strong>? This cannot be undone.`,
          onConfirm: async () => {
            try {
              await deleteProduct(id);
              allProducts = await getAll();
              renderTable();
              showToast('Product deleted', 'success');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }
        });
      }
    });
  }

  document.getElementById('add-product-btn').addEventListener('click', () => {
    showProductFormModal({
      onSave: async (data) => {
        try {
          await createProduct(data);
          allProducts = await getAll();
          currentPage = 1;
          renderTable();
          showToast('Product created', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    renderTable();
  });

  document.getElementById('category-filter').addEventListener('change', (e) => {
    categoryFilter = e.target.value;
    currentPage = 1;
    renderTable();
  });

  renderTable();
}
