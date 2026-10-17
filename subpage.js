/* ──────────────────────────────────────────────────────────────
   subpage.js — shared behaviours for standalone pages
   (about.html, portfolio.html, blog.html, and legal pages)

   Loaded INSTEAD of the home-only script.js on inner pages.
   Contains only behaviours that are safe on every page:
   mobile menu, header scroll shadow, smooth in-page scroll,
   and the magnetic cursor. Page-specific logic (portfolio
   filtering, blog article toggle) stays inline on its own page.
   ────────────────────────────────────────────────────────────── */

(function () {
  // ── MOBILE MENU ──
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── HEADER SCROLL SHADOW ──
  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── SMOOTH SCROLL (only for true in-page anchors) ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ── MAGNETIC CURSOR ──────────────────────────────────────────
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Skip on touch / no-hover devices (CSS already hides them).
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const targets = 'a, button, .btn-primary, .btn-outline, .service-card, .package-card';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
  });

  window.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
  });
  window.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();
