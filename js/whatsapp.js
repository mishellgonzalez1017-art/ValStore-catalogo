import { getCartItems } from './cart.js';
import { getCatalogProductById } from './catalog.js';

const PHONE_NUMBER = '50240283552';

export function buildOrderMessage() {
  const items = getCartItems();

  if (!items.length) {
    return '';
  }

  let message = 'Hola me interesa la siguiente selección de prendas 💋\n\n';
  let total = 0;

  items.forEach((item, itemIndex) => {
    message += `${itemIndex + 1}. 📌 ${item.titulo}\n`;
    message += `- ID: ${item.id}\n`;
    message += `- Marca: ${item.marca}\n`;
    message += `- Talla: ${item.talla}\n`;
    message += `- Precio: Q${item.precio}\n`;
    message += `- Imagen: ${item.imagen}\n\n`;
    total += Number(item.precio) || 0;
  });

  message += `🛍️ *Total estimado:* Q${total}\n`;
  message += '¿Están disponibles para coordinar mi compra? ¡Gracias!';
  return message;
}

export function sendWhatsAppOrder() {
  const items = getCartItems();
  if (!items.length) {
    return;
  }

  const message = buildOrderMessage();
  const urlWA = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(urlWA, '_blank');
}
