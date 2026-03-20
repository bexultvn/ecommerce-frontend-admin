import { login } from '../services/authService.js';
import { navigate } from '../core/router.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="flex min-h-screen -m-6">
    <div class="hidden md:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950 opacity-90"></div>
      <div class="relative z-10 text-center p-12 flex flex-col items-center gap-8">
        <div class="w-24 h-24 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center mb-2">
          <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="text-gray-400 text-xs">Analytics</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span class="text-gray-400 text-xs">Products</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-400 text-xs">Customers</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            <span class="text-gray-400 text-xs">Orders</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-gray-400 text-xs">Revenue</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-400 text-xs">Settings</span>
          </div>
        </div>
        <div>
          <p class="text-white text-lg font-semibold">AdminPanel</p>
          <p class="text-gray-400 text-sm mt-1">Manage your store with ease</p>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
      <div class="w-full max-w-sm">
        <h1 class="text-3xl font-semibold mb-2">Admin Login</h1>
        <p class="text-gray-500 text-sm mb-8">Sign in to manage your store</p>
        <form id="login-form" class="space-y-7">
          <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
            <input type="email" id="login-email" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Admin Email" />
          </div>
          <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
            <input type="password" id="login-password" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Password" />
          </div>
          <div class="pt-1">
            <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded text-sm font-medium transition-colors">
              Sign In
            </button>
          </div>
          <p class="text-xs text-gray-400 text-center">Demo: admin@shopapp.com / admin123</p>
        </form>
      </div>
    </div>
  </div>
`;

export function init() {
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email) { showToast('Please enter your email', 'error'); return; }
    if (!password) { showToast('Please enter your password', 'error'); return; }
    try {
      login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
