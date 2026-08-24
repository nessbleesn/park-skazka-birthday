const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const experienceCards = [...document.querySelectorAll('[data-category]')];
const packageButtons = [...document.querySelectorAll('[data-select-package]')];
const selectedLabel = document.querySelector('[data-selected-label]');
const scrollProgress = document.querySelector('[data-scroll-progress]');
const hero = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero-photo');
const heroTicket = document.querySelector('.hero-ticket');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionAllowed = !reducedMotion.matches;

if (motionAllowed) {
  document.documentElement.classList.add('has-motion');
  requestAnimationFrame(() => document.body.classList.add('is-ready'));
} else {
  document.body.classList.add('is-ready');
}

const syncViewportState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  if (scrollProgress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }
  if (motionAllowed && hero && heroPhoto && window.innerWidth > 780) {
    const heroProgress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
    heroPhoto.style.setProperty('--photo-scroll-y', `${heroProgress * -22}px`);
  }
};

let scrollFrame = 0;
const requestViewportSync = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    syncViewportState();
    scrollFrame = 0;
  });
};

syncViewportState();
window.addEventListener('scroll', requestViewportSync, { passive: true });
window.addEventListener('resize', requestViewportSync, { passive: true });

if (motionAllowed && hero && heroPhoto && heroTicket && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    heroPhoto.style.setProperty('--photo-pointer-x', `${x * 6}px`);
    heroPhoto.style.setProperty('--photo-pointer-y', `${y * 4}px`);
    heroTicket.style.setProperty('--ticket-pointer-x', `${x * 8}px`);
    heroTicket.style.setProperty('--ticket-pointer-y', `${y * 6}px`);
    heroTicket.style.setProperty('--ticket-rotate', `${x * 0.7}deg`);
  });

  hero.addEventListener('pointerleave', () => {
    heroPhoto.style.setProperty('--photo-pointer-x', '0px');
    heroPhoto.style.setProperty('--photo-pointer-y', '0px');
    heroTicket.style.setProperty('--ticket-pointer-x', '0px');
    heroTicket.style.setProperty('--ticket-pointer-y', '0px');
    heroTicket.style.setProperty('--ticket-rotate', '0deg');
  });
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    experienceCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.hidden = !matches;
      card.classList.remove('filter-enter');
      if (matches && motionAllowed) {
        requestAnimationFrame(() => {
          card.classList.add('filter-enter');
          card.addEventListener('animationend', () => card.classList.remove('filter-enter'), { once: true });
        });
      }
    });
  });
});

packageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('[data-package]');
    const packageName = card?.dataset.package || '';

    document.querySelectorAll('[data-package]').forEach((item) => {
      item.classList.toggle('is-selected', item === card);
      item.classList.remove('selection-pop');
    });

    if (card && motionAllowed) {
      requestAnimationFrame(() => {
        card.classList.add('selection-pop');
        card.addEventListener('animationend', () => card.classList.remove('selection-pop'), { once: true });
      });
    }

    if (selectedLabel) selectedLabel.textContent = packageName;

    document.querySelector('.final-cta')?.scrollIntoView({ behavior: motionAllowed ? 'smooth' : 'auto', block: 'center' });
  });
});

if ('IntersectionObserver' in window && motionAllowed) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  const revealGroups = [
    ['.intro-grid > *, .promise-strip span, .package-card, .steps-list li', 'reveal-up'],
    ['.experience-card', 'reveal-clip'],
    ['.venue-photo, .weather-card', 'reveal-scale'],
    ['.venue-copy, .accordion details', 'reveal-fade'],
  ];

  revealGroups.forEach(([selector, effect]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.classList.add('reveal', effect);
      item.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
      observer.observe(item);
    });
  });

  const finalCta = document.querySelector('.final-cta');
  if (finalCta) {
    const finalObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      finalCta.classList.add('is-active');
      finalObserver.disconnect();
    }, { threshold: 0.18 });
    finalObserver.observe(finalCta);
  }

}
