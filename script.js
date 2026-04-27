(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reading-progress bar ---------- */
  const progress = document.getElementById('progress');
  const updateProgress = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    progress.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  toggle?.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    mobile.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      mobile.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.revealDelay || 0;
          el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      const strength = 14;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Parallax (about image, hero mark) ---------- */
  if (!reduced) {
    const parallaxEls = [
      ...document.querySelectorAll('[data-parallax]'),
    ].map(el => ({ el, factor: parseFloat(el.dataset.parallax) || 0.1 }));

    const heroMark = document.querySelector('.hero-mark-float');

    const onParallax = () => {
      const y = window.scrollY;
      parallaxEls.forEach(({ el, factor }) => {
        const r = el.getBoundingClientRect();
        const visible = r.top < window.innerHeight && r.bottom > 0;
        if (visible) {
          const offset = (r.top - window.innerHeight / 2) * -factor;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
      if (heroMark) {
        heroMark.style.setProperty('--parY', `${y * 0.08}px`);
        heroMark.style.transform = `translateY(${y * 0.08}px)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  /* ---------- Form submit (stub) ---------- */
  const form = document.querySelector('.visit-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('.btn-label');
    const arrow = btn.querySelector('.btn-arrow');
    const original = label.textContent;
    label.textContent = 'Thank you — we’ll be in touch';
    if (arrow) arrow.style.opacity = '0';
    btn.disabled = true;
    setTimeout(() => {
      label.textContent = original;
      if (arrow) arrow.style.opacity = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
})();
