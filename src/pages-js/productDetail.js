import { getById, updateProduct, deleteProduct } from '../services/productService.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { showProductFormModal } from '../components/productFormModal.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-5xl mx-auto">
    <div id="product-detail-content">
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    </div>
  </div>
`;

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-50 text-blue-700',
  Clothing:    'bg-pink-50 text-pink-700',
  Books:       'bg-amber-50 text-amber-700',
  Home:        'bg-emerald-50 text-emerald-700'
};

function starRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars += `<svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else if (i === full && half) {
      stars += `<svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/></svg>`;
    } else {
      stars += `<svg class="w-4 h-4 text-slate-200 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  return `<div class="flex items-center gap-0.5">${stars}<span class="ml-1.5 text-sm font-medium text-slate-600">${rating.toFixed(1)}</span></div>`;
}

function stockInfo(stock) {
  if (stock === 0) return { cls: 'bg-red-50 text-red-600 ring-1 ring-red-200', label: 'Out of stock' };
  if (stock < 10) return { cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', label: `Low stock: ${stock} left` };
  return { cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', label: `${stock} in stock` };
}

export async function init({ id }) {
  const contentEl = document.getElementById('product-detail-content');
  if (!contentEl) return;

  const product = await getById(id);
  if (!product) {
    contentEl.innerHTML = `
      <div class="text-center py-20">
        <p class="text-slate-500 mb-4">Product not found.</p>
        <a href="#/products" class="text-orange-600 hover:underline text-sm font-medium">← Back to Products</a>
      </div>`;
    return;
  }

  const catCls = CATEGORY_COLORS[product.categoryName] || 'bg-slate-100 text-slate-600';
  const stock = product.stock ?? product.availableQuantity ?? 0;
  const stockCfg = stockInfo(stock);

  contentEl.innerHTML = `
    <!-- Back + Actions bar -->
    <div class="flex items-center justify-between mb-6">
      <a href="#/products" class="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors text-sm font-medium group">
        <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Products
      </a>
      <div class="flex gap-2">
        <button id="edit-btn"
          class="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit Product
        </button>
        <button id="delete-btn"
          class="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Main card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-0">
        <!-- Image panel -->
        <div class="md:col-span-2 bg-slate-50 flex items-center justify-center p-8 min-h-72">
          <img src="${product.image || 'https://placehold.co/400x400?text=No+Image'}" alt="${product.name}"
            class="max-w-full max-h-72 object-contain rounded-xl shadow-sm" />
        </div>

        <!-- Info panel -->
        <div class="md:col-span-3 p-8">
          <div class="flex items-start gap-3 mb-2">
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${catCls}">${product.categoryName}</span>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${stockCfg.cls}">${stockCfg.label}</span>
          </div>

          <h1 class="text-2xl font-bold text-slate-900 mt-3 mb-2 leading-snug">${product.name}</h1>

          ${product.rating ? starRating(product.rating) : ''}

          <div class="mt-4 mb-6">
            <span class="text-4xl font-bold text-slate-900">$${product.price.toFixed(2)}</span>
          </div>

          <div class="border-t border-slate-100 pt-5">
            <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
            <p class="text-slate-600 text-sm leading-relaxed">${product.description || 'No description available.'}</p>
          </div>

          <div class="border-t border-slate-100 mt-5 pt-5 grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Product ID</p>
              <p class="text-sm font-mono text-slate-700">${product.id}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</p>
              <p class="text-sm text-slate-700">${product.categoryName}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</p>
              <p class="text-sm font-semibold text-slate-700">$${product.price.toFixed(2)}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stock</p>
              <p class="text-sm text-slate-700">${stock} units</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Edit button
  document.getElementById('edit-btn').addEventListener('click', () => {
    showProductFormModal({
      product,
      onSave: async (data) => {
        try {
          await updateProduct(product.id, data);
          showToast('Product updated', 'success');
          // Re-init with updated data
          await init({ id });
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });

  // Delete button
  document.getElementById('delete-btn').addEventListener('click', () => {
    showModal({
      title: 'Delete Product',
      body: `Are you sure you want to delete <strong>${product.name}</strong>? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteProduct(product.id);
          showToast('Product deleted', 'success');
          navigate('/products');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });
}
