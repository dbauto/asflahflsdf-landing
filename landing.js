(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.scroll-progress span');
  const puzzleHero = document.querySelector('.hero-puzzle');
  const puzzleStage = document.querySelector('.puzzle-stage');
  const puzzlePieces = Array.from(document.querySelectorAll('.puzzle-piece'));
  const puzzleTitle = document.querySelector('.hero-puzzle-title');
  const problemSection = document.querySelector('.problem');
  const problemScroll = document.querySelector('.problem-scroll');
  const problemStatement = document.querySelector('.big-statement');
  const problemKicker = problemSection?.querySelector('.statement-kicker, .eyebrow');
  const problemWords = [];
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

  // Turn the problem statement into individually scroll-scrubbed words while
  // preserving the italic emphasis already in the markup.
  if (problemStatement) {
    const wrapProblemWords = (node, inheritedItalic = false) => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(part));
              return;
            }

            const span = document.createElement('span');
            span.className = 'problem-word' + (inheritedItalic ? ' problem-word-italic' : '');
            span.textContent = part;
            span.setAttribute('aria-hidden', 'true');
            fragment.appendChild(span);
            problemWords.push(span);
          });
          child.replaceWith(fragment);
          return;
        }

        if (child.nodeType === Node.ELEMENT_NODE) {
          wrapProblemWords(child, inheritedItalic || child.tagName === 'EM');
        }
      });
    };

    wrapProblemWords(problemStatement);
    problemStatement.classList.add('problem-animated');
    problemStatement.setAttribute('aria-label', 'When quality lives across folders, spreadsheets, chats, emails, and memory, compliance becomes detective work.');
  }

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

    if (puzzleHero && puzzlePieces.length) {
      const heroRect = puzzleHero.getBoundingClientRect();
      const travel = Math.max(1, puzzleHero.offsetHeight - window.innerHeight);
      const raw = Math.max(0, Math.min(1, -heroRect.top / travel));

      // Preserve the exact scattered hero composition first.
      // The assembly only begins after the user has scrolled into the hero.
      const startAt = 0.14;
      const endAt = 0.84;
      const normalized = Math.max(0, Math.min(1, (raw - startAt) / (endAt - startAt)));
      const p = normalized * normalized * (3 - 2 * normalized);
      const desktopMotion = !reduceMotion && window.innerWidth > 760;

      puzzlePieces.forEach((piece, index) => {
        if (!desktopMotion) {
          piece.style.transform = 'none';
          return;
        }

        const sx = Number(piece.dataset.sx || 0);
        const sy = Number(piece.dataset.sy || 0);
        const sr = Number(piece.dataset.sr || 0);

        const x = sx * (1 - p);
        const y = sy * (1 - p);
        const r = sr * (1 - p);
        const scale = .92 + (.08 * p);

        // No movement at the exact starting frame; subtle float begins only
        // once the user starts scrolling, then fades out as pieces connect.
        const motionGate = Math.max(0, Math.min(1, raw / startAt));
        const drift = Math.sin((scrollTop * .008) + index) * 2.2 * (1 - p) * motionGate;

        piece.style.transform =
          'translate3d(' + (x + drift) + 'px,' + y + 'px,0) rotate(' + r + 'deg) scale(' + scale + ')';
      });

      puzzleHero.classList.toggle('solved', normalized > .92);

      if (puzzleStage && desktopMotion) {
        puzzleStage.style.transform = 'scale(' + (.965 + p * .035) + ')';
      }

      if (puzzleTitle && desktopMotion) {
        puzzleTitle.style.transform = 'translateY(' + (-10 * p) + 'px)';
        puzzleTitle.style.opacity = String(1 - p * .12);
      }
    }

    if (problemScroll && problemWords.length) {
      const rect = problemScroll.getBoundingClientRect();
      const travel = Math.max(1, problemScroll.offsetHeight - window.innerHeight);
      const rawProblem = Math.max(0, Math.min(1, -rect.top / travel));
      const wordCount = Math.max(1, problemWords.length - 1);

      problemWords.forEach((word, index) => {
        const isItalic = word.classList.contains('problem-word-italic');

        // The sentence paints itself across the pinned scroll scene.
        // The italic conclusion intentionally trails the body copy.
        const stagger = (index / wordCount) * .76 + (isItalic ? .045 : 0);
        const local = Math.max(0, Math.min(1, (rawProblem - stagger) / .19));
        const eased = local * local * (3 - 2 * local);

        const y = 34 * (1 - eased);
        const x = isItalic ? 24 * (1 - eased) : 0;
        const blur = 7 * (1 - eased);

        word.style.opacity = String(.10 + eased * .90);
        word.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        word.style.filter = 'blur(' + blur + 'px)';
      });

      if (problemKicker && !reduceMotion) {
        const kp = Math.max(0, Math.min(1, rawProblem / .16));
        problemKicker.style.opacity = String(.28 + kp * .72);
        problemKicker.style.transform = 'translateY(' + (16 * (1 - kp)) + 'px)';
      }

      const hint = problemSection?.querySelector('.problem-scroll-hint');
      if (hint) {
        const fade = Math.max(0, 1 - Math.max(0, rawProblem - .12) / .18);
        hint.style.opacity = String(fade * .62);
      }
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

  if (puzzleStage && !reduceMotion) {
    puzzleStage.addEventListener('pointermove', (event) => {
      if (window.innerWidth <= 760 || puzzleHero?.classList.contains('solved')) return;
      const rect = puzzleStage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - .5;
      const ny = (event.clientY - rect.top) / rect.height - .5;
      puzzleStage.style.perspectiveOrigin = ((nx + .5) * 100) + '% ' + ((ny + .5) * 100) + '%';
    });
  }

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