(() => {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('header#верх');
  const logo = document.querySelector('header img[src*="mfm-brand-mark"]');
  const sections = [...document.querySelectorAll('main section[data-screen-label]')];
  let frameRequested = false;

  if (logo) logo.classList.add('mfm-motion-logo');

  const progress = document.createElement('div');
  progress.className = 'mfm-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span class="mfm-scroll-progress__bar"></span><span class="mfm-scroll-progress__marker"></span>';
  body.append(progress);

  const numberValue = (value) => Number.parseFloat(value) || 0;

  const shapeMetrics = (element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const borderX = numberValue(style.borderLeftWidth) + numberValue(style.borderRightWidth);
    const borderY = numberValue(style.borderTopWidth) + numberValue(style.borderBottomWidth);
    const triangle = rect.width <= 2 && rect.height <= 2 && borderX >= 8 && borderY >= 6;
    return { rect, style, triangle };
  };

  const isSmallShape = (element) => {
    if (element.closest('.dc-texture')) return false;
    const { rect, triangle } = shapeMetrics(element);
    if (triangle) return true;
    return rect.width >= 8 && rect.width <= 52 && rect.height >= 4 && rect.height <= 52;
  };

  const classifyShape = (element) => {
    const { rect, style, triangle } = shapeMetrics(element);
    if (triangle) return 'triangle';
    const radius = numberValue(style.borderTopLeftRadius);
    if (radius >= Math.min(rect.width, rect.height) * 0.4) return 'circle';
    if (rect.width / Math.max(1, rect.height) >= 2.8 || rect.height / Math.max(1, rect.width) >= 2.8) return 'line';
    return 'square';
  };

  sections.forEach((section, index) => {
    section.classList.add('mfm-motion-section');
    const shapes = [...section.querySelectorAll('[aria-hidden="true"]')].filter(isSmallShape);
    shapes.forEach((shape, shapeIndex) => {
      shape.classList.add('mfm-motion-shape', `mfm-shape--${classifyShape(shape)}`);
      shape.style.setProperty('--mfm-motion-delay', `${-((index + shapeIndex) % 8) * 0.4}s`);
      const group = shape.closest('a, button, [role="button"]') || shape.parentElement;
      if (group && group !== section) group.classList.add('mfm-shape-group');
    });

    const ambientShape = shapes.find((shape) => !shape.closest('nav'));
    if (ambientShape) ambientShape.classList.add('mfm-motion-shape--ambient');

    const kicker = section.firstElementChild;
    if (kicker?.tagName === 'DIV') {
      const directChildren = [...kicker.children];
      const directSpans = directChildren.filter((element) => element.tagName === 'SPAN');
      if (directChildren.length >= 2 && directChildren.length === directSpans.length && kicker.textContent.trim().length <= 100) {
        kicker.classList.add('mfm-motion-kicker');
      }
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

  const isSemanticTag = (element) => {
    if (element.closest('header, nav, a, button, [role="button"]')) return false;
    if (element.classList.contains('mfm-motion-shape') || element.classList.contains('mfm-pair-node')) return false;

    const text = element.textContent.trim();
    if (!text || text.length > 58) return false;

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const borderWidth = numberValue(style.borderTopWidth)
      + numberValue(style.borderRightWidth)
      + numberValue(style.borderBottomWidth)
      + numberValue(style.borderLeftWidth);
    const mono = style.fontFamily.toLowerCase().includes('jetbrains mono');
    const semanticLabel = /[=↑↓]|только|режим|контур|факт|план/i.test(text);

    return borderWidth >= 1
      && rect.width >= 28
      && rect.width <= 460
      && rect.height >= 18
      && rect.height <= 54
      && (mono || semanticLabel);
  };

  const classifyTag = (text) => {
    if (text.includes('↑')) return 'up';
    if (text.includes('↓')) return 'down';
    if (text.includes('=')) return 'steady';
    if (/только|режим|контур/i.test(text)) return 'scope';
    return 'note';
  };

  const semanticTags = [...document.querySelectorAll('main span')].filter(isSemanticTag);
  semanticTags.forEach((tag, index) => {
    tag.classList.add('mfm-motion-tag', `mfm-tag--${classifyTag(tag.textContent.trim())}`);
    tag.style.setProperty('--mfm-tag-index', String(index % 8));
  });

  const tagParents = new Set(semanticTags.map((tag) => tag.parentElement).filter(Boolean));
  tagParents.forEach((parent) => {
    const directTags = [...parent.children].filter((child) => child.classList.contains('mfm-motion-tag'));
    if (directTags.length < 2) return;
    parent.classList.add('mfm-tag-group');
    directTags.forEach((tag, index) => tag.style.setProperty('--mfm-tag-index', String(index)));
  });

  const parseCount = (element) => {
    const text = element.textContent;
    const match = text.match(/^\s*([+−-]?\s*)(\d[\d\u00a0 ]*)(\s*(?:₽|%|дн\.?|дней|шт\.?|мес\.?)\s*)$/iu);
    if (!match) return null;
    const value = Number.parseInt(match[2].replace(/[\s\u00a0]/g, ''), 10);
    if (!Number.isFinite(value) || value === 0) return null;
    return { finalText: text, prefix: match[1], suffix: match[3], value };
  };

  const formatCount = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  const countCandidates = [...document.querySelectorAll('main strong, main span, main p, main [data-mfm-count]')]
    .filter((element) => element.childElementCount === 0)
    .filter((element) => !element.closest('[data-mfm-demo]'))
    .map((element) => ({ element, count: parseCount(element) }))
    .filter(({ count }) => count);

  const countGroups = new Map();
  countCandidates.forEach((candidate) => {
    const group = candidate.element.closest('section') || candidate.element.parentElement;
    const index = countGroups.get(group) || 0;
    candidate.count.delay = Math.min(index * 120, 600);
    countGroups.set(group, index + 1);
  });

  const playCount = (element, count) => {
    if (element.dataset.mfmCountState === 'played') return;
    element.dataset.mfmCountState = 'played';
    const duration = Math.min(1750, 1050 + Math.log10(count.value + 1) * 110);
    window.setTimeout(() => {
      const startedAt = performance.now();
      const step = (now) => {
        const progressValue = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        const current = Math.round(count.value * eased);
        element.textContent = `${count.prefix}${formatCount.format(current)}${count.suffix}`;
        if (progressValue < 1) window.requestAnimationFrame(step);
        else element.textContent = count.finalText;
      };
      window.requestAnimationFrame(step);
    }, count.delay);
  };

  const visualObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      if (element.classList.contains('mfm-countup')) {
        const item = countCandidates.find((candidate) => candidate.element === element);
        if (item) playCount(element, item.count);
      } else {
        element.dataset.mfmVisual = 'played';
      }
      visualObserver.unobserve(element);
    }
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.28,
  });

  if (!reducedMotion.matches) {
    countCandidates.forEach(({ element, count }) => {
      const width = element.getBoundingClientRect().width;
      element.classList.add('mfm-countup');
      element.dataset.mfmCountState = 'pending';
      element.setAttribute('aria-label', count.finalText.trim());
      if (width > 0) element.style.minWidth = `${Math.ceil(width)}px`;
      element.textContent = `${count.prefix}${formatCount.format(0)}${count.suffix}`;
      visualObserver.observe(element);
    });
  }

  const motionBars = [...document.querySelectorAll('main [style*="width:"]')]
    .filter((element) => {
      const widthMatch = element.getAttribute('style')?.match(/(?:^|;)\s*width\s*:\s*(\d+(?:\.\d+)?)%/i);
      if (!widthMatch) return false;
      const percentage = Number.parseFloat(widthMatch[1]);
      const style = window.getComputedStyle(element);
      const height = element.getBoundingClientRect().height;
      return percentage >= 4
        && percentage < 99
        && height >= 3
        && height <= 72
        && style.backgroundColor !== 'rgba(0, 0, 0, 0)'
        && style.backgroundColor !== 'transparent'
        && !element.closest('[data-mfm-demo]')
        && !element.closest('header, footer');
    });

  motionBars.forEach((bar) => {
    const siblings = [...bar.parentElement.children].filter((element) => motionBars.includes(element));
    bar.classList.add('mfm-motion-bar');
    bar.style.setProperty('--mfm-bar-index', String(Math.max(0, siblings.indexOf(bar))));
    bar.dataset.mfmVisual = reducedMotion.matches ? 'played' : 'pending';
  });

  const barGroups = [...new Set(motionBars.map((bar) => bar.parentElement).filter(Boolean))];
  const barObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      motionBars
        .filter((bar) => bar.parentElement === entry.target)
        .forEach((bar) => { bar.dataset.mfmVisual = 'played'; });
      barObserver.unobserve(entry.target);
    }
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.18,
  });
  if (!reducedMotion.matches) barGroups.forEach((group) => barObserver.observe(group));

  const motionCharts = [...document.querySelectorAll('main svg[role="img"]')];
  motionCharts.forEach((chart) => {
    chart.classList.add('mfm-motion-chart');
    chart.dataset.mfmVisual = reducedMotion.matches ? 'played' : 'pending';
    [...chart.querySelectorAll('path, polyline, line')].forEach((line, index) => {
      const stroke = String(line.getAttribute('stroke') || '').toLowerCase();
      const grid = stroke === '#d9d3bc' || stroke === '#ece7d2';
      line.classList.add(grid ? 'mfm-chart-grid' : 'mfm-chart-series');
      line.style.setProperty('--mfm-chart-index', String(index));
    });
    [...chart.querySelectorAll('circle')].forEach((point, index) => {
      point.classList.add('mfm-chart-point');
      point.style.setProperty('--mfm-point-index', String(index));
    });
    if (!reducedMotion.matches) visualObserver.observe(chart);
  });

  const tocLinks = [...document.querySelectorAll('main aside nav#содержание a[href^="#"], .site-toc__links a[href^="#"]')]
    .map((link) => {
      let target = null;
      try {
        target = document.querySelector(link.getAttribute('href'));
      } catch {
        return null;
      }
      if (!target) return null;
      link.classList.add('mfm-toc-link');
      const index = link.firstElementChild;
      if (index?.tagName === 'SPAN') index.classList.add('mfm-toc-index');
      return { link, target };
    })
    .filter(Boolean);

  const updateTocState = () => {
    if (!tocLinks.length) return;
    const marker = window.scrollY + Math.max(180, (header?.getBoundingClientRect().height || 0) + 78);
    let current = tocLinks[0];
    for (const item of tocLinks) {
      if (item.target.offsetTop <= marker) current = item;
    }
    for (const item of tocLinks) {
      const active = item === current;
      item.link.classList.toggle('is-reading', active);
      if (active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  };

  const pairElements = [...document.querySelectorAll('[data-mfm-pair], a[href^="#блок-"], a[href^="#зона-"]')];
  const pairRows = [...document.querySelectorAll('[id^="блок-"]')];
  const pairGroups = new Map();
  const pairNamespace = body.dataset.mfmPage
    || decodeURIComponent(window.location.pathname.split('/').pop() || 'page').replace(/\.html$/i, '')
    || 'page';
  let hoveredPair = '';

  const pairKeyFromValue = (value) => {
    let decoded = String(value || '').replace(/^#/, '');
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      return '';
    }
    const match = decoded.match(/^(?:блок|зона)-(\d+)$/);
    return match ? `${pairNamespace}-${match[1]}` : '';
  };

  const registerPairElement = (element, key) => {
    if (!key) return;
    const compactMarker = Boolean(element.dataset.mfmPair) || element.textContent.trim().length <= 2;
    element.dataset.mfmPair = key;
    element.classList.add(compactMarker ? 'mfm-pair-node' : 'mfm-pair-link');
    const group = pairGroups.get(key) || [];
    group.push(element);
    pairGroups.set(key, group);
  };

  pairElements.forEach((element) => {
    registerPairElement(element, element.dataset.mfmPair || pairKeyFromValue(element.getAttribute('href')));
  });

  pairRows.forEach((row) => {
    const key = pairKeyFromValue(row.id);
    if (!key) return;
    row.dataset.mfmPairRow = key;
    row.classList.add('mfm-pair-row');
  });

  const currentHashPair = () => pairKeyFromValue(window.location.hash);

  const renderPairState = () => {
    const activePair = hoveredPair || currentHashPair();
    pairGroups.forEach((elements, key) => {
      elements.forEach((element) => element.classList.toggle('is-pair-active', key === activePair));
    });
    pairRows.forEach((row) => row.classList.toggle('is-pair-active', row.dataset.mfmPairRow === activePair));
  };

  pairElements.forEach((element) => {
    const key = element.dataset.mfmPair;
    element.addEventListener('mouseenter', () => {
      hoveredPair = key;
      renderPairState();
    });
    element.addEventListener('mouseleave', () => {
      hoveredPair = '';
      renderPairState();
    });
    element.addEventListener('focus', () => {
      hoveredPair = key;
      renderPairState();
    });
    element.addEventListener('blur', () => {
      hoveredPair = '';
      renderPairState();
    });
  });

  window.addEventListener('hashchange', renderPairState);
  renderPairState();

  const updateHeaderMetrics = () => {
    const height = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    root.style.setProperty('--mfm-sticky-header-height', `${height}px`);
  };

  if (header && 'ResizeObserver' in window) {
    new ResizeObserver(updateHeaderMetrics).observe(header);
  }

  const updateScrollEffects = () => {
    frameRequested = false;
    const scrollRange = Math.max(1, root.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
    root.style.setProperty('--mfm-scroll-progress', scrollProgress.toFixed(5));
    root.style.setProperty('--mfm-logo-angle', `${(window.scrollY * 0.18).toFixed(2)}deg`);
    root.style.setProperty('--mfm-texture-shift', `${(-window.scrollY * 0.035).toFixed(2)}px`);
    header?.classList.toggle('mfm-header-scrolled', window.scrollY > 8);
    updateTocState();
  };

  const requestScrollUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  const updateMotionPreference = () => {
    body.classList.toggle('mfm-motion-enabled', !reducedMotion.matches);
    if (reducedMotion.matches) {
      countCandidates.forEach(({ element, count }) => { element.textContent = count.finalText; });
      motionBars.forEach((bar) => { bar.dataset.mfmVisual = 'played'; });
      motionCharts.forEach((chart) => { chart.dataset.mfmVisual = 'played'; });
    }
    updateScrollEffects();
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', () => {
    updateHeaderMetrics();
    requestScrollUpdate();
  });
  reducedMotion.addEventListener('change', updateMotionPreference);
  updateHeaderMetrics();
  updateScrollEffects();
})();
