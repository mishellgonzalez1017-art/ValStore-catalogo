export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function parsePrice(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '').trim();
    if (!cleaned) {
      return 0;
    }
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function formatPrice(value) {
  const numericValue = Number(parsePrice(value) || 0);
  return `Q${numericValue}`;
}

export function normalizeProduct(product = {}) {
  const rawTitle = String(product.titulo || product.title || '').replace(/\s+/g, ' ').trim();
  const rawMarca = String(product.marca || product.brand || '').replace(/\s+/g, ' ').trim();
  const rawCategoria = String(product.categoria || product.cat || 'Mujer').trim();
  const rawId = String(product.id || '').trim();
  const rawPrice = product.precio ?? product.price ?? 0;
  const isSold = Boolean(product.vendido ?? /vendid/i.test(String(rawPrice)));
  const numericPrice = isSold ? 0 : parsePrice(rawPrice);

  const normalized = {
    id: rawId,
    titulo: rawTitle,
    marca: rawMarca
      .replace(/VICTORIA SECREt/i, 'VICTORIA SECRET')
      .replace(/OLD NAVI/i, 'OLD NAVY')
      .replace(/Nena\b/i, 'NENA')
      .replace(/\s{2,}/g, ' ')
      .trim(),
    precio: numericPrice,
    talla: String(product.talla || product.size || '').replace(/\s+/g, ' ').trim(),
    categoria: rawCategoria,
    imagen: String(product.imagen || product.img || '').trim(),
    oferta: Boolean(product.oferta),
    vendido: isSold
  };

  return normalized;
}

export function warnCatalogIssues(products) {
  const ids = products.map((product) => product.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) {
    console.warn('IDs duplicados detectados:', [...new Set(duplicates)]);
  }

  const numericIds = ids
    .map((id) => {
      const match = String(id).match(/#(\d+)/);
      return match ? Number(match[1]) : null;
    })
    .filter((value) => value !== null)
    .sort((a, b) => a - b);

  const missing = [];
  for (let i = 1; i < numericIds.length; i += 1) {
    const previous = numericIds[i - 1];
    const current = numericIds[i];
    for (let value = previous + 1; value < current; value += 1) {
      missing.push(`#${String(value).padStart(3, '0')}`);
    }
  }

  if (missing.length) {
    console.warn('IDs faltantes detectados:', missing.slice(0, 10));
  }
}
