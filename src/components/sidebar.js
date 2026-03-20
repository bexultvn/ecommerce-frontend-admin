import { getUser, isLoggedIn, isAdmin } from '../core/auth.js';
import { logout } from '../services/authService.js';
import { navigate } from '../core/router.js';
import { eventBus } from '../core/eventBus.js';

function getSidebarHTML() {
  const loggedIn = isLoggedIn() && isAdmin();
  const user = getUser();
  const hash = window.location.hash || '#/dashboard';

  const isActive = (href) => hash === href || hash.startsWith(href + '/');

  const navItem = (href, label, iconSVG) => `
    <a href="${href}" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive(href)
        ? 'bg-red-500 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }">
      ${iconSVG}
      ${label}
    </a>
  `;

  if (!loggedIn) return '';

  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return `
    <aside class="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div class="px-6 py-5 border-b border-gray-100">
        <span class="text-xl font-bold tracking-tight">AdminPanel</span>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1">
        ${navItem('#/dashboard', 'Dashboard', `
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        `)}
        ${navItem('#/products', 'Products', `
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        `)}
        ${navItem('#/customers', 'Customers', `
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        `)}
        ${navItem('#/orders', 'Orders', `
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        `)}
      </nav>
      <div class="px-4 py-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
            ${initial}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">${displayName}</p>
            <p class="text-xs text-gray-400 truncate">${user?.email || ''}</p>
          </div>
          <button id="sidebar-logout" title="Logout" class="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `;
}

let sidebarEventsRegistered = false;

export function renderSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  container.innerHTML = getSidebarHTML();

  const logoutBtn = document.getElementById('sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      navigate('/login');
    });
  }

  if (!sidebarEventsRegistered) {
    sidebarEventsRegistered = true;
    eventBus.on('auth:changed', () => renderSidebar());
  }
}
