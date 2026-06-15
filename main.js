document.addEventListener('DOMContentLoaded', () => {

  /* Header scroll shadow */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile burger menu */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      burger.setAttribute('aria-expanded', String(!isOpen));
      burger.querySelector('.icon-open').classList.toggle('hidden', !isOpen);
      burger.querySelector('.icon-close').classList.toggle('hidden', isOpen);
    });
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        burger.querySelector('.icon-open').classList.remove('hidden');
        burger.querySelector('.icon-close').classList.add('hidden');
      }
    });
  }

  /* Active nav link */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) {
      link.classList.add('!text-[#1a1f29]', 'font-semibold');
    }
  });

  /* Quiz calculator */
  document.querySelectorAll('[data-quiz]').forEach(quiz => {
    const steps = quiz.querySelectorAll('[data-step]');
    const total = steps.length;
    const bar = quiz.querySelector('[data-quiz-bar]');
    const stepLabel = quiz.querySelector('[data-quiz-step-label]');
    const progLabel = quiz.querySelector('[data-quiz-progress-label]');
    const backBtn = quiz.querySelector('[data-quiz-back]');
    const answersField = quiz.querySelector('[data-quiz-answers]');
    let cur = 0;
    const answers = [];
    const render = () => {
      steps.forEach((s, i) => { s.hidden = (i !== cur); });
      const pct = Math.round((cur / (total - 1)) * 100);
      if (bar) bar.style.width = pct + '%';
      if (stepLabel) stepLabel.textContent = 'Вопрос ' + (cur + 1) + ' из ' + total;
      if (progLabel) progLabel.textContent = pct + '%';
      if (backBtn) backBtn.classList.toggle('hidden', cur === 0);
      if (answersField) answersField.value = answers.join(' / ');
    };
    quiz.querySelectorAll('.quiz-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const step = opt.closest('[data-step]');
        step.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');
        answers[cur] = opt.dataset.val;
        if (cur < total - 1) { setTimeout(() => { cur++; render(); }, 180); }
      });
    });
    if (backBtn) backBtn.addEventListener('click', () => { if (cur > 0) { cur--; render(); } });
    render();
  });

  /* Form submit handler */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const success = form.querySelector('[data-success]');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Отправка...'; }
      setTimeout(() => {
        form.querySelectorAll('input,textarea').forEach(el => { el.disabled = true; });
        if (success) success.classList.remove('hidden');
        if (btn) btn.classList.add('hidden');
      }, 600);
    });
  });

  /* Motion scroll animations */
  if (typeof Motion === 'undefined') {
    document.querySelectorAll('[data-roller]').forEach(r => r.classList.add('open'));
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = (parseFloat(el.dataset.count) || 0).toLocaleString('ru-RU') + (el.dataset.suffix || '');
    });
    return;
  }

  const { animate, inView, stagger } = Motion;
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = [0.25, 0.1, 0.25, 1];

  if (noMotion) {
    document.querySelectorAll('.fade-up, .fade-in, .fade-left, .fade-right, .zoom-in').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    document.querySelectorAll('[data-roller]').forEach(r => r.classList.add('open'));
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = (parseFloat(el.dataset.count) || 0).toLocaleString('ru-RU') + (el.dataset.suffix || '');
    });
    return;
  }

  document.querySelectorAll('.fade-up:not(.stagger-child)').forEach(el => {
    inView(el, () => { animate(el, { opacity: [0, 1], y: [32, 0] }, { duration: 0.55, easing: ease }); }, { margin: '-60px' });
  });
  document.querySelectorAll('.fade-in').forEach(el => {
    inView(el, () => { animate(el, { opacity: [0, 1] }, { duration: 0.65, easing: ease }); }, { margin: '-60px' });
  });
  document.querySelectorAll('.fade-left').forEach(el => {
    inView(el, () => { animate(el, { opacity: [0, 1], x: [-32, 0] }, { duration: 0.55, easing: ease }); }, { margin: '-60px' });
  });
  document.querySelectorAll('.fade-right').forEach(el => {
    inView(el, () => { animate(el, { opacity: [0, 1], x: [36, 0] }, { duration: 0.55, easing: ease }); }, { margin: '-60px' });
  });
  document.querySelectorAll('.zoom-in').forEach(el => {
    inView(el, () => { animate(el, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.6, easing: ease }); }, { margin: '-60px' });
  });
  document.querySelectorAll('.stagger-parent').forEach(parent => {
    const children = parent.querySelectorAll('.stagger-child');
    if (!children.length) return;
    inView(parent, () => {
      animate(children, { opacity: [0, 1], y: [24, 0] }, { duration: 0.45, delay: stagger(0.08), easing: ease });
    }, { margin: '-40px' });
  });

  /* Marketing: roller shutter reveal */
  document.querySelectorAll('[data-roller]').forEach(roller => {
    inView(roller, () => { setTimeout(() => roller.classList.add('open'), 450); }, { margin: '-80px' });
  });

  /* Marketing: animated counters */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    inView(el, () => {
      const start = performance.now();
      const dur = 1400;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('ru-RU') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { margin: '-40px' });
  });

});
