import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { config } from '../config/config.js';

const CATEGORY_MAP = {
  Electronics: 1,
  Clothing: 2,
  Books: 3,
  Home: 4
};

function normalize(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock ?? p.availableQuantity,
    availableQuantity: p.availableQuantity ?? p.stock,
    categoryName: p.categoryName,
    categoryId: p.categoryId,
    image: p.image || null,
    rating: p.rating || 0
  };
}

export async function getAll(filters = {}) {
  const raw = config.USE_MOCK
    ? lsGetAll('products')
    : await apiGet('/products');

  let products = raw.map(normalize);

  if (filters.category) {
    products = products.filter(p => p.categoryName === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }

  return products;
}

export async function getById(id) {
  if (config.USE_MOCK) {
    const raw = lsGetAll('products').find(p => p.id === String(id));
    return raw ? normalize(raw) : null;
  }
  try {
    return normalize(await apiGet(`/products/${id}`));
  } catch {
    return null;
  }
}

export async function createProduct(data) {
  if (config.USE_MOCK) {
    const products = lsGetAll('products');
    const newProduct = {
      id: String(Date.now()),
      name: data.name,
      price: parseFloat(data.price),
      description: data.description || '',
      category: data.category,
      categoryName: data.category,
      categoryId: CATEGORY_MAP[data.category] || 1,
      stock: parseInt(data.stock, 10),
      availableQuantity: parseInt(data.stock, 10),
      image: data.image || `https://placehold.co/300x300?text=${encodeURIComponent(data.name)}`,
      rating: 0
    };
    products.push(newProduct);
    lsSet('products', products);
    return newProduct;
  }
  return apiPost('/products', data);
}

export async function updateProduct(id, data) {
  if (config.USE_MOCK) {
    const products = lsGetAll('products');
    const idx = products.findIndex(p => p.id === String(id));
    if (idx === -1) throw new Error('Product not found');
    const stock = data.stock !== undefined ? parseInt(data.stock, 10) : products[idx].stock;
    products[idx] = {
      ...products[idx],
      name: data.name ?? products[idx].name,
      price: data.price !== undefined ? parseFloat(data.price) : products[idx].price,
      description: data.description ?? products[idx].description,
      category: data.category ?? products[idx].category,
      categoryName: data.category ?? products[idx].categoryName,
      categoryId: data.category ? (CATEGORY_MAP[data.category] || 1) : products[idx].categoryId,
      stock,
      availableQuantity: stock,
      image: data.image ?? products[idx].image
    };
    lsSet('products', products);
    return products[idx];
  }
  return apiPut(`/products/${id}`, data);
}

export async function deleteProduct(id) {
  if (config.USE_MOCK) {
    const updated = lsGetAll('products').filter(p => p.id !== String(id));
    lsSet('products', updated);
    return;
  }
  return apiDelete(`/products/${id}`);
}
