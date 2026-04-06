import { apiGet, apiPost, apiPatch, apiDelete } from './api.js';
import { config } from '../config/config.js';
import { mockProducts } from '../storage/mockData.js';

function normalize(p) {
  return {
    id: p.uid || p.id,
    name: p.name,
    description: p.description,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    stock: p.available_quantity ?? p.availableQuantity ?? null,
    availableQuantity: p.available_quantity ?? p.availableQuantity ?? null,
    categoryName: p.categoryName ?? null,
    image: p.image ?? null,
    rating: p.rating ?? 0,
  };
}

let mockStore = [...mockProducts];

export async function getAll() {
  if (config.MOCK.products) {
    return [...mockStore];
  }

  const data = await apiGet(config.API.feed, '/products/');
  return data.map(normalize);
}

export async function getById(id) {
  if (config.MOCK.products) {
    return mockStore.find((p) => p.id === id) || null;
  }

  try {
    const data = await apiGet(config.API.feed, `/products/${id}`);
    return normalize(data);
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

  return apiPost(config.API.product, '/products/', {
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    available_quantity: parseInt(data.available_quantity, 10),
  });
}

export async function updateProduct(id, data) {
  if (config.MOCK.products) {
    const idx = mockStore.findIndex((p) => p.id === id);

    if (idx === -1) {
      throw new Error('Product not found');
    }

    mockStore[idx] = {
      ...mockStore[idx],
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
    };

    return mockStore[idx];
  }

  const updated = await apiPatch(config.API.product, `/products/${id}`, {
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
  });

  return normalize(updated);
}

export async function deleteProduct(id) {
  if (config.MOCK.products) {
    mockStore = mockStore.filter((p) => p.id !== id);
    return null;
  }

  return apiDelete(config.API.product, `/products/${id}`);
}