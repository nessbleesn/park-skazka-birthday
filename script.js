const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const experienceCards = [...document.querySelectorAll('[data-category]')];
const venueFilterButtons = [...document.querySelectorAll('[data-venue-filter]')];
const venueCards = [...document.querySelectorAll('[data-venue-card]')];
const venueCount = document.querySelector('[data-venue-count]');
const programNavLinks = [...document.querySelectorAll('.program-nav a')];
const programChapters = [...document.querySelectorAll('.program-chapter')];
const offerRails = [...document.querySelectorAll('[data-offer-rail]')];
const packageButtons = [...document.querySelectorAll('[data-select-package]')];
const selectedLabel = document.querySelector('[data-selected-label]');
const hero = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero-photo');
const headerSentinel = document.querySelector('[data-header-sentinel]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionAllowed = !reducedMotion.matches;

if (motionAllowed) {
  document.documentElement.classList.add('has-motion');
  requestAnimationFrame(() => document.body.classList.add('is-ready'));
} else {
  document.body.classList.add('is-ready');
}

if (header && headerSentinel && 'IntersectionObserver' in window) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  });
  headerObserver.observe(headerSentinel);
}

if (motionAllowed && hero && heroPhoto && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    heroPhoto.style.setProperty('--photo-pointer-x', `${x * 6}px`);
    heroPhoto.style.setProperty('--photo-pointer-y', `${y * 4}px`);
  });

  hero.addEventListener('pointerleave', () => {
    heroPhoto.style.setProperty('--photo-pointer-x', '0px');
    heroPhoto.style.setProperty('--photo-pointer-y', '0px');
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

document.querySelectorAll('.rail-controls').forEach((controls) => {
  const chapter = controls.closest('.program-chapter');
  const rail = chapter?.querySelector('[data-offer-rail]');
  if (!rail) return;

  controls.addEventListener('click', (event) => {
    const previous = event.target.closest('[data-rail-prev]');
    const next = event.target.closest('[data-rail-next]');
    if (!previous && !next) return;
    rail.scrollBy({
      left: (previous ? -1 : 1) * Math.max(280, rail.clientWidth * 0.76),
      behavior: motionAllowed ? 'smooth' : 'auto',
    });
  });
});

programNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    programNavLinks.forEach((item) => item.classList.toggle('is-active', item === link));
  });
});

if ('IntersectionObserver' in window && programChapters.length) {
  const programObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    programNavLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.scrollIntoView({ behavior: motionAllowed ? 'smooth' : 'auto', block: 'nearest', inline: 'center' });
    });
  }, { rootMargin: '-24% 0px -56% 0px', threshold: [0.01, 0.2, 0.45] });

  programChapters.forEach((chapter) => programObserver.observe(chapter));
}

venueFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.venueFilter;
    venueFilterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    let visibleCount = 0;
    venueCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.zone === filter;
      card.hidden = !matches;
      card.classList.remove('filter-enter');
      if (!matches) return;
      visibleCount += 1;
      card.classList.add('is-visible');
      if (motionAllowed) {
        requestAnimationFrame(() => {
          card.classList.add('filter-enter');
          card.addEventListener('animationend', () => card.classList.remove('filter-enter'), { once: true });
        });
      }
    });

    if (venueCount) {
      venueCount.textContent = filter === 'all'
        ? 'Показаны все 16 площадок'
        : `Показано площадок: ${visibleCount}`;
    }
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
    ['.program-chapter', 'reveal-clip'],
    ['.venue-photo, .venue-card, .weather-card', 'reveal-scale'],
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
