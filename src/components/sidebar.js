import { getUser, isLoggedIn, isAdmin } from '../core/auth.js';
import { logout } from '../services/authService.js';
import { navigate } from '../core/router.js';
import { eventBus } from '../core/eventBus.js';

function getSidebarHTML() {
  const loggedIn = isLoggedIn() && isAdmin();
  const user = getUser();
  const hash = window.location.hash || '#/dashboard';

  const isActive = (href) => hash === href || hash.startsWith(href + '/');

  const navItem = (href, label, iconSVG) => {
    const active = isActive(href);
    return `
      <a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-red-500 text-white shadow-sm'
          : 'text-gray-400 hover:bg-slate-800 hover:text-white'
      }">
        <span class="${active ? 'text-white' : 'text-gray-500'}">${iconSVG}</span>
        ${label}
      </a>
    `;
  };

  if (!loggedIn) return '';

  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return `
    <aside id="sidebar" class="fixed lg:relative top-0 left-0 h-screen w-64 bg-slate-900 flex flex-col border-r border-slate-800 overflow-y-auto z-50 -translate-x-full lg:translate-x-0 transition-transform duration-300">
      <!-- Brand -->
      <div class="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
        <a href="#/" class="flex items-center gap-2.5">
          <svg width="32" height="32" viewBox="0 0 34 34" fill="none" class="flex-shrink-0">
            <rect width="34" height="34" rx="9" fill="#ef4444"/>
            <path d="M11 15V12.5a6 6 0 0112 0V15" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <rect x="7" y="15" width="20" height="13" rx="3" fill="white"/>
            <path d="M20 21.5c0-.9-.9-1.5-3-1.5s-3 .6-3 1.5.9 1.1 3 1.6c2.1.5 3 .7 3 1.6s-.9 1.3-3 1.3-3-.7-3-1.5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <span class="text-white text-base font-bold tracking-tight">Shop<span class="text-red-400">ify</span></span>
        </a>
        <!-- Close button (mobile only) -->
        <button id="sidebar-close" class="lg:hidden text-gray-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors" aria-label="Close menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-5 space-y-1">
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-3">Main Menu</p>
        ${navItem('#/dashboard', 'Dashboard', `
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 13a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z"/>
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

      <!-- User -->
      <div class="px-4 py-4 border-t border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            ${initial}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">${displayName}</p>
            <p class="text-xs text-gray-500 truncate">${user?.email || ''}</p>
          </div>
          <button id="sidebar-logout" title="Logout"
            class="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 p-1 rounded-md hover:bg-slate-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `;
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.add('-translate-x-full');
  if (overlay) overlay.classList.add('hidden');
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('-translate-x-full');
  if (overlay) overlay.classList.remove('hidden');
}

function wireToggleEvents() {
  // Hamburger open button (in mobile top bar)
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', openSidebar);
  }

  // Overlay click → close
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close button inside sidebar
  const closeBtn = document.getElementById('sidebar-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  // Nav link clicks on mobile → close drawer
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) closeSidebar();
      });
    });
  }
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

  wireToggleEvents();

  if (!sidebarEventsRegistered) {
    sidebarEventsRegistered = true;
    eventBus.on('auth:changed', () => renderSidebar());
  }
}
