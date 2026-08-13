const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const experienceCards = [...document.querySelectorAll('[data-category]')];
const packageButtons = [...document.querySelectorAll('[data-select-package]')];
const selectedLabel = document.querySelector('[data-selected-label]');
const mailtoButton = document.querySelector('[data-mailto]');

const syncHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

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
    });
  });
});

packageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('[data-package]');
    const packageName = card?.dataset.package || '';

    document.querySelectorAll('[data-package]').forEach((item) => {
      item.classList.toggle('is-selected', item === card);
    });

    if (selectedLabel) selectedLabel.textContent = packageName;

    if (mailtoButton) {
      const subject = 'День рождения в Парке Сказка';
      const body = `Здравствуйте! Интересует пакет «${packageName}». Подскажите, пожалуйста, свободные даты и итоговую стоимость.`;
      mailtoButton.href = `mailto:event@parkskazka.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    document.querySelector('.final-cta')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.package-card, .experience-card, .venue-photo, .steps-list li').forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
}
