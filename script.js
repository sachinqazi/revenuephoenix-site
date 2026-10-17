// ── COUNTRY / CURRENCY LOGIC ──
  const PRICES = {
    shopify: { usd: 800,   inr: 67000  },
    brand:   { usd: 500,   inr: 42000  },
  };

  function formatINR(n) {
    // Indian number formatting: ₹67,000
    return '₹' + n.toLocaleString('en-IN');
  }
  function formatUSD(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function applyCountry(country) {
    const isIndia = country === 'india';

    // Prices
    document.getElementById('price-shopify').textContent =
      isIndia ? formatINR(PRICES.shopify.inr) : formatUSD(PRICES.shopify.usd);
    document.getElementById('price-brand').textContent =
      isIndia ? formatINR(PRICES.brand.inr) : formatUSD(PRICES.brand.usd);
    const designEl = document.getElementById('price-design');
    if (designEl) designEl.textContent = isIndia ? '₹42,000' : '$500';
    const combo1 = document.getElementById('price-combo1');
    if (combo1) combo1.textContent = isIndia ? '₹75,000' : '$900';
    const combo2 = document.getElementById('price-combo2');
    if (combo2) combo2.textContent = isIndia ? '₹1,00,000' : '$1,200';
    const combo3 = document.getElementById('price-combo3');
    if (combo3) combo3.textContent = isIndia ? '₹67,000' : '$800';

    // Hero badge
    document.getElementById('heroBadgeText').textContent = 'Trusted by Brands in 5 Countries';

    // Footer serving text
    document.getElementById('footerServing').textContent =
      'Serving clients across India, USA, Canada, UAE & Australia';

    // Header indicator (currently disabled/commented out in HTML — guard so this
    // never throws if it's re-enabled or left off)
    const flagEl = document.getElementById('indicatorFlag');
    if (flagEl) flagEl.textContent = isIndia ? '🇮🇳' : '🇺🇸';
    const labelEl = document.getElementById('indicatorLabel');
    if (labelEl) labelEl.textContent = isIndia ? 'INR' : 'USD';
  }

  function selectCountry(country) {
    sessionStorage.setItem('ros_country', country);
    applyCountry(country);

    const overlay = document.getElementById('countryOverlay');
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 380);

    // Unblock scroll
    document.body.style.overflow = '';
  }

  function reopenCountrySelector() {
    const existing = document.getElementById('countryOverlay');
    if (existing) { existing.remove(); }

    const overlay = document.createElement('div');
    overlay.className = 'country-overlay';
    overlay.id = 'countryOverlay';
    overlay.innerHTML = `
      <div class="country-modal">
        <div class="country-modal-logo">
          <div class="country-modal-icon">R</div>
          <div class="country-modal-logo-text">Revenue<span>Phoenix</span></div>
        </div>
        <span class="country-modal-wave">🌍</span>
        <h2>Change Your Region</h2>
        <p>Select your country to see pricing in your local currency.</p>
        <div class="country-options">
          <button class="country-btn usa" onclick="selectCountry('usa')">
            <div class="country-flag">🇺🇸</div>
            <div class="country-name">United States</div>
            <div class="country-currency">Prices in USD $</div>
          </button>
          <button class="country-btn india" onclick="selectCountry('india')">
            <div class="country-flag">🇮🇳</div>
            <div class="country-name">India</div>
            <div class="country-currency">Prices in INR ₹</div>
          </button>
        </div>
        <button class="country-skip" onclick="selectCountry('${sessionStorage.getItem('ros_country') || 'usa'}')">Cancel</button>
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  // Country popup disabled — single default currency (USD) applied directly
  window.addEventListener('DOMContentLoaded', () => {
    applyCountry('usa');
    const overlay = document.getElementById('countryOverlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  });

  // ── MOBILE MENU ──
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileMenuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close on link click
  document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── HEADER SCROLL SHADOW ──
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── REVEAL ON SCROLL ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ── COUNTER ANIMATION ──
  function animateCounter(el, target) {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stats-grid').forEach(el => counterObserver.observe(el));

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

// ── Hero Canvas Animation ──────────────────────────────
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  const COLORS = {
    node: '#c0392b',
    line: 'rgba(192,57,43,0.15)',
    graph: 'rgba(192,57,43,0.25)',
    bg: 'transparent'
  };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes(n) {
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1.5
      });
    }
  }

  // Rising graph line points
  const graphPts = [];
  function buildGraph() {
    graphPts.length = 0;
    const steps = 10;
    let y = H * 0.75;
    for (let i = 0; i <= steps; i++) {
      graphPts.push({ x: (W / steps) * i, y });
      y -= (Math.random() * H * 0.04 + H * 0.01);
      if (y < H * 0.2) y = H * 0.3;
    }
  }

  let graphOffset = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw animated rising graph
    ctx.beginPath();
    ctx.moveTo(graphPts[0].x - graphOffset, graphPts[0].y);
    for (let i = 1; i < graphPts.length; i++) {
      ctx.lineTo(graphPts[i].x - graphOffset, graphPts[i].y);
    }
    ctx.strokeStyle = COLORS.graph;
    ctx.lineWidth = 2;
    ctx.stroke();
    graphOffset += 0.3;
    if (graphOffset > W / graphPts.length) {
      graphOffset = 0;
      buildGraph();
    }

    // Draw connecting lines between close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = COLORS.line;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw & move nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.node;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  // Parallax + fade on scroll
  const hero = document.getElementById('heroSection');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight;
    const progress = Math.min(scrollY / heroH, 1);
    canvas.style.transform = `translateY(${scrollY * 0.4}px)`;
    canvas.style.opacity = 1 - progress * 1.2;
  });

  function init() {
    resize();
    createNodes(60);
    buildGraph();
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createNodes(60);
    buildGraph();
  });

  init();
})();
// ── Magnetic Cursor ────────────────────────────────────
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with smooth lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring near buttons & links
  const targets = 'a, button, .btn-primary, .btn-outline, .service-card, .package-card';

  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
  });

  // Shrink dot on click
  window.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
  });
  window.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();