export function createHeartShower(x, y) {
  const kiss = document.getElementById('interactiveKiss') || document.querySelector('.kiss-o');
  if (!kiss) {
    return;
  }

  const bounds = kiss.getBoundingClientRect();
  const symbols = ['💖', '❤️', '💋', '💕'];
  const originX = x || bounds.left + bounds.width / 2;
  const originY = y || bounds.top + bounds.height / 2;

  for (let index = 0; index < 15; index += 1) {
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

export function initEffects() {
  const hero = document.getElementById('hero');
  const introStage = document.getElementById('intro-stage');

  if (hero) {
    hero.addEventListener('pointermove', (event) => {
      if (!introStage || hero.style.display === 'none') {
        return;
      }

      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      introStage.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
    });

    hero.addEventListener('pointerleave', () => {
      if (introStage) {
        introStage.style.transform = '';
      }
    });
  }

  document.querySelectorAll('.kiss-o').forEach((kissElement) => {
    kissElement.addEventListener('click', (event) => createHeartShower(event.clientX, event.clientY));
    kissElement.addEventListener('touchstart', (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      createHeartShower(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
    }, { passive: false });
    kissElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        createHeartShower();
      }
    });
  });
}

export function startExperience() {
  const hero = document.getElementById('hero');
  const cartToggle = document.getElementById('cart-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const mobileNav = document.getElementById('mobile-nav');

  if (!hero || !cartToggle || !mainNav || !mobileNav) {
    return;
  }

  hero.classList.add('intro-exit');
  hero.style.opacity = '0';
  hero.style.transform = 'translateY(-2%) rotateX(2deg)';
  hero.style.pointerEvents = 'none';
  cartToggle.classList.remove('hidden');
  cartToggle.classList.add('flex');
  mainNav.style.opacity = '1';
  mobileNav.style.opacity = '1';

  setTimeout(() => {
    hero.style.display = 'none';
  }, 800);
}
