import { getCart, addItem, removeItem } from './cartService.js';
import { getCatalogProductById } from './catalog.js';
import { formatPrice, escapeHtml } from './utils.js';

export function getCartItems() {
  return getCart()
    .map((productId) => getCatalogProductById(productId))
    .filter(Boolean);
}

export function showToast(message) {
  const toast = document.getElementById('global-toast');
  if (!toast) {
    const element = document.createElement('div');
    element.id = 'global-toast';
    element.className = 'fixed left-1/2 top-6 z-[1200] -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md';
    element.style.display = 'none';
    document.body.appendChild(element);
    showToast(message);
    return;
  }

  toast.textContent = message;
  toast.style.display = 'block';
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.style.display = 'none';
  }, 1800);
}

export function addProductToCart(productId) {
  if (!productId) {
    return false;
  }

  const product = getCatalogProductById(productId);
  if (!product || product.vendido) {
    return false;
  }

  const alreadyExists = getCart().includes(productId);
  if (alreadyExists) {
    showToast('Esta prenda ya está en tu carrito 💋');
    return false;
  }

  addItem(productId);
  renderCart();
  return true;
}

export function removeProductFromCart(productId) {
  removeItem(productId);
  renderCart();
}

export function toggleCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  const toggleButton = document.getElementById('cart-toggle-btn');

  if (!sidebar || !toggleButton) {
    return;
  }

  const isHidden = sidebar.classList.contains('translate-x-full');
  if (isHidden) {
    sidebar.classList.remove('translate-x-full');
    toggleButton.classList.add('hidden');
  } else {
    sidebar.classList.add('translate-x-full');
    toggleButton.classList.remove('hidden');
  }
}

export function renderCart() {
  const items = getCartItems();
  const container = document.getElementById('cart-items-container');
  const badge = document.getElementById('cart-badge');
  const totalElement = document.getElementById('cart-total');

  if (!container || !badge || !totalElement) {
    return;
  }

  if (!items.length) {
    container.innerHTML = '<div class="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12"><p class="text-sm">Tu carrito está vacío.</p><p class="text-xs mt-1">¡Añade tus prendas favoritas! 💋</p></div>';
    badge.classList.add('hidden');
    badge.textContent = '0';
    totalElement.textContent = 'Q0';
    const checkout = document.querySelector('[data-action="confirm-whatsapp"]');
    if (checkout) checkout.disabled = true;
    return;
  }

  let total = 0;
  const itemsMarkup = items
    .map((item, index) => {
      const value = Number(item.precio) || 0;
      total += value;
      const itemTitle = escapeHtml(item.titulo);
      const itemMarca = escapeHtml(item.marca);
      const itemTalla = escapeHtml(item.talla);

      return `
        <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 relative group">
          <img src="${item.imagen}" alt="${itemTitle}" class="w-16 h-20 object-cover rounded-lg" loading="lazy" decoding="async">
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black tracking-widest text-[#E01E37] uppercase truncate">${itemMarca}</p>
            <h4 class="text-xs font-bold text-white truncate">${itemTitle}</h4>
            <p class="text-[10px] text-gray-400 font-mono mt-0.5">Talla: ${itemTalla}</p>
            <p class="text-sm font-black text-white mt-1">${formatPrice(item.precio)}</p>
          </div>
          <button
            type="button"
            data-action="remove-cart-item"
            data-product-id="${item.id}"
            class="text-gray-500 hover:text-red-500 p-2 transition duration-300"
            aria-label="Eliminar ${itemTitle} del carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      `;
    })
    .join('');

  container.innerHTML = itemsMarkup;
  badge.textContent = String(items.length);
  badge.classList.remove('hidden');
  totalElement.textContent = `Q${total}`;
  const checkout = document.querySelector('[data-action="confirm-whatsapp"]');
  if (checkout) checkout.disabled = false;
}
