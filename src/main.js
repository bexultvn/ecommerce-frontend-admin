import './style.css';
import { initRouter } from './core/router.js';
import { renderSidebar } from './components/sidebar.js';
import { lsSet } from './storage/localStorage.js';
import { mockProducts, mockUsers, mockOrders, mockAdminUsers } from './storage/mockData.js';

// Always reseed to get latest mock data
lsSet('products', mockProducts);
lsSet('users', mockUsers);
lsSet('orders', mockOrders);
lsSet('admin_users', mockAdminUsers);

renderSidebar();
initRouter();
