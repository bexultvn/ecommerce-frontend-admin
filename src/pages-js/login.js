import { login } from '../services/authService.js';
import { navigate } from '../core/router.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="flex min-h-screen -m-6">

    <!-- Left branding panel -->
    <div class="hidden md:flex w-1/2 bg-gray-950 items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-red-950"></div>

      <!-- Decorative blobs -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-red-600 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-red-800 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div class="relative z-10 flex flex-col items-center gap-10 px-14 text-center">

        <!-- Brand logo -->
        <div class="flex flex-col items-center gap-3">
          <div class="flex items-center gap-2.5">
            <svg width="42" height="42" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="#ef4444"/>
              <path d="M11 15V12.5a6 6 0 0112 0V15" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
              <rect x="7" y="15" width="20" height="13" rx="3" fill="white"/>
              <path d="M20 21.5c0-.9-.9-1.5-3-1.5s-3 .6-3 1.5.9 1.1 3 1.6c2.1.5 3 .7 3 1.6s-.9 1.3-3 1.3-3-.7-3-1.5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <span class="text-2xl font-bold tracking-tight text-white">Shop<span class="text-red-400">ify</span></span>
          </div>
          <span class="text-xs font-medium text-gray-500 uppercase tracking-widest">Admin Panel</span>
        </div>

        <!-- Tagline -->
        <div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            Your all-in-one dashboard to manage products, orders, and customers.
          </p>
        </div>

        <!-- Feature list -->
        <ul class="flex flex-col gap-3 w-full max-w-xs text-left">
          <li class="flex items-center gap-3 text-gray-300 text-sm">
            <span class="w-7 h-7 rounded-lg bg-red-500 bg-opacity-15 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </span>
            Real-time analytics &amp; revenue tracking
          </li>
          <li class="flex items-center gap-3 text-gray-300 text-sm">
            <span class="w-7 h-7 rounded-lg bg-red-500 bg-opacity-15 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </span>
            Full product &amp; inventory management
          </li>
          <li class="flex items-center gap-3 text-gray-300 text-sm">
            <span class="w-7 h-7 rounded-lg bg-red-500 bg-opacity-15 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </span>
            Order processing &amp; customer insights
          </li>
        </ul>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
      <div class="w-full max-w-sm">

        <!-- Mobile logo (shown only on small screens) -->
        <div class="flex items-center gap-2.5 mb-8 md:hidden">
          <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="#ef4444"/>
            <path d="M11 15V12.5a6 6 0 0112 0V15" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <rect x="7" y="15" width="20" height="13" rx="3" fill="white"/>
            <path d="M20 21.5c0-.9-.9-1.5-3-1.5s-3 .6-3 1.5.9 1.1 3 1.6c2.1.5 3 .7 3 1.6s-.9 1.3-3 1.3-3-.7-3-1.5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <span class="text-lg font-bold tracking-tight text-gray-900">Shop<span class="text-red-500">ify</span> <span class="font-normal text-gray-400">Admin</span></span>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p class="text-gray-500 text-sm mb-8">Sign in to your admin account</p>

        <form id="login-form" class="space-y-5" novalidate>

          <!-- Email field -->
          <div>
            <label for="login-email" class="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              id="login-email"
              autocomplete="email"
              class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100"
              placeholder="admin@shopapp.com"
            />
            <p id="email-error" class="mt-1 text-xs text-red-500 hidden"></p>
          </div>

          <!-- Password field -->
          <div>
            <label for="login-password" class="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <input
                type="password"
                id="login-password"
                autocomplete="current-password"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="Enter your password"
              />
              <button
                type="button"
                id="toggle-password"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                <!-- Eye icon (password hidden) -->
                <svg id="eye-icon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <!-- Eye-off icon (password visible) -->
                <svg id="eye-off-icon" class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <p id="password-error" class="mt-1 text-xs text-red-500 hidden"></p>
          </div>

          <!-- Submit button -->
          <div class="pt-1">
            <button
              type="submit"
              id="login-btn"
              class="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg id="login-spinner" class="w-4 h-4 animate-spin hidden" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span id="login-btn-text">Sign In</span>
            </button>
          </div>

        </form>

        <!-- Demo credentials hint -->
        <div class="mt-6 p-3.5 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-xs text-gray-500 font-medium mb-1.5">Demo credentials</p>
          <button
            id="fill-demo"
            class="text-xs text-red-500 hover:text-red-600 font-mono transition-colors hover:underline"
          >
            admin@shopapp.com &nbsp;/&nbsp; admin123
          </button>
          <p class="text-xs text-gray-400 mt-1">Click to auto-fill</p>
        </div>

      </div>
    </div>
  </div>
`;

export function init() {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const toggleBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');
  const loginBtn = document.getElementById('login-btn');
  const loginSpinner = document.getElementById('login-spinner');
  const loginBtnText = document.getElementById('login-btn-text');
  const fillDemo = document.getElementById('fill-demo');

  // Clear inline errors on input
  emailInput.addEventListener('input', () => {
    emailError.classList.add('hidden');
    emailInput.classList.remove('border-red-400', 'ring-2', 'ring-red-100');
  });
  passwordInput.addEventListener('input', () => {
    passwordError.classList.add('hidden');
    passwordInput.classList.remove('border-red-400', 'ring-2', 'ring-red-100');
  });

  // Password visibility toggle
  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.classList.toggle('hidden', isPassword);
    eyeOffIcon.classList.toggle('hidden', !isPassword);
  });

  // Auto-fill demo credentials
  fillDemo.addEventListener('click', () => {
    emailInput.value = 'admin@shopapp.com';
    passwordInput.value = 'admin123';
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');
    emailInput.classList.remove('border-red-400');
    passwordInput.classList.remove('border-red-400');
  });

  function showFieldError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    input.classList.add('border-red-400');
    input.focus();
  }

  function setLoading(loading) {
    loginBtn.disabled = loading;
    loginSpinner.classList.toggle('hidden', !loading);
    loginBtnText.textContent = loading ? 'Signing in...' : 'Sign In';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
      showFieldError(emailInput, emailError, 'Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailInput, emailError, 'Please enter a valid email address');
      return;
    }
    if (!password) {
      showFieldError(passwordInput, passwordError, 'Password is required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      showFieldError(passwordInput, passwordError, err.message);
    }
  });
}
