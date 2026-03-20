import { hideModal } from './modal.js';

export function showProductFormModal({ product = null, onSave }) {
  const isEdit = product !== null;
  const container = document.getElementById('modal-container');
  if (!container) return;

  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];
  const categoryOptions = categories
    .map(c => `<option value="${c}" ${product?.categoryName === c ? 'selected' : ''}>${c}</option>`)
    .join('');

  container.innerHTML = `
    <div id="pf-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold">${isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button id="pf-close" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form id="product-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" id="pf-name" value="${product?.name || ''}"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. Wireless Headphones" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" id="pf-price" value="${product?.price || ''}" min="0" step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors"
                placeholder="0.00" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" id="pf-stock" value="${product?.stock ?? product?.availableQuantity ?? ''}" min="0"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors"
                placeholder="0" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="pf-category"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors">
              ${categoryOptions}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="text" id="pf-image" value="${product?.image || ''}"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="https://..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="pf-description" rows="3"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
              placeholder="Product description...">${product?.description || ''}</textarea>
          </div>
          <div class="flex gap-3 justify-end pt-2">
            <button type="button" id="pf-cancel" class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors font-medium">
              ${isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => {
    container.innerHTML = '';
  };

  document.getElementById('pf-close').addEventListener('click', close);
  document.getElementById('pf-cancel').addEventListener('click', close);
  document.getElementById('pf-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'pf-overlay') close();
  });

  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('pf-name').value.trim();
    const price = document.getElementById('pf-price').value;
    const stock = document.getElementById('pf-stock').value;
    const category = document.getElementById('pf-category').value;
    const image = document.getElementById('pf-image').value.trim();
    const description = document.getElementById('pf-description').value.trim();

    if (!name) { alert('Product name is required'); return; }
    if (!price || isNaN(price)) { alert('Valid price is required'); return; }
    if (stock === '' || isNaN(stock)) { alert('Valid stock quantity is required'); return; }

    close();
    await onSave({ name, price, stock, category, image, description });
  });
}
