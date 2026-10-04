import { getCatalogProductById } from './catalog.js';

const STORAGE_KEY = 'val_store_cart';

function normalizeLegacyCart(cartValue) {
  if (!Array.isArray(cartValue)) {
    return [];
  }

  return cartValue
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (item && typeof item === 'object') {
        return item.id || item.productId || item.codigo || '';
      }

      return '';
    })
    .filter(Boolean);
}

export function getCart() {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    const normalizedCart = normalizeLegacyCart(parsedValue);

    const validCart = normalizedCart.filter((itemId) => !!getCatalogProductById(itemId));
    const uniqueCart = [...new Set(validCart)];

    if (JSON.stringify(uniqueCart) !== JSON.stringify(normalizedCart)) {
      saveCart(uniqueCart);
    }

    return uniqueCart;
  } catch (error) {
    console.warn('No se pudo leer el carrito:', error);
    return [];
  }
}

export function saveCart(cart) {
  const safeCart = [...new Set(cart.filter(Boolean))];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeCart));
  return safeCart;
}

export function addItem(productId) {
  const cart = getCart();
  if (!productId || cart.includes(productId)) {
    return false;
  }

  const updatedCart = saveCart([...cart, productId]);
  return updatedCart.includes(productId);
}

export function removeItem(productId) {
  const cart = getCart();
  const updatedCart = saveCart(cart.filter((id) => id !== productId));
  return updatedCart;
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
