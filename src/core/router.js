import { isLoggedIn, isAdmin } from './auth.js';
import { renderSidebar } from '../components/sidebar.js';

const PUBLIC_ROUTES = ['/login'];

const routes = {
  '':           () => import('../pages-js/dashboard.js'),
  '/':          () => import('../pages-js/dashboard.js'),
  '/login':     () => import('../pages-js/login.js'),
  '/dashboard': () => import('../pages-js/dashboard.js'),
  '/products':  () => import('../pages-js/products.js'),
  '/customers': () => import('../pages-js/customers.js'),
  '/orders':    () => import('../pages-js/orders.js'),
};

const dynamicRoutes = [
  {
    pattern: /^\/products\/(.+)$/,
    loader: () => import('../pages-js/productDetail.js'),
    paramKey: 'id'
  },
  {
    pattern: /^\/customers\/(.+)$/,
    loader: () => import('../pages-js/customerDetail.js'),
    paramKey: 'id'
  },
  {
    pattern: /^\/orders\/(.+)$/,
    loader: () => import('../pages-js/orderDetail.js'),
    paramKey: 'id'
  },
];

function parseHash() {
  const hash = window.location.hash.slice(1) || '/';
  const [pathWithQuery, ...rest] = hash.split('?');
  const queryString = rest.join('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return { path: pathWithQuery, params };
}

export function navigate(path) {
  window.location.hash = path;
}

async function handleRoute() {
  const app = document.getElementById('app');
  const { path, params } = parseHash();
  const basePath = '/' + (path.split('/').filter(Boolean)[0] || '');

  if (!PUBLIC_ROUTES.includes(basePath)) {
    if (!isLoggedIn()) { navigate('/login'); return; }
    if (!isAdmin())    { navigate('/login'); return; }
  }

  if (basePath === '/login' && isLoggedIn() && isAdmin()) {
    navigate('/dashboard');
    return;
  }

  // Check dynamic routes first (e.g. /products/:id)
  let loader = null;
  const routeParams = { ...params };

  for (const route of dynamicRoutes) {
    const match = path.match(route.pattern);
    if (match) {
      loader = route.loader;
      routeParams[route.paramKey] = match[1];
      break;
    }
  }

  if (!loader) {
    loader = routes[basePath] || routes['/dashboard'];
  }

  try {
    const module = await loader();
    const { template, init } = module;
    app.innerHTML = template;
    if (typeof init === 'function') await init(routeParams);
  } catch (err) {
    console.error('Router error:', err);
    app.innerHTML = `<div class="p-8 text-center text-red-600">Page failed to load. <a href="#/dashboard" class="underline">Go to dashboard</a></div>`;
  }

  renderSidebar();
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
