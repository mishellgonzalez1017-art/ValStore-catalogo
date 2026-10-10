import { prendas } from '../data/index.js';
import { state } from './state.js';
import { escapeHtml, formatPrice, normalizeText } from './utils.js';

export function getCatalogProductById(productId) {
  return prendas.find((product) => product.id === productId) || null;
}

export function getFilteredProducts({ category = state.currentFilter, searchQuery = state.searchQuery } = {}) {
  const normalizedSearch = normalizeText(searchQuery.trim().replace(/^#/, ''));

  return prendas.filter((product) => {
    const matchesCategory = category === 'Oferta' ? product.oferta === true : product.categoria === category;
    const matchesSearch = !normalizedSearch ||
      normalizeText(product.titulo).includes(normalizedSearch) ||
      normalizeText(product.id).replace(/^#/, '').includes(normalizedSearch) ||
      normalizeText(product.marca).includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}

export function setFilter(category) {
  state.currentFilter = category;
  state.currentProductId = null;
}

export function setSearchQuery(value) {
  state.searchQuery = value;
}

export function renderGallery() {
  const gallery = document.getElementById('galeria');
  if (!gallery) {
    return;
  }

  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    gallery.innerHTML = '<p class="empty-results">No encontramos prendas con esos filtros. Prueba otra búsqueda o categoría.</p>';
    const count = document.getElementById('catalog-count');
    if (count) count.textContent = '0 prendas';
    return;
  }

  const count = document.getElementById('catalog-count');
  if (count) count.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'prenda' : 'prendas'}`;

  const cards = filteredProducts
    .map((product, index) => {
      const soldBadge = product.vendido
        ? '<span class="sold-badge">Agotada</span>'
        : '';

      const imageClasses = product.vendido ? 'opacity-40 grayscale' : '';
      const itemTitle = escapeHtml(product.titulo);
      const itemBrand = escapeHtml(product.marca);
      const itemTalla = escapeHtml(product.talla);
      const itemId = escapeHtml(product.id);

      return `
        <article
          class="product-card group reveal-up"
          data-action="open-modal"
          data-id="${product.id}"
          data-product-id="${product.id}"
          role="button"
          tabindex="0"
          style="animation-delay: ${index * 0.08}s;"
          aria-label="Abrir detalle de ${itemTitle}"
        >
          <div class="relative overflow-hidden aspect-[3/4]">
            <img
              src="${product.imagen}"
              alt="${itemTitle} - ${itemBrand}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClasses}"
              loading="lazy"
              decoding="async"
            >
            ${soldBadge}
          </div>
          <div class="p-4 md:p-6">
            <p class="text-[8px] font-black tracking-[0.2em] md:tracking-[0.3em] brand-label uppercase">${itemBrand}</p>
            <h3 class="text-xs md:text-sm font-bold truncate mt-1">${itemTitle}</h3>
            <div class="flex justify-between items-center mt-2 md:mt-4">
              <span class="font-black text-sm md:text-lg ${product.vendido ? 'text-gray-500 font-medium line-through' : ''}">${formatPrice(product.precio)}</span>
              <span class="text-[9px] md:text-[10px] text-gray-500 font-mono">${itemId}</span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <span class="product-size font-mono">${itemTalla}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  gallery.innerHTML = cards;
}

export function updateCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach((button) => {
    const isActive = button.dataset.filter === state.currentFilter || button.textContent.includes(state.currentFilter);
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}
