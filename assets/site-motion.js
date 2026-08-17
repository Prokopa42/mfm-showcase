(() => {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const logo = document.querySelector('header img[src*="mfm-brand-mark"]');
  const sections = [...document.querySelectorAll('main section[data-screen-label]')];
  let frameRequested = false;

  if (logo) logo.classList.add('mfm-motion-logo');

  const progress = document.createElement('div');
  progress.className = 'mfm-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span class="mfm-scroll-progress__bar"></span><span class="mfm-scroll-progress__marker"></span>';
  body.append(progress);

  const isSmallShape = (element) => {
    if (element.closest('.dc-texture')) return false;
    const rect = element.getBoundingClientRect();
    return rect.width >= 8 && rect.width <= 52 && rect.height >= 6 && rect.height <= 52;
  };

  sections.forEach((section, index) => {
    section.classList.add('mfm-motion-section');
    const shape = [...section.querySelectorAll('[aria-hidden="true"]')].find(isSmallShape);
    if (shape) {
      shape.classList.add('mfm-motion-shape');
      shape.style.setProperty('--mfm-motion-delay', `${-(index % 6) * 0.55}s`);
    }

    const rect = section.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    section.dataset.mfmMotion = visible ? 'visible' : 'pending';
  });

  if (!reducedMotion.matches) body.classList.add('mfm-motion-enabled');

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.dataset.mfmMotion = entry.isIntersecting ? 'visible' : 'pending';
    }
  }, {
    rootMargin: '8% 0px 8% 0px',
    threshold: 0.02,
  });

  sections.forEach((section) => observer.observe(section));

  const updateScrollEffects = () => {
    frameRequested = false;
    const scrollRange = Math.max(1, root.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
    root.style.setProperty('--mfm-scroll-progress', scrollProgress.toFixed(5));
    root.style.setProperty('--mfm-logo-angle', `${(window.scrollY * 0.18).toFixed(2)}deg`);
    root.style.setProperty('--mfm-texture-shift', `${(-window.scrollY * 0.035).toFixed(2)}px`);
  };

  const requestScrollUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  const updateMotionPreference = () => {
    body.classList.toggle('mfm-motion-enabled', !reducedMotion.matches);
    updateScrollEffects();
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  reducedMotion.addEventListener('change', updateMotionPreference);
  updateScrollEffects();
})();
