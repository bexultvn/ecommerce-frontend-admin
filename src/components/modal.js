export function showModal({ title, body, onConfirm }) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div id="modal-overlay" class="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="bg-gray-800 border border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h2 class="text-base font-bold text-white">${title}</h2>
          </div>
          <button id="modal-close" class="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition-colors" aria-label="Close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-5 py-4 text-sm text-gray-400 leading-relaxed">${body}</div>

        <!-- Footer -->
        <div class="flex gap-3 px-5 py-4 border-t border-gray-700">
          <button id="modal-cancel"
            class="flex-1 px-4 py-2.5 border border-gray-600 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            Cancel
          </button>
          <button id="modal-confirm"
            class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            Delete
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-cancel').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') hideModal();
  });

  document.getElementById('modal-confirm').addEventListener('click', () => {
    if (typeof onConfirm === 'function') onConfirm();
    hideModal();
  });
}

export function hideModal() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
}
