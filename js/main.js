import { renderGallery, setFilter, setSearchQuery, updateCategoryButtons, getFilteredProducts } from './catalog.js';
import { openModal, closeModal, changeProduct } from './modal.js';
import { renderCart, toggleCartSidebar, addProductToCart, removeProductFromCart } from './cart.js';
import { sendWhatsAppOrder } from './whatsapp.js';
import { initMusic, toggleMusic } from './music.js';
import { initEffects, startExperience as startExperienceEffect } from './effects.js';
import { state } from './state.js';
import { getCatalogProductById } from './catalog.js';

const lastFocusedElement = { current: null };

function bindGlobalEvents() {
  document.addEventListener('click', (event) => {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) {
      return;
    }

    const action = actionElement.dataset.action;
    const productId = actionElement.dataset.productId || actionElement.dataset.id;
    const filter = actionElement.dataset.filter;
    const direction = Number(actionElement.dataset.direction || 0);

    switch (action) {
      case 'start-experience':
        startExperience();
        break;
      case 'filter-items':
        setFilter(filter);
        updateCategoryButtons();
        renderGallery();
        break;
      case 'open-modal':
        lastFocusedElement.current = document.activeElement;
        openModal(productId);
        break;
      case 'close-modal':
        closeModal();
        if (lastFocusedElement.current && typeof lastFocusedElement.current.focus === 'function') {
          lastFocusedElement.current.focus();
        }
        break;
      case 'toggle-cart':
        toggleCartSidebar();
        break;
      case 'change-product':
        changeProduct(direction);
        break;
      case 'add-to-cart':
        addProductToCart(productId);
        closeModal();
        toggleCartSidebar();
        break;
      case 'remove-cart-item':
        removeProductFromCart(productId);
        break;
      case 'confirm-whatsapp':
        sendWhatsAppOrder();
        break;
      case 'toggle-music':
        toggleMusic();
        break;
      default:
        break;
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id !== 'catalog-search-input') {
      return;
    }

    setSearchQuery(event.target.value);
    renderGallery();
  });

  document.addEventListener('keydown', (event) => {
    const modal = document.getElementById('modal');
    if (event.key === 'Escape') {
      if (modal && !modal.classList.contains('hidden')) {
        closeModal();
        if (lastFocusedElement.current && typeof lastFocusedElement.current.focus === 'function') {
          lastFocusedElement.current.focus();
        }
        return;
      }

      const cartSidebar = document.getElementById('cart-sidebar');
      if (cartSidebar && !cartSidebar.classList.contains('translate-x-full')) {
        toggleCartSidebar();
      }
    }
  });

  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
}

function startExperience() {
  state.currentFilter = 'Mujer';
  updateCategoryButtons();
  renderGallery();
  startExperienceEffect();
  const musicControl = document.getElementById('music-control');
  if (musicControl) {
    musicControl.style.opacity = '1';
  }
  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.play().catch(() => {});
  }
}

function initializeApp() {
  initEffects();
  initMusic();
  renderGallery();
  renderCart();
  updateCategoryButtons();
  bindGlobalEvents();

  const input = document.getElementById('catalog-search-input');
  if (input) {
    input.setAttribute('aria-label', 'Buscar prendas');
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);
