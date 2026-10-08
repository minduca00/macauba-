const WHATSAPP = "";
const MENSAGEM = "Olá! Vi o site do Estúdio Macaúba e quero saber mais sobre o estúdio.";

if (WHATSAPP) {
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGEM)}`;
  ['zap', 'zap2'].forEach(id => {
    const link = document.getElementById(id);
    if (!link) return;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  const label = document.querySelector('#contato .label');
  const footerLink = document.getElementById('zap2');
  if (label) label.textContent = 'WhatsApp';
  if (footerLink) footerLink.textContent = 'Fale conosco — WhatsApp';
}

const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
}

const header = document.querySelector('header');
if (header) {
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * -18;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
    hero.style.setProperty('--mx', `${offsetX}px`);
    hero.style.setProperty('--my', `${offsetY}px`);
  });
}

const lines = document.querySelectorAll('.linhas p');
if (lines.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('on');
    });
  }, { threshold: 0.6 });

  lines.forEach(line => io.observe(line));
}

const portfolioItems = [
  { title: 'Ensaios', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Artistas', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Beauty', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Vídeo', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Conteúdo', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Campanhas', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80' }
];

const carouselTrack = document.getElementById('carouselTrack');
const previousButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');
const currentCounter = document.getElementById('carouselCurrent');
const totalCounter = document.getElementById('carouselTotal');

if (carouselTrack && previousButton && nextButton && currentCounter && totalCounter) {
  let currentIndex = 0;
  let isAnimating = false;
  let pointerStartX = null;
  let suppressCardClick = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cards = portfolioItems.map(item => {
    const card = document.createElement('button');
    const image = document.createElement('img');
    card.type = 'button';
    card.className = 'carousel-card';
    image.src = item.image;
    image.alt = item.title;
    card.append(image);
    carouselTrack.append(card);
    return card;
  });

  totalCounter.textContent = String(cards.length).padStart(2, '0');

  function updateCarousel() {
    cards.forEach((card, index) => {
      card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden-left', 'is-hidden-right');
      let difference = index - currentIndex;

      if (difference > cards.length / 2) difference -= cards.length;
      if (difference < -cards.length / 2) difference += cards.length;

      if (difference === 0) {
        card.classList.add('is-center');
        card.style.pointerEvents = 'auto';
        card.setAttribute('aria-hidden', 'false');
        card.tabIndex = 0;
      } else if (difference === -1) {
        card.classList.add('is-left');
        card.style.pointerEvents = 'auto';
        card.setAttribute('aria-hidden', 'false');
        card.tabIndex = 0;
      } else if (difference === 1) {
        card.classList.add('is-right');
        card.style.pointerEvents = 'auto';
        card.setAttribute('aria-hidden', 'false');
        card.tabIndex = 0;
      } else {
        card.classList.add(difference < -1 ? 'is-hidden-left' : 'is-hidden-right');
        card.style.pointerEvents = 'none';
        card.setAttribute('aria-hidden', 'true');
        card.tabIndex = -1;
      }
    });

    currentCounter.textContent = String(currentIndex + 1).padStart(2, '0');
  }

  function moveCarousel(direction) {
    if (isAnimating || cards.length < 2) return;
    isAnimating = true;
    currentIndex = (currentIndex + direction + cards.length) % cards.length;
    updateCarousel();
    if (reducedMotion.matches) {
      isAnimating = false;
      return;
    }
    window.setTimeout(() => {
      isAnimating = false;
    }, 700);
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (suppressCardClick || isAnimating) return;
      let difference = index - currentIndex;
      if (difference > cards.length / 2) difference -= cards.length;
      if (difference < -cards.length / 2) difference += cards.length;
      if (difference === -1) moveCarousel(-1);
      if (difference === 1) moveCarousel(1);
    });
  });

  previousButton.addEventListener('click', () => moveCarousel(-1));
  nextButton.addEventListener('click', () => moveCarousel(1));

  carouselTrack.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveCarousel(event.key === 'ArrowLeft' ? -1 : 1);
  });

  carouselTrack.addEventListener('pointerdown', event => {
    pointerStartX = event.clientX;
    carouselTrack.setPointerCapture(event.pointerId);
  });

  carouselTrack.addEventListener('pointerup', event => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) > 50) {
      suppressCardClick = true;
      window.setTimeout(() => {
        suppressCardClick = false;
      }, 0);
    }
    if (distance < -50) moveCarousel(1);
    if (distance > 50) moveCarousel(-1);
  });

  carouselTrack.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  updateCarousel();
}
