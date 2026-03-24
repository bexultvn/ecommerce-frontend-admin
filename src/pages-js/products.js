import { getAll, createProduct, updateProduct, deleteProduct } from '../services/productService.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { showProductFormModal } from '../components/productFormModal.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Products</h1>
        <p id="products-count" class="text-sm text-gray-400 mt-0.5"></p>
      </div>
      <button id="add-product-btn"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
        </svg>
        Add Product
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-5 flex flex-wrap gap-3 shadow-sm">
      <div class="relative flex-1 min-w-52">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
        </svg>
        <input id="search-input" type="text" placeholder="Search products..."
          class="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-xl text-sm bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
      </div>
      <select id="category-filter"
        class="border border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-700">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
      </select>
    </div>

    <!-- Grid -->
    <div id="products-grid"></div>

    <!-- Pagination -->
    <div id="pagination" class="flex items-center justify-between mt-5"></div>
  </div>
`;

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-500/10 text-blue-400',
  Clothing:    'bg-pink-500/10 text-pink-400',
  Books:       'bg-amber-500/10 text-amber-400',
  Home:        'bg-emerald-500/10 text-emerald-400'
};

function stockBadge(stock) {
  if (stock === 0) return `<span class="text-xs font-medium bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">Out of stock</span>`;
  if (stock < 10) return `<span class="text-xs font-medium bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Low: ${stock}</span>`;
  return `<span class="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">${stock} in stock</span>`;
}

export async function init() {
  const PAGE_SIZE = 12;
  let allProducts = await getAll();
  let searchQuery = '';
  let categoryFilter = '';
  let currentPage = 1;

  function getFiltered() {
    return allProducts
      .filter(p => !categoryFilter || p.categoryName === categoryFilter)
      .filter(p => !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }

  function renderGrid() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const countEl = document.getElementById('products-count');
    if (countEl) countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

    const gridEl = document.getElementById('products-grid');
    if (!gridEl) return;

    if (paginated.length === 0) {
      gridEl.innerHTML = `
        <div class="bg-gray-800 rounded-2xl border border-gray-700 p-16 text-center shadow-sm">
          <svg class="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <p class="text-gray-400 font-medium">No products found</p>
          <p class="text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
        </div>`;
    } else {
      const catCls = (cat) => CATEGORY_COLORS[cat] || 'bg-gray-700 text-gray-400';
      gridEl.innerHTML = `
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${paginated.map(p => `
            <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <!-- Image -->
              <div class="relative overflow-hidden bg-gray-700 cursor-pointer" data-navigate="/products/${p.id}">
                <img src="${p.image || 'https://placehold.co/400x300?text=No+Image'}" alt="${p.name}"
                  class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <!-- Hover actions -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button data-action="edit" data-id="${p.id}"
                    class="bg-gray-800 text-gray-200 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                    Edit
                  </button>
                  <button data-action="delete" data-id="${p.id}"
                    class="bg-gray-800 text-gray-200 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                    Delete
                  </button>
                </div>
              </div>
              <!-- Info -->
              <div class="p-4">
                <span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full ${catCls(p.categoryName)} mb-2">${p.categoryName}</span>
                <h3 class="font-semibold text-white text-sm line-clamp-1 leading-snug mb-3 cursor-pointer hover:text-red-500 transition-colors"
                    data-navigate="/products/${p.id}">${p.name}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-white">$${p.price.toFixed(2)}</span>
                  ${stockBadge(p.stock ?? p.availableQuantity ?? 0)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>`;
    }

    // Pagination
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    if (totalPages <= 1 && filtered.length > 0) {
      paginationEl.innerHTML = '';
    } else {
      paginationEl.innerHTML = `
        <span class="text-sm text-gray-400">
          Showing ${filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}
        </span>
        <div class="flex gap-2">
          <button id="prev-page" ${currentPage <= 1 ? 'disabled' : ''}
            class="px-4 py-2 border border-gray-600 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700'} transition-colors">Prev</button>
          <span class="px-3 py-2 text-sm font-medium text-gray-400">${currentPage} / ${totalPages}</span>
          <button id="next-page" ${currentPage >= totalPages ? 'disabled' : ''}
            class="px-4 py-2 border border-gray-600 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700'} transition-colors">Next</button>
        </div>`;

      document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderGrid(); }
      });
      document.getElementById('next-page')?.addEventListener('click', () => {
        if (currentPage < totalPages) { currentPage++; renderGrid(); }
      });
    }

    // Event delegation: navigate + edit + delete
    gridEl.addEventListener('click', async (e) => {
      // Navigate to detail page
      const navEl = e.target.closest('[data-navigate]');
      if (navEl && !e.target.closest('[data-action]')) {
        navigate(navEl.dataset.navigate);
        return;
      }

      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.dataset.action === 'edit') {
        const product = allProducts.find(p => p.id === id);
        showProductFormModal({
          product,
          onSave: async (data) => {
            try {
              await updateProduct(id, data);
              allProducts = await getAll();
              renderGrid();
              showToast('Product updated', 'success');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }
        });
      }

      if (btn.dataset.action === 'delete') {
        const product = allProducts.find(p => p.id === id);
        showModal({
          title: 'Delete Product',
          body: `Are you sure you want to delete <strong>${product?.name || 'this product'}</strong>? This cannot be undone.`,
          onConfirm: async () => {
            try {
              await deleteProduct(id);
              allProducts = await getAll();
              renderGrid();
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
          renderGrid();
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
    renderGrid();
  });

  document.getElementById('category-filter').addEventListener('change', (e) => {
    categoryFilter = e.target.value;
    currentPage = 1;
    renderGrid();
  });

  renderGrid();
}
