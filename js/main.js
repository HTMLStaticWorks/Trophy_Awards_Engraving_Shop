/* ============================================================
   MAIN JS — Nav, Scroll Reveal, Counters, Back-to-top
   ============================================================ */

(function () {
  'use strict';

  // ─── Navbar ─────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-close');

  function setActiveNavLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
    updateBackToTop();
  }, { passive: true });

  function openMobileMenu() {
    if (!mobileMenu || !mobileOverlay) return;
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileOverlay) return;
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    mobileMenu && mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  mobileClose && mobileClose.addEventListener('click', closeMobileMenu);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

  // ─── Scroll Reveal ──────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // ─── Stagger Observer ───────────────────────────────────
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

  // ─── Animated Counters ──────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
    const suffix = el.dataset.suffix || '';
    const duration = parseInt(el.dataset.duration || '2000', 10);
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-value').forEach(el => counterObserver.observe(el));

  // ─── Back to Top ────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }

  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Product Filter Tabs ─────────────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('[data-category]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'fadeUp 0.4s ease forwards';
        }
      });
    });
  });

  // ─── Modal System ────────────────────────────────────────
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });

  // Expose globally
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ─── Smooth Scroll for anchor links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  // ─── Alert bar dismiss ───────────────────────────────────
  const alertBar = document.querySelector('.site-alert');
  const alertClose = document.querySelector('.alert-close');
  alertClose && alertClose.addEventListener('click', () => {
    alertBar && (alertBar.style.display = 'none');
  });

  // ─── Testimonial Carousel ────────────────────────────────
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialPrev = document.querySelector('.testimonial-prev');
  const testimonialNext = document.querySelector('.testimonial-next');
  let testimonialIndex = 0;

  function getVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function updateTestimonials() {
    if (!testimonialTrack) return;
    const items = testimonialTrack.querySelectorAll('.testimonial-card');
    const visible = getVisible();
    const maxIndex = Math.max(0, items.length - visible);
    testimonialIndex = Math.min(testimonialIndex, maxIndex);
    const pct = (100 / visible) * testimonialIndex;
    testimonialTrack.style.transform = `translateX(-${pct}%)`;
  }

  testimonialNext && testimonialNext.addEventListener('click', () => {
    if (!testimonialTrack) return;
    const items = testimonialTrack.querySelectorAll('.testimonial-card');
    const visible = getVisible();
    const max = Math.max(0, items.length - visible);
    testimonialIndex = testimonialIndex >= max ? 0 : testimonialIndex + 1;
    updateTestimonials();
  });

  testimonialPrev && testimonialPrev.addEventListener('click', () => {
    if (!testimonialTrack) return;
    const items = testimonialTrack.querySelectorAll('.testimonial-card');
    const visible = getVisible();
    const max = Math.max(0, items.length - visible);
    testimonialIndex = testimonialIndex <= 0 ? max : testimonialIndex - 1;
    updateTestimonials();
  });

  window.addEventListener('resize', updateTestimonials);

  // ─── Parallax hero ───────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.35;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  // ─── Theme & RTL Toggles ─────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const rtlToggle = document.getElementById('rtl-toggle');
  
  // Init Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.documentElement.classList.remove('light-theme');
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }

  // Init RTL
  const savedRtl = localStorage.getItem('rtl');
  if (savedRtl === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
    if (rtlToggle) rtlToggle.classList.add('active');
  }

  // Toggle Theme Event
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }

  // Toggle RTL Event
  if (rtlToggle) {
    rtlToggle.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('rtl', 'false');
        rtlToggle.classList.remove('active');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('rtl', 'true');
        rtlToggle.classList.add('active');
      }
    });
  }

  // ─── Init ────────────────────────────────────────────────
  setActiveNavLinks();
  updateBackToTop();
})();
