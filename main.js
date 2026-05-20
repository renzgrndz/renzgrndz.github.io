'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. THEME TOGGLE (Day / Night)
  // ============================================================
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('theme-toggle');
  const THEME_KEY    = 'portfolio-theme';

  // Load saved preference, fallback to dark
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
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
  const typedEl  = document.getElementById('typed-text');
  const phrases  = ['Data Engineer', 'Cloud & ETL Developer', 'Pipeline Architect', 'AWS Specialist', 'Databricks Engineer'];
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
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = f === 'all' || card.dataset.category === f;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.classList.remove('visible');
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
      if (!name) { showFeedback('Please enter your name.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFeedback('Please enter a valid email address.', 'error'); return; }
      if (message.length < 10) { showFeedback('Message must be at least 10 characters.', 'error'); return; }
      const btn = form.querySelector('.form-submit');
      btn.disabled = true; btn.textContent = 'Sending...';
      setTimeout(() => {
        form.reset(); btn.disabled = false;
        btn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        showFeedback("// Message sent. I'll get back to you soon.", 'success');
      }, 1200);
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
  const track    = document.getElementById('cert-track');
  const viewport = document.getElementById('cert-viewport');
  const prevBtn  = document.getElementById('cert-prev');
  const nextBtn  = document.getElementById('cert-next');
  const dotsWrap = document.getElementById('cert-dots');

  if (!track) return;

  const slides      = Array.from(track.querySelectorAll('.cert-slide'));
  const totalSlides = slides.length;
  let current       = 0;
  let isDragging    = false;
  let dragStartX    = 0;
  let dragDeltaX    = 0;

  // How many slides visible at once?
  const visibleCount = () => {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, totalSlides - visibleCount());

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'cert-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  // Update arrow states + dots
  function updateUI() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    dotsWrap.querySelectorAll('.cert-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Calculate slide width including gap
  function slideWidth() {
    if (slides.length === 0) return 0;
    const gap = 24; // matches CSS gap
    return slides[0].getBoundingClientRect().width + gap;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    updateUI();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard navigation
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch / mouse drag
  const startDrag = (x) => { isDragging = true; dragStartX = x; dragDeltaX = 0; track.style.transition = 'none'; };
  const moveDrag  = (x) => { if (!isDragging) return; dragDeltaX = x - dragStartX; track.style.transform = `translateX(${-current * slideWidth() + dragDeltaX}px)`; };
  const endDrag   = () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    if (dragDeltaX < -60) goTo(current + 1);
    else if (dragDeltaX > 60) goTo(current - 1);
    else goTo(current);
  };

  // Mouse events
  viewport.addEventListener('mousedown',  (e) => startDrag(e.clientX));
  window.addEventListener('mousemove',    (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup',      endDrag);

  // Touch events
  viewport.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchmove',  (e) => moveDrag(e.touches[0].clientX),  { passive: true });
  viewport.addEventListener('touchend',   endDrag);

  // Auto-advance every 5s
  let autoTimer = setInterval(() => {
    if (current >= maxIndex()) goTo(0);
    else goTo(current + 1);
  }, 5000);

  // Pause auto on interaction
  const pauseAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(() => { if (current >= maxIndex()) goTo(0); else goTo(current + 1); }, 5000); };
  prevBtn.addEventListener('click', pauseAuto);
  nextBtn.addEventListener('click', pauseAuto);
  viewport.addEventListener('mousedown', pauseAuto);

  // Rebuild on resize
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });

  // Init
  buildDots();
  updateUI();

}); // end DOMContentLoaded
