import { prendas } from './productos.js';

prendas.forEach((prenda, index) => {
    prenda.id = `#${String(index + 1).padStart(3, '0')}`;
});

let indexActual = 0;
let currentFilter = 'Mujer';
let searchQuery = '';
let carrito = JSON.parse(localStorage.getItem('val_store_cart')) || [];
const bgMusic = document.getElementById('bg-music');
const canciones = [
    'musica/cancion1.mp3',
    'musica/cancion2.mp3',
    'musica/cancion3.mp3'
];
let cancionesDisponibles = [...canciones];
let indiceCancion = Math.floor(Math.random() * cancionesDisponibles.length);
[cancionesDisponibles[0], cancionesDisponibles[indiceCancion]] = [cancionesDisponibles[indiceCancion], cancionesDisponibles[0]];
indiceCancion = 0;
bgMusic.src = cancionesDisponibles[indiceCancion];

function reproducirSiguiente() {
    indiceCancion++;
    if (indiceCancion >= cancionesDisponibles.length) {
        cancionesDisponibles = [...canciones].sort(() => Math.random() - 0.5);
        indiceCancion = 0;
    }
    bgMusic.src = cancionesDisponibles[indiceCancion];
    bgMusic.play().catch(e => console.log("Permiso de audio bloqueado", e));
}

bgMusic.addEventListener('ended', reproducirSiguiente);

function lanzarParticulas(iconId, symbol) {
    const icon = document.getElementById(iconId);
    if (!icon) return;

    const bounds = icon.getBoundingClientRect();
    const particleCount = 7;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'patrio-particle';
        particle.textContent = symbol;
        particle.style.left = `${bounds.left + bounds.width / 2}px`;
        particle.style.top = `${bounds.top + bounds.height / 2}px`;
        particle.style.setProperty('--particle-size', `${10 + Math.random() * 5}px`);
        particle.style.setProperty('--particle-x', `${(Math.random() - 0.5) * 90}px`);
        particle.style.setProperty('--particle-y', `${45 + Math.random() * 75}px`);
        particle.style.setProperty('--particle-rotation', `${(Math.random() - 0.5) * 45}deg`);
        particle.addEventListener('animationend', () => particle.remove(), { once: true });
        document.body.appendChild(particle);
    }
}

function prepararLluviaPatria() {
    document.querySelectorAll('.tematica-patria .falling-flag, .tematica-patria .falling-torch').forEach(element => {
        element.style.setProperty('--left', `${Math.random() * 100}%`);
        element.style.setProperty('--duration', `${6 + Math.random() * 6}s`);
        element.style.setProperty('--delay', `${-Math.random() * 12}s`);
        element.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
        element.style.setProperty('--rotation-start', `${-18 + Math.random() * 36}deg`);
    });
}

function createHeartShower(x, y) {
    const kiss = document.getElementById('interactiveKiss') || document.querySelector('.kiss-o');
    if (!kiss) return;

    const bounds = kiss.getBoundingClientRect();
    const symbols = ['💖', '❤️', '💋', '💕'];
    const originX = x || bounds.left + bounds.width / 2;
    const originY = y || bounds.top + bounds.height / 2;
    for (let index = 0; index < 15; index++) {
        const particle = document.createElement('span');
        particle.className = 'heart-particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = `${originX + (Math.random() * 100 - 50)}px`;
        particle.style.top = `${originY}px`;
        particle.style.setProperty('--heart-size', `${12 + Math.random() * 13}px`);
        particle.style.setProperty('--heart-duration', `${1.1 + Math.random() * 0.8}s`);
        particle.style.setProperty('--heart-x', `${-150 + Math.random() * 300}px`);
        particle.style.setProperty('--heart-y', `${90 + Math.random() * 150}px`);
        particle.style.setProperty('--heart-rotation', `${-35 + Math.random() * 70}deg`);
        particle.addEventListener('animationend', () => particle.remove(), { once: true });
        document.body.appendChild(particle);
    }
}

prepararLluviaPatria();
document.querySelectorAll('.kiss-o').forEach(kiss => {
    kiss.addEventListener('click', event => createHeartShower(event.clientX, event.clientY));
    kiss.addEventListener('touchstart', event => {
        event.preventDefault();
        const touch = event.changedTouches[0];
        createHeartShower(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
    }, { passive: false });
    kiss.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            createHeartShower();
        }
    });
});

document.addEventListener("visibilitychange", function() {
    if (document.hidden && !bgMusic.paused) {
        bgMusic.pause();
        document.getElementById('music-control').style.opacity = '0.5';
    }
});

const hero = document.getElementById('hero');
const introStage = document.getElementById('intro-stage');
const cartToggle = document.getElementById('cart-toggle-btn');
let catalogActive = false;

function moverEntrada3D(clientX, clientY) {
    if (!introStage || hero.style.display === 'none') return;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;
    introStage.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
}

