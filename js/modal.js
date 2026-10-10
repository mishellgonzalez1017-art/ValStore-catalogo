import { getFilteredProducts, getCatalogProductById } from './catalog.js';
import { state } from './state.js';
import { escapeHtml, formatPrice } from './utils.js';

export function openModal(productId) {
  const product = getCatalogProductById(productId);
  if (!product) {
    return;
  }

  state.currentProductId = product.id;
  updateModal();

  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    document.getElementById('btn-agregar-carrito')?.focus();
  }

  const trigger = document.querySelector('[data-action="open-modal"][data-id="' + product.id + '"]');
  if (trigger) {
    trigger.setAttribute('data-last-focus', 'true');
  }
}

export function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  document.body.style.overflow = '';
  const trigger = document.querySelector('[data-action="open-modal"][data-last-focus="true"]');
  trigger?.focus();
  trigger?.removeAttribute('data-last-focus');
}

export function changeProduct(direction) {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    return;
  }

  const currentIndex = filteredProducts.findIndex((product) => product.id === state.currentProductId);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + filteredProducts.length) % filteredProducts.length;

  state.currentProductId = filteredProducts[nextIndex].id;
  updateModal();
}

export function updateModal() {
  const product = getCatalogProductById(state.currentProductId);
  const modalImage = document.getElementById('m-img');
  const marcaEl = document.getElementById('m-marca');
  const tituloEl = document.getElementById('m-titulo');
  const precioEl = document.getElementById('m-precio');
  const tallaEl = document.getElementById('m-talla');
  const addButton = document.getElementById('btn-agregar-carrito');

  if (!product || !modalImage || !marcaEl || !tituloEl || !precioEl || !tallaEl || !addButton) {
    return;
  }

  modalImage.src = product.imagen;
  modalImage.alt = `${product.titulo} - ${product.marca}`;
  modalImage.classList.remove('anim-pop');
  void modalImage.offsetWidth;
  modalImage.classList.add('anim-pop');

  marcaEl.textContent = product.marca;
  tituloEl.textContent = product.titulo;
  precioEl.textContent = formatPrice(product.precio);
  tallaEl.textContent = `Talla: ${product.talla}`;

  if (product.vendido) {
    addButton.textContent = 'Prenda No Disponible ✕';
    addButton.disabled = true;
    addButton.setAttribute('aria-disabled', 'true');
    addButton.className = 'w-full bg-gray-800 text-gray-500 py-4 rounded-xl font-bold uppercase tracking-wider cursor-not-allowed';
    return;
  }

  addButton.textContent = 'Agregar al Carrito 💋';
  addButton.disabled = false;
  addButton.setAttribute('aria-disabled', 'false');
  addButton.className = 'w-full bg-[#E01E37] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(224,30,55,0.3)] active:scale-[0.98]';
  addButton.setAttribute('data-product-id', product.id);
}

export function getCurrentModalProduct() {
  return getCatalogProductById(state.currentProductId);
}
