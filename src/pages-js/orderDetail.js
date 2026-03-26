import { getAllOrders, updateOrderStatus } from '../services/orderService.js';
import { lsGetAll } from '../storage/localStorage.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-5xl mx-auto">
    <div id="order-detail-content">
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    </div>
  </div>
`;

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CONFIG = {
  Processing: { cls: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30',    dot: 'bg-amber-500',   bar: 'bg-amber-400' },
  Shipped:    { cls: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30',       dot: 'bg-blue-500',    bar: 'bg-blue-400' },
  Delivered:  { cls: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30', dot: 'bg-emerald-500', bar: 'bg-emerald-400' },
  Cancelled:  { cls: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/30',          dot: 'bg-red-500',     bar: 'bg-red-400' }
};

function statusBadge(status) {
  const cfg = STATUS_CONFIG[status] || { cls: 'bg-gray-700 text-gray-300', dot: 'bg-gray-400' };
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${cfg.cls}">
    <span class="w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0"></span>${status}
  </span>`;
}

export async function init({ id }) {
  const contentEl = document.getElementById('order-detail-content');
  if (!contentEl) return;

  const allOrders = await getAllOrders();
  const order = allOrders.find(o => o.id === id);

  if (!order) {
    contentEl.innerHTML = `
      <div class="text-center py-20">
        <p class="text-gray-400 mb-4">Order not found.</p>
        <a href="#/orders" class="text-red-500 hover:underline text-sm font-medium">← Back to Orders</a>
      </div>`;
    return;
  }

  const allUsers = lsGetAll('users');
  const customer = allUsers.find(u => u.id === order.userId);
  const customerName = customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  const items = order.items || [];
  const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = order.total || (subtotal + shipping);

  // Stepper progress
  const stepOrder = ['Processing', 'Shipped', 'Delivered'];
  const isCancelled = order.status === 'Cancelled';
  const currentStep = isCancelled ? -1 : stepOrder.indexOf(order.status);

  function renderContent(currentOrder) {
    const statusOptions = STATUSES.map(s =>
      `<option value="${s}" ${currentOrder.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    contentEl.innerHTML = `
      <!-- Back + header -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-6">
        <a href="#/orders" class="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium group">
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Orders
        </a>
        <div class="flex items-center gap-3">
          ${statusBadge(currentOrder.status)}
        </div>
      </div>

      <!-- Order header card -->
      <div class="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-6 mb-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-xl font-bold text-white">Order #${currentOrder.id.toUpperCase()}</h1>
            </div>
            <p class="text-gray-400 text-sm">${currentOrder.date ? `Placed on ${currentOrder.date}` : 'Date unknown'}</p>
          </div>

          <!-- Status update -->
          <div class="flex flex-wrap items-center gap-3">
            <label class="text-sm font-medium text-gray-300">Update Status:</label>
            <select id="status-select"
              class="border border-gray-600 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-gray-200">
              ${statusOptions}
            </select>
            <button id="save-status-btn"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
              Save
            </button>
          </div>
        </div>

        <!-- Status stepper (only if not cancelled) -->
        ${!isCancelled ? `
          <div class="mt-6 overflow-x-auto -mx-1 px-1">
          <div class="flex items-center gap-0 min-w-64">
            ${stepOrder.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              return `
                <div class="flex items-center ${i < stepOrder.length - 1 ? 'flex-1' : ''}">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? 'bg-red-500 text-white ring-4 ring-red-900/40'
                        : 'bg-gray-700 text-gray-500'
                    }">
                      ${done && !active ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : i + 1}
                    </div>
                    <span class="text-xs font-medium mt-1 ${active ? 'text-red-500' : done ? 'text-gray-300' : 'text-gray-500'}">${step}</span>
                  </div>
                  ${i < stepOrder.length - 1 ? `<div class="flex-1 h-0.5 mx-2 mb-4 ${i < currentStep ? 'bg-red-500' : 'bg-gray-700'} transition-all"></div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
          </div>
        ` : `
          <div class="mt-5 flex items-center gap-2 text-red-500 text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            This order has been cancelled
          </div>
        `}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Items table -->
        <div class="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-700">
            <h3 class="font-semibold text-white">Order Items</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th class="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th class="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Qty</th>
                  <th class="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Unit Price</th>
                  <th class="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr class="border-b border-gray-700/50">
                    <td class="py-4 px-5">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                        </div>
                        <div>
                          <p class="font-semibold text-white">${item.name}</p>
                          <p class="text-xs text-gray-500">ID: ${item.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-center">
                      <span class="bg-gray-700 text-gray-200 font-semibold px-2.5 py-1 rounded-lg text-sm">×${item.qty}</span>
                    </td>
                    <td class="py-4 px-4 text-right text-gray-400">$${(item.price || 0).toFixed(2)}</td>
                    <td class="py-4 px-5 text-right font-bold text-white">$${((item.price || 0) * item.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right column: customer + summary -->
        <div class="space-y-4">
          <!-- Customer info -->
          ${customer ? `
            <div class="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-5">
              <h3 class="font-semibold text-white mb-4 text-sm">Customer</h3>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  ${customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p class="font-semibold text-white text-sm">${customerName}</p>
                  <p class="text-xs text-gray-400">${customer.email}</p>
                </div>
              </div>
              ${customer.address ? `
                <div class="text-xs text-gray-400 bg-gray-700 rounded-xl p-3">
                  <p class="font-medium text-gray-300 mb-1">Shipping Address</p>
                  <p>${customer.address.street} ${customer.address.houseNumber}</p>
                  <p>ZIP: ${customer.address.zipCode}</p>
                </div>
              ` : ''}
              <a href="#/customers/${customer.id}" class="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-400 font-medium">
                View customer profile →
              </a>
            </div>
          ` : ''}

          <!-- Order summary -->
          <div class="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-5">
            <h3 class="font-semibold text-white mb-4 text-sm">Order Summary</h3>
            <div class="space-y-2.5 text-sm">
              <div class="flex justify-between text-gray-400">
                <span>Subtotal (${items.length} item${items.length !== 1 ? 's' : ''})</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>${shipping === 0 ? '<span class="text-emerald-500 font-medium">Free</span>' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div class="border-t border-gray-700 pt-2.5 flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
            ${shipping === 0 ? `<p class="text-xs text-emerald-500 mt-3 font-medium">✓ Free shipping on orders over $50</p>` : ''}
          </div>
        </div>
      </div>
    `;

    // Status save
    document.getElementById('save-status-btn').addEventListener('click', async () => {
      const newStatus = document.getElementById('status-select').value;
      if (newStatus === currentOrder.status) {
        showToast('Status unchanged', 'info');
        return;
      }
      try {
        await updateOrderStatus(currentOrder.id, newStatus);
        showToast('Order status updated', 'success');
        // Reload page with new data
        const updatedOrders = await getAllOrders();
        const updatedOrder = updatedOrders.find(o => o.id === id);
        if (updatedOrder) renderContent(updatedOrder);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  renderContent(order);
}