hero.addEventListener('pointermove', event => moverEntrada3D(event.clientX, event.clientY));
hero.addEventListener('pointerleave', () => {
    if (introStage) introStage.style.transform = '';
});

window.addEventListener('scroll', () => {
    if (catalogActive && window.scrollY > 40) cartToggle.classList.remove('hidden');
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    actualizarUI_Carrito();
});

function startExperience() {
    catalogActive = true;
    cartToggle.classList.remove('hidden');
    cartToggle.classList.add('flex');
    hero.classList.add('intro-exit');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-2%) rotateX(2deg)';
    hero.style.pointerEvents = 'none';
    setTimeout(() => hero.style.display = 'none', 800);

    document.getElementById('main-nav').style.opacity = '1';
    document.getElementById('mobile-nav').style.opacity = '1';
    bgMusic.play().catch(e => console.log("Permiso de audio bloqueado", e));
    renderGaleria();
}

function filterItems(category) {
    currentFilter = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(category)) btn.classList.add('active');
    });
    renderGaleria();
}

function normalizarTexto(value) {
    return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

document.getElementById('catalog-search-input').addEventListener('input', event => {
    searchQuery = event.target.value;
    renderGaleria();
});

function renderGaleria() {
    const container = document.getElementById('galeria');
    container.innerHTML = '';

    let filtered = prendas.filter(p => {
        const coincideCategoria = currentFilter === 'Oferta' ? p.oferta === true : p.cat === currentFilter;
        const termino = normalizarTexto(searchQuery.trim().replace(/^#/, ''));
        const coincideBusqueda = !termino || normalizarTexto(p.titulo).includes(termino) || normalizarTexto(p.id).replace(/^#/, '').includes(termino);
        return coincideCategoria && coincideBusqueda;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-results">No se encontraron prendas que coincidan con tu búsqueda 💋</p>';
        return;
    }

    filtered.forEach((p, i) => {
        const globalIndex = prendas.indexOf(p);
        const esVendida = p.precio.toUpperCase().includes('VENDID');
        container.innerHTML += `
            <div class="product-card group reveal-up" data-id="${p.id}" style="animation-delay: ${i*0.08}s" onclick="abrirModal(${globalIndex})">
                <div class="relative overflow-hidden aspect-[3/4]">
                    <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${esVendida ? 'opacity-40 grayscale' : ''}">
                    ${esVendida ? '<div class="absolute inset-0 flex items-center justify-center bg-black/40 font-black text-xs tracking-widest text-red-500 uppercase">AGOTADO</div>' : ''}
                </div>
                <div class="p-4 md:p-6">
                    <p class="text-[8px] font-black tracking-[0.2em] md:tracking-[0.3em] text-[#E01E37] uppercase">${p.marca}</p>
                    <h3 class="text-xs md:text-sm font-bold truncate mt-1">${p.titulo}</h3>
                    <div class="flex justify-between items-center mt-2 md:mt-4">
                        <span class="font-black text-sm md:text-lg ${esVendida ? 'text-red-500 font-medium' : ''}">${p.precio}</span>
                        <span class="text-[9px] md:text-[10px] text-gray-500 font-mono">${p.id}</span>
                    </div>
                    <div class="flex justify-between items-center mt-1">
                        <span class="product-size font-mono">${p.talla}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

function abrirModal(index) {
    indexActual = index;
    actualizarModal();
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function cerrar() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function cambiarPrenda(dir) {
    let filtered = prendas.filter(p => {
        if(currentFilter === 'Oferta') return p.oferta === true;
        return p.cat === currentFilter;
    });
    let currentFilteredIndex = filtered.indexOf(prendas[indexActual]);
    currentFilteredIndex += dir;
    if(currentFilteredIndex < 0) currentFilteredIndex = filtered.length - 1;
    if(currentFilteredIndex >= filtered.length) currentFilteredIndex = 0;
    indexActual = prendas.indexOf(filtered[currentFilteredIndex]);
    actualizarModal();
}

function actualizarModal() {
    const p = prendas[indexActual];
    const imgElement = document.getElementById('m-img');
    imgElement.src = p.img;
    imgElement.classList.remove('anim-pop');
    void imgElement.offsetWidth;
    imgElement.classList.add('anim-pop');

    document.getElementById('m-marca').innerText = p.marca;
    document.getElementById('m-titulo').innerText = p.titulo;
    document.getElementById('m-precio').innerText = p.precio;
    document.getElementById('m-talla').innerText = `Talla: ${p.talla}`;

    const btnCarrito = document.getElementById('btn-agregar-carrito');
    if (p.precio.toUpperCase().includes('VENDID')) {
        btnCarrito.innerText = "Prenda No Disponible ✕";
        btnCarrito.disabled = true;
        btnCarrito.className = "w-full bg-gray-800 text-gray-500 py-4 rounded-xl font-bold uppercase tracking-wider cursor-not-allowed";
    } else {
        btnCarrito.innerText = "Agregar al Carrito 💋";
        btnCarrito.disabled = false;
        btnCarrito.className = "w-full bg-[#E01E37] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(224,30,55,0.3)] active:scale-[0.98]";
    }
}

function toggleMusic() {
    const mc = document.getElementById('music-control');
    if(bgMusic.paused) { bgMusic.play(); mc.style.opacity = '1'; }
    else { bgMusic.pause(); mc.style.opacity = '0.5'; }
}

function toggleCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
    } else {
        sidebar.classList.add('translate-x-full');
    }
}

function agregarAlCarrito() {
    const p = prendas[indexActual];

    const existe = carrito.some(item => item.img === p.img && item.titulo === p.titulo);
    if(existe) {
        alert("Esta prenda ya se encuentra en tu carrito 💋");
        cerrar();
        return;
    }

    carrito.push(p);
    localStorage.setItem('val_store_cart', JSON.stringify(carrito));
    actualizarUI_Carrito();
    cerrar();
    toggleCartSidebar();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('val_store_cart', JSON.stringify(carrito));
    actualizarUI_Carrito();
}

function actualizarUI_Carrito() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const totalElement = document.getElementById('cart-total');

    container.innerHTML = '';
    let sumaTotal = 0;

    if(carrito.length === 0) {
        container.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12"><p class="text-sm">Tu carrito está vacío.</p><p class="text-xs mt-1">¡Añade tus prendas favoritas! 💋</p></div>`;
        badge.classList.add('hidden');
        totalElement.innerText = "Q0";
        return;
    }

    badge.innerText = carrito.length;
    badge.classList.remove('hidden');

    carrito.forEach((item, index) => {
        const valorNumerico = parseInt(item.precio.replace(/[^0-9]/g, '')) || 0;
        sumaTotal += valorNumerico;

        container.innerHTML += `
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 relative group">
                <img src="${item.img}" class="w-16 h-20 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <p class="text-[8px] font-black tracking-widest text-[#E01E37] uppercase truncate">${item.marca}</p>
                    <h4 class="text-xs font-bold text-white truncate">${item.titulo}</h4>
                    <p class="text-[10px] text-gray-400 font-mono mt-0.5">Talla: ${item.talla}</p>
                    <p class="text-sm font-black text-white mt-1">${item.precio}</p>
                </div>
                <button onclick="eliminarDelCarrito(${index})" class="text-gray-500 hover:text-red-500 p-2 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;
    });

    totalElement.innerText = `Q${sumaTotal}`;
}

function obtenerCodigoPrenda(item) {
    if (item.id) return item.id;

    const catalogIndex = prendas.findIndex(prenda => prenda.img === item.img);
    return catalogIndex >= 0
        ? `#${String(catalogIndex + 1).padStart(3, '0')}`
        : '#000';
}

function enviarPedidoWhatsApp() {
    if(carrito.length === 0) return;

    let mensaje = 'Hola me interesa la siguiente selección de prendas 💋\n\n';
    let total = 0;

    carrito.forEach((item, itemIndex) => {
        mensaje += `${itemIndex + 1}. 📌 ${item.titulo}\n`;
        mensaje += `- ID: ${obtenerCodigoPrenda(item)}\n`;
        mensaje += `- Marca: ${item.marca}\n`;
        mensaje += `- Talla: ${item.talla}\n`;
        mensaje += `- Precio: ${item.precio}\n`;
        mensaje += `- Imagen: ${item.img}\n\n`;

        const valor = parseInt(item.precio.replace(/[^0-9]/g, '')) || 0;
        total += valor;
    });

    mensaje += `🛍️ *Total estimado:* Q${total}\n`;
    mensaje += `¿Están disponibles para coordinar mi compra? ¡Gracias!`;

    const urlWA = `https://wa.me/50240283552?text=${encodeURIComponent(mensaje)}`;
    const cartIcon = document.querySelector('#cart-toggle-btn svg');
    const flyingCart = cartIcon.cloneNode(true);
    const cartBounds = cartIcon.getBoundingClientRect();
    flyingCart.classList.add('cart-flight');
    flyingCart.style.left = `${cartBounds.left}px`;
    flyingCart.style.top = `${cartBounds.top}px`;
    flyingCart.style.width = `${cartBounds.width}px`;
    flyingCart.style.height = `${cartBounds.height}px`;
    document.body.appendChild(flyingCart);
    flyingCart.addEventListener('animationend', () => flyingCart.remove(), { once: true });
    setTimeout(() => window.open(urlWA, '_blank'), 360);
}

Object.assign(window, {
    agregarAlCarrito,
    abrirModal,
    cambiarPrenda,
    cerrar,
    eliminarDelCarrito,
    enviarPedidoWhatsApp,
    filterItems,
    startExperience,
    toggleCartSidebar,
    toggleMusic
});
