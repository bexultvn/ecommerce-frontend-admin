export const config = {
  API: {
    auth: 'http://localhost:8001/api/v1',
    user: 'http://localhost:8002/api/v1',
    product: 'http://localhost:8003/api/v1',
    feed: 'http://localhost:8007/api/v1/feed',
    cart: 'http://localhost:8004/api/v1',
    order: 'http://localhost:8005/api/v1',
  },

  MOCK: {
    auth: false,
    products: false,
    customers: true,
    orders: true,
  },

  APP_NAME: 'AdminPanel',
};