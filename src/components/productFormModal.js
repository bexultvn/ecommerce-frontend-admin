import { hideModal } from './modal.js';

export function showProductFormModal({ product = null, onSave }) {
  const isEdit = product !== null;
  const container = document.getElementById('modal-container');
  if (!container) return;

  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];
  const categoryOptions = categories
    .map(c => `<option value="${c}" ${product?.categoryName === c ? 'selected' : ''}>${c}</option>`)
    .join('');

  const inputCls = 'w-full border border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all';
  const labelCls = 'block text-sm font-medium text-gray-300 mb-1.5';

  container.innerHTML = `
    <div id="pf-overlay" class="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-700 w-full sm:max-w-lg max-h-[92vh] flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-700 flex-shrink-0">
          <h2 class="text-base font-bold text-white">${isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button id="pf-close" class="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition-colors" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable form body -->
        <div class="overflow-y-auto flex-1 px-5 py-5">
          <form id="product-form" class="space-y-4">

            <div>
              <label class="${labelCls}">Product Name</label>
              <input type="text" id="pf-name" value="${product?.name || ''}"
                class="${inputCls}" placeholder="e.g. Wireless Headphones" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="${labelCls}">Price ($)</label>
                <input type="number" id="pf-price" value="${product?.price || ''}" min="0" step="0.01"
                  class="${inputCls}" placeholder="0.00" />
              </div>
              <div>
                <label class="${labelCls}">Stock</label>
                <input type="number" id="pf-stock" value="${product?.stock ?? product?.availableQuantity ?? ''}" min="0"
                  class="${inputCls}" placeholder="0" />
              </div>
            </div>

            <div>
              <label class="${labelCls}">Category</label>
              <select id="pf-category" class="${inputCls}">
                ${categoryOptions}
              </select>
            </div>

            <div>
              <label class="${labelCls}">Image URL</label>
              <input type="text" id="pf-image" value="${product?.image || ''}"
                class="${inputCls}" placeholder="https://..." />
            </div>

            <div>
              <label class="${labelCls}">Description</label>
              <textarea id="pf-description" rows="3"
                class="${inputCls} resize-none"
                placeholder="Product description...">${product?.description || ''}</textarea>
            </div>

          </form>
        </div>

        <!-- Footer actions -->
        <div class="flex gap-3 px-5 py-4 border-t border-gray-700 flex-shrink-0">
          <button type="button" id="pf-cancel"
            class="flex-1 px-4 py-2.5 border border-gray-600 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" form="product-form"
            class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            ${isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>

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
