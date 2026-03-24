import { lsGetAll } from '../storage/localStorage.js';
import { monthlyStats } from '../storage/mockData.js';

export const template = `
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening in your store.</p>
    </div>

    <!-- Stat Cards -->
    <div id="stats-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"></div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
      <!-- Revenue Chart -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="font-semibold text-slate-900">Revenue Overview</h2>
            <p class="text-xs text-slate-500 mt-0.5">Last 12 months</p>
          </div>
          <span class="text-xs bg-orange-50 text-orange-600 font-medium px-2.5 py-1 rounded-full">Monthly</span>
        </div>
        <div style="height: 260px; position: relative;">
          <canvas id="revenue-chart"></canvas>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 class="font-semibold text-slate-900 mb-4">Top Products</h2>
        <div id="top-products-list" class="space-y-3"></div>
      </div>
    </div>

    <!-- Orders Chart + Recent Orders -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- Orders Chart -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="font-semibold text-slate-900">Orders Volume</h2>
            <p class="text-xs text-slate-500 mt-0.5">Last 12 months</p>
          </div>
        </div>
        <div style="height: 220px; position: relative;">
          <canvas id="orders-chart"></canvas>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-slate-900">Recent Orders</h2>
          <a href="#/orders" class="text-xs text-orange-600 hover:text-orange-700 font-medium">View all →</a>
        </div>
        <div id="recent-orders-table"></div>
      </div>
    </div>
  </div>
`;

function statusBadge(status) {
  const map = {
    Processing: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Shipped:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    Delivered:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Cancelled:  'bg-red-50 text-red-700 ring-1 ring-red-200'
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}">${status}</span>`;
}

function trendArrow(pct) {
  if (pct > 0) return `<span class="text-emerald-600 text-xs font-medium flex items-center gap-0.5">
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
    ${pct}%</span>`;
  if (pct < 0) return `<span class="text-red-500 text-xs font-medium flex items-center gap-0.5">
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
    ${Math.abs(pct)}%</span>`;
  return `<span class="text-slate-400 text-xs">—</span>`;
}

function calcTrend(current, previous) {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function init() {
  const products = lsGetAll('products');
  const users = lsGetAll('users');
  const orders = lsGetAll('orders');
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  // Trend: compare last 2 months from monthlyStats
  const lastMonth = monthlyStats[monthlyStats.length - 1];
  const prevMonth = monthlyStats[monthlyStats.length - 2];
  const revTrend = calcTrend(lastMonth.revenue, prevMonth.revenue);
  const ordTrend = calcTrend(lastMonth.orders, prevMonth.orders);

  // Stat cards
  const statsGrid = document.getElementById('stats-grid');
  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${revenue.toFixed(2)}`,
      trend: revTrend,
      bgIcon: 'bg-orange-50',
      iconColor: 'text-orange-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      label: 'Total Orders',
      value: orders.length,
      trend: ordTrend,
      bgIcon: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
    },
    {
      label: 'Total Customers',
      value: users.length,
      trend: 0,
      bgIcon: 'bg-violet-50',
      iconColor: 'text-violet-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
    },
    {
      label: 'Total Products',
      value: products.length,
      trend: 0,
      bgIcon: 'bg-amber-50',
      iconColor: 'text-amber-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
    }
  ];

  statsGrid.innerHTML = statCards.map(({ label, value, trend, bgIcon, iconColor, icon }) => `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between">
        <div class="w-10 h-10 rounded-xl ${bgIcon} ${iconColor} flex items-center justify-center flex-shrink-0">
          ${icon}
        </div>
        ${trendArrow(trend)}
      </div>
      <div class="mt-4">
        <div class="text-2xl font-bold text-slate-900">${value}</div>
        <div class="text-sm text-slate-500 mt-0.5">${label}</div>
      </div>
    </div>
  `).join('');

  // Top products by stock sold (mock: just sort by price * stock desc for demo)
  const topProducts = [...products]
    .sort((a, b) => (b.price * (b.stock || 0)) - (a.price * (a.stock || 0)))
    .slice(0, 5);

  const topProductsList = document.getElementById('top-products-list');
  topProductsList.innerHTML = topProducts.map((p, i) => `
    <div class="flex items-center gap-3">
      <span class="text-xs font-bold text-slate-400 w-4">${i + 1}</span>
      <img src="${p.image}" alt="${p.name}" class="w-8 h-8 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-800 truncate">${p.name}</p>
        <p class="text-xs text-slate-400">${p.categoryName}</p>
      </div>
      <span class="text-sm font-semibold text-slate-700">$${p.price.toFixed(2)}</span>
    </div>
  `).join('');

  // Recent orders
  const allUsers = lsGetAll('users');
  const getUserName = (userId) => {
    const u = allUsers.find(u => u.id === String(userId));
    return u ? `${u.firstName} ${u.lastName}` : userId;
  };

  const recentOrders = [...orders].reverse().slice(0, 5);
  const ordersContainer = document.getElementById('recent-orders-table');

  if (recentOrders.length === 0) {
    ordersContainer.innerHTML = '<p class="text-slate-500 text-sm py-4">No orders yet.</p>';
  } else {
    ordersContainer.innerHTML = `
      <div class="overflow-x-auto -mx-1">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Order</th>
              <th class="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
              <th class="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
              <th class="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th class="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            ${recentOrders.map(o => `
              <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                  onclick="window.location.hash='#/orders/${o.id}'">
                <td class="py-3 px-3 font-mono text-xs text-slate-400 font-medium">#${o.id.toUpperCase()}</td>
                <td class="py-3 px-3 font-medium text-slate-800">${getUserName(o.userId)}</td>
                <td class="py-3 px-3 font-semibold text-slate-900">$${(o.total || 0).toFixed(2)}</td>
                <td class="py-3 px-3">${statusBadge(o.status)}</td>
                <td class="py-3 px-3 text-slate-400 text-xs">${o.date || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Initialize charts
  initCharts();
}

function initCharts() {
  const Chart = window.Chart;
  if (!Chart) return;

  const labels = monthlyStats.map(m => m.month);
  const revenues = monthlyStats.map(m => m.revenue);
  const orderCounts = monthlyStats.map(m => m.orders);

  // Revenue line chart
  const revenueCanvas = document.getElementById('revenue-chart');
  if (revenueCanvas) {
    new Chart(revenueCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: revenues,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            padding: 10,
            callbacks: { label: ctx => ` $${ctx.parsed.y.toLocaleString()}` }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(148,163,184,0.1)', drawBorder: false },
            border: { display: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
            }
          },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Orders bar chart
  const ordersCanvas = document.getElementById('orders-chart');
  if (ordersCanvas) {
    new Chart(ordersCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: orderCounts,
          backgroundColor: 'rgba(249,115,22,0.75)',
          hoverBackgroundColor: '#f97316',
          borderRadius: 5,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            padding: 10,
            callbacks: { label: ctx => ` ${ctx.parsed.y} orders` }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(148,163,184,0.1)', drawBorder: false },
            border: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          }
        }
      }
    });
  }
}
