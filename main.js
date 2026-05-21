'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. THEME TOGGLE
  // ============================================================
  const html        = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const THEME_KEY   = 'portfolio-theme';
  const savedTheme  = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });

  // ============================================================
  // 2. SCROLL PROGRESS
  // ============================================================
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = `${pct}%`;
  }, { passive: true });

  // ============================================================
  // 3. CUSTOM CURSOR
  // ============================================================
  if (window.matchMedia('(hover: hover)').matches) {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = `${mx}px`; cursor.style.top = `${my}px`;
    });
    const animFollower = () => {
      fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
      follower.style.left = `${fx}px`; follower.style.top = `${fy}px`;
      requestAnimationFrame(animFollower);
    };
    animFollower();
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
  }

  // ============================================================
  // 4. NAVBAR SCROLL
  // ============================================================
  const navbar = document.getElementById('navbar');
  const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ============================================================
  // 5. HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ============================================================
  // 6. TYPING ANIMATION
  // ============================================================
  const typedEl = document.getElementById('typed-text');
  const phrases = ['Data Engineer', 'Cloud & ETL Developer', 'Pipeline Architect', 'AWS Specialist', 'Databricks Engineer'];
  let pi = 0, ci = 0, deleting = false;
  const typeLoop = () => {
    const phrase = phrases[pi];
    typedEl.textContent = deleting ? phrase.slice(0, --ci) : phrase.slice(0, ++ci);
    let delay = deleting ? 50 : 90;
    if (!deleting && ci === phrase.length) { delay = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 300; }
    setTimeout(typeLoop, delay);
  };
  setTimeout(typeLoop, 1200);

  // ============================================================
  // 7. SCROLL REVEAL
  // ============================================================
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  // ============================================================
// 8. PROJECT FILTERING
// ============================================================

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Active button state
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    // Selected filter
    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      // Support multiple categories:
      // data-category="aws python airflow"
      const categories = card.dataset.category.split(' ');
      // Show logic
      const show =
        filter === 'all' ||
        categories.includes(filter);
      // Toggle visibility
      card.classList.toggle('hidden', !show);
      // Re-trigger animation
      if (show) {
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.classList.add('visible');
          });
        });
      } else {
        card.classList.remove('visible');
      }
    });
  });
});

  // ============================================================
  // 9. BACK TO TOP
  // ============================================================
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ============================================================
  // 10. FOOTER YEAR
  // ============================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================================
  // 11. CONTACT FORM
  // ============================================================
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name) { showFeedback('Please enter your name.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFeedback('Please enter a valid email address.', 'error'); return; }
      if (message.length < 10) { showFeedback('Message must be at least 10 characters.', 'error'); return; }
      const btn = form.querySelector('.form-submit');
      btn.disabled = true; btn.textContent = 'Sending...';
      try {
        const response = await fetch('https://formspree.io/f/xlgvgygw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        btn.disabled = false;
        btn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        if (response.ok) { form.reset(); showFeedback("// Message sent. I'll get back to you soon.", 'success'); }
        else { showFeedback('Something went wrong. Please try again.', 'error'); }
      } catch {
        btn.disabled = false; btn.textContent = 'Send Message';
        showFeedback('Network error. Please try again later.', 'error');
      }
    });
  }
  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.style.color = type === 'success' ? 'var(--text-muted)' : 'var(--text-dim)';
    setTimeout(() => { feedback.textContent = ''; }, 5000);
  }

  // ============================================================
  // 12. ACTIVE NAV LINK
  // ============================================================
  const sections    = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        allNavLinks.forEach((l) => {
          l.style.color = '';
          if (l.getAttribute('href') === `#${e.target.id}`) l.style.color = 'var(--text)';
        });
      }
    });
  }, { threshold: 0.45 });
  sections.forEach((s) => secObs.observe(s));

  // ============================================================
  // 13. SKILL TAG STAGGER
  // ============================================================
  const tagObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-tag').forEach((t, i) => {
          t.style.transitionDelay = `${i * 0.04}s`;
          t.style.opacity = '1'; t.style.transform = 'translateY(0)';
        });
        tagObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-category').forEach((cat) => {
    cat.querySelectorAll('.skill-tag').forEach((t) => {
      t.style.opacity = '0'; t.style.transform = 'translateY(8px)';
      t.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s, color 0.2s, background 0.2s';
    });
    tagObs.observe(cat);
  });

  // ============================================================
  // 14. CERTIFICATE SLIDER
  // ============================================================
  (function initCertSlider() {
    const certTrack    = document.getElementById('cert-track');
    const certViewport = document.getElementById('cert-viewport');
    const certPrevBtn  = document.getElementById('cert-prev');
    const certNextBtn  = document.getElementById('cert-next');
    const certDotsWrap = document.getElementById('cert-dots');
    if (!certTrack) return;

    const certSlides = Array.from(certTrack.querySelectorAll('.cert-slide'));
    const total      = certSlides.length;
    let certCurrent  = 0;
    let certDragging = false, certDragStartX = 0, certDragDelta = 0;

    const visibleCount = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxIndex     = () => Math.max(0, total - visibleCount());
    const certSlideW   = () => certSlides.length ? certSlides[0].getBoundingClientRect().width + 24 : 0;

    function buildCertDots() {
      certDotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const d = document.createElement('button');
        d.className = 'cert-dot' + (i === certCurrent ? ' active' : '');
        d.setAttribute('aria-label', `Go to slide ${i + 1}`);
        d.setAttribute('role', 'tab');
        d.addEventListener('click', () => certGoTo(i));
        certDotsWrap.appendChild(d);
      }
    }
    function updateCertUI() {
      certPrevBtn.disabled = certCurrent === 0;
      certNextBtn.disabled = certCurrent >= maxIndex();
      certDotsWrap.querySelectorAll('.cert-dot').forEach((d, i) => d.classList.toggle('active', i === certCurrent));
    }
    function certGoTo(index) {
      certCurrent = Math.max(0, Math.min(index, maxIndex()));
      certTrack.style.transform = `translateX(-${certCurrent * certSlideW()}px)`;
      updateCertUI();
    }

    certPrevBtn.addEventListener('click', () => certGoTo(certCurrent - 1));
    certNextBtn.addEventListener('click', () => certGoTo(certCurrent + 1));
    certViewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') certGoTo(certCurrent - 1);
      if (e.key === 'ArrowRight') certGoTo(certCurrent + 1);
    });

    const startCertDrag = (x) => { certDragging = true; certDragStartX = x; certDragDelta = 0; certTrack.style.transition = 'none'; };
    const moveCertDrag  = (x) => { if (!certDragging) return; certDragDelta = x - certDragStartX; certTrack.style.transform = `translateX(${-certCurrent * certSlideW() + certDragDelta}px)`; };
    const endCertDrag   = () => {
      if (!certDragging) return;
      certDragging = false; certTrack.style.transition = '';
      if (certDragDelta < -60) certGoTo(certCurrent + 1);
      else if (certDragDelta > 60) certGoTo(certCurrent - 1);
      else certGoTo(certCurrent);
    };
    certViewport.addEventListener('mousedown',  (e) => startCertDrag(e.clientX));
    window.addEventListener('mousemove',        (e) => moveCertDrag(e.clientX));
    window.addEventListener('mouseup',          endCertDrag);
    certViewport.addEventListener('touchstart', (e) => startCertDrag(e.touches[0].clientX), { passive: true });
    certViewport.addEventListener('touchmove',  (e) => moveCertDrag(e.touches[0].clientX),  { passive: true });
    certViewport.addEventListener('touchend',   endCertDrag);

    let certAutoTimer = setInterval(() => certGoTo(certCurrent >= maxIndex() ? 0 : certCurrent + 1), 5000);
    const pauseCertAuto = () => { clearInterval(certAutoTimer); certAutoTimer = setInterval(() => certGoTo(certCurrent >= maxIndex() ? 0 : certCurrent + 1), 5000); };
    certPrevBtn.addEventListener('click', pauseCertAuto);
    certNextBtn.addEventListener('click', pauseCertAuto);
    certViewport.addEventListener('mousedown', pauseCertAuto);

    window.addEventListener('resize', () => { buildCertDots(); certGoTo(Math.min(certCurrent, maxIndex())); });
    buildCertDots();
    updateCertUI();
  })();

  // ============================================================
  // 15. PROJECT IMAGE SLIDESHOWS
  //     Wrapped in its own IIFE so variables never collide with
  //     the cert slider above.
  // ============================================================
  document.querySelectorAll('.project-card[data-images]').forEach((card) => {
    const wrap = card.querySelector('.proj-slides');
    if (!wrap) return;

    const srcs = card.dataset.images.split(',').map(s => s.trim()).filter(Boolean);
    if (srcs.length === 0) return;

    let cur = 0;
    let projAutoTimer = null;

    // Build images
    srcs.forEach((src, i) => {
      const img = document.createElement('img');
      img.src       = src;
      img.alt       = `Project screenshot ${i + 1}`;
      img.className = 'ps-img' + (i === 0 ? ' active' : '');
      img.loading   = 'lazy';
      wrap.appendChild(img);
    });

    // Single image — no controls needed
    if (srcs.length === 1) { wrap.classList.add('single'); return; }

    // Counter badge
    const counter = document.createElement('span');
    counter.className   = 'ps-counter';
    counter.textContent = `1 / ${srcs.length}`;
    wrap.appendChild(counter);

    // Dot nav
    const dotsEl = document.createElement('div');
    dotsEl.className = 'ps-dots';
    srcs.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'ps-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Image ${i + 1}`);
      d.addEventListener('click', (e) => { e.stopPropagation(); projGoTo(i); projResetAuto(); });
      dotsEl.appendChild(d);
    });
    wrap.appendChild(dotsEl);

    // Arrow buttons  ← named projPrevBtn / projNextBtn to avoid any clash
    const projPrevBtn = document.createElement('button');
    projPrevBtn.className = 'ps-prev';
    projPrevBtn.setAttribute('aria-label', 'Previous image');
    projPrevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
    projPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); projGoTo(cur - 1); projResetAuto(); });

    const projNextBtn = document.createElement('button');
    projNextBtn.className = 'ps-next';
    projNextBtn.setAttribute('aria-label', 'Next image');
    projNextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
    projNextBtn.addEventListener('click', (e) => { e.stopPropagation(); projGoTo(cur + 1); projResetAuto(); });

    wrap.appendChild(projPrevBtn);
    wrap.appendChild(projNextBtn);

    // Touch swipe
    let touchStartX = 0;
    wrap.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) { projGoTo(delta < 0 ? cur + 1 : cur - 1); projResetAuto(); }
    });

    // Core go-to function — named projGoTo
    function projGoTo(index) {
      const imgs = wrap.querySelectorAll('.ps-img');
      const dots = wrap.querySelectorAll('.ps-dot');
      cur = (index + srcs.length) % srcs.length;
      imgs.forEach((img, i) => img.classList.toggle('active', i === cur));
      dots.forEach((d,   i) => d.classList.toggle('active',   i === cur));
      counter.textContent = `${cur + 1} / ${srcs.length}`;
    }

    // Auto-advance on hover only
    function projStartAuto() { projAutoTimer = setInterval(() => projGoTo(cur + 1), 2500); }
    function projStopAuto()  { clearInterval(projAutoTimer); }
    function projResetAuto() { projStopAuto(); projStartAuto(); }

    card.addEventListener('mouseenter', projStartAuto);
    card.addEventListener('mouseleave', projStopAuto);
  });

}); // end DOMContentLoaded