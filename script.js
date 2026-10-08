const WHATSAPP = ""; // Configure com DDI e DDD, somente números.
const MENSAGEM = "Olá! Vi o site do Estúdio Macaúba e quero saber mais sobre o estúdio.";

if (WHATSAPP.trim()) {
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGEM)}`;
  ['zap', 'zap2'].forEach(id => {
    const link = document.getElementById(id);
    if (!link) return;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.hidden = false;
  });
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
  { title: 'Ensaios', category: 'Ensaios', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Artistas', category: 'Artistas', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Beauty', category: 'Beauty', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Vídeo', category: 'Vídeo', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Conteúdo', category: 'Conteúdo', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Campanhas', category: 'Campanhas', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80' }
];

const carouselTrack = document.getElementById('carouselTrack');
const previousButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');
const currentCounter = document.getElementById('carouselCurrent');
const totalCounter = document.getElementById('carouselTotal');
const currentCategory = document.getElementById('carouselCategory');
const currentTitle = document.getElementById('carouselTitle');
const filterButtons = document.querySelectorAll('.portfolio-filter');

if (carouselTrack && previousButton && nextButton && currentCounter && totalCounter && currentCategory && currentTitle) {
  let currentIndex = 0;
  let isAnimating = false;
  let pointerStartX = null;
  let suppressCardClick = false;
  let visibleItems = portfolioItems;
  let cards = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    totalCounter.textContent = String(visibleItems.length).padStart(2, '0');
    currentCategory.textContent = visibleItems[currentIndex].category;
    currentTitle.textContent = visibleItems[currentIndex].title;
    carouselTrack.setAttribute('aria-label', `Carrossel de portfólio: ${visibleItems[currentIndex].title}`);
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

  function renderCards() {
    cards = visibleItems.map((item, index) => {
      const card = document.createElement('button');
      const image = document.createElement('img');
      card.type = 'button';
      card.className = 'carousel-card';
      card.dataset.index = String(index);
      card.setAttribute('aria-label', `${item.title} — ${item.category}`);
      image.src = item.image;
      image.alt = item.title;
      image.loading = 'lazy';
      card.append(image);
      return card;
    });
    carouselTrack.replaceChildren(...cards);
    updateCarousel();
  }

  function selectCategory(category) {
    visibleItems = category === 'Todos'
      ? portfolioItems
      : portfolioItems.filter(item => item.category === category);
    currentIndex = 0;
    isAnimating = false;
    carouselTrack.style.transition = 'none';
    carouselTrack.style.transform = '';
    renderCards();
    carouselTrack.offsetWidth;
    carouselTrack.style.transition = '';
  }

  carouselTrack.addEventListener('click', event => {
    const card = event.target.closest('.carousel-card');
    if (!card || suppressCardClick || isAnimating) return;
    const index = Number(card.dataset.index);
    let difference = index - currentIndex;
    if (difference > cards.length / 2) difference -= cards.length;
    if (difference < -cards.length / 2) difference += cards.length;
    if (difference === -1) moveCarousel(-1);
    if (difference === 1) moveCarousel(1);
  });

  previousButton.addEventListener('click', () => moveCarousel(-1));
  nextButton.addEventListener('click', () => moveCarousel(1));

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(filter => {
        const isActive = filter === button;
        filter.classList.toggle('is-active', isActive);
        filter.setAttribute('aria-pressed', String(isActive));
      });
      selectCategory(button.dataset.category);
    });
  });

  carouselTrack.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveCarousel(event.key === 'ArrowLeft' ? -1 : 1);
  });

  carouselTrack.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointerStartX = event.clientX;
    carouselTrack.style.transition = 'none';
    carouselTrack.setPointerCapture(event.pointerId);
  });

  carouselTrack.addEventListener('pointermove', event => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    carouselTrack.style.transform = `translate3d(${distance * 0.18}px,0,0)`;
  });

  carouselTrack.addEventListener('pointerup', event => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    carouselTrack.style.transform = '';
    carouselTrack.style.transition = '';
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
    carouselTrack.style.transform = '';
    carouselTrack.style.transition = '';
  });

  renderCards();
}

const revealTargets = document.querySelectorAll(
  '.studio-copy, .studio-visual, #estrutura .wrap > *, .service-card, .portfolio-head, .portfolio-filters, .portfolio-carousel, #instagram .wrap > *, #local .wrap > *'
);
if (revealTargets.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(target => {
    target.classList.add('reveal');
    revealObserver.observe(target);
  });
}
