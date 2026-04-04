import { getUser } from '../core/auth.js';
import { config } from '../config/config.js';
import { mockProducts } from '../storage/mockData.js';

function authHeaders() {
  const user = getUser();
  const headers = { 'Content-Type': 'application/json' };
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
  return headers;
}

function normalize(p) {
  return {
    id: p.uid,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    stock: null,          // available_quantity coming in future
    categoryName: null,   // category coming in future
    image: null,          // images coming in future
    rating: 0,
  };
}

let mockStore = [...mockProducts];

export async function getAll() {
  if (config.MOCK.products) return [...mockStore];
  const res = await fetch(`${config.BASE_URL}/products/`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return (await res.json()).map(normalize);
}

export async function getById(id) {
  if (config.MOCK.products) return mockStore.find(p => p.id === id) || null;
  try {
    const res = await fetch(`${config.BASE_URL}/products/${id}`);
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  }
}

export async function createProduct(data) {
  if (config.MOCK.products) {
    const newProduct = {
      id: String(Date.now()),
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.available_quantity, 10),
      availableQuantity: parseInt(data.available_quantity, 10),
      categoryName: null,
      image: null,
      rating: 0,
    };
    mockStore.push(newProduct);
    return newProduct;
  }
  const res = await fetch(`${config.BASE_URL}/products/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      available_quantity: parseInt(data.available_quantity, 10),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create product');
  }
  return res.json();
}

export async function updateProduct(id, data) {
  if (config.MOCK.products) {
    const idx = mockStore.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    mockStore[idx] = { ...mockStore[idx], name: data.name, description: data.description, price: parseFloat(data.price) };
    return mockStore[idx];
  }
  const res = await fetch(`${config.BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update product');
  }
  return normalize(await res.json());
}

export async function deleteProduct(id) {
  if (config.MOCK.products) {
    mockStore = mockStore.filter(p => p.id !== id);
    return;
  }
  const res = await fetch(`${config.BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete product');
  }
}
