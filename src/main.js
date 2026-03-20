import './style.css';
import { initRouter } from './core/router.js';
import { renderSidebar } from './components/sidebar.js';
import { seedStorage, lsSet } from './storage/localStorage.js';
import { mockProducts, mockUsers, mockOrders, mockAdminUsers } from './storage/mockData.js';

lsSet('products', mockProducts);
seedStorage('users', mockUsers);
seedStorage('orders', mockOrders);
seedStorage('admin_users', mockAdminUsers);

renderSidebar();
initRouter();
