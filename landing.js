(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.scroll-progress span');
  const stage = document.querySelector('.hero-stage');
  const cards = Array.from(document.querySelectorAll('.float-card'));
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const storyItems = Array.from(document.querySelectorAll('.story-item'));
  const panels = Array.from(document.querySelectorAll('.demo-panel'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMenu = (open) => {
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };

  menuBtn?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  reveals.forEach(el => revealObserver.observe(el));

  const updateScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (scrollTop / max) * 100 : 0) + '%';

    if (!reduceMotion && stage) {
      const rect = stage.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      stage.style.transform = 'translateY(' + (p * 42) + 'px) scale(' + (1 - p * .035) + ') rotate(' + (-p * .6) + 'deg)';
      const offsets = [
        {x:-18,y:-24,r:-6},{x:10,y:18,r:5},{x:16,y:-16,r:-1},{x:-10,y:20,r:-3}
      ];
      cards.forEach((card, i) => {
        const o = offsets[i] || offsets[0];
        card.style.transform = 'translate3d(' + (o.x * p) + 'px,' + (o.y * p) + 'px,0) rotate(' + o.r + 'deg)';
      });
    }

    let activeIndex = 0;
    storyItems.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      if (center < window.innerHeight * .68) activeIndex = i;
    });
    storyItems.forEach((item, i) => item.classList.toggle('active', i === activeIndex));
    panels.forEach((panel, i) => panel.classList.toggle('active', i === activeIndex));
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  document.querySelectorAll('.faq-q').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(x => {
        x.classList.remove('open');
        x.querySelector('.faq-q')?.setAttribute('aria-expanded','false');
        const symbol = x.querySelector('.faq-q b');
        if (symbol) symbol.textContent = '+';
      });
      if (!wasOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded','true');
        const symbol = button.querySelector('b');
        if (symbol) symbol.textContent = '−';
      }
    });
  });

  document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const success = document.querySelector('.form-success');
    if (success) success.classList.add('show');
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();