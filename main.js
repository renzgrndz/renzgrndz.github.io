/* ============================================================
   PORTFOLIO — main.js
   Scroll animations, cursor, typing, nav, filter, form
   ============================================================ */

'use strict';

/* ============================================================
   UTILITY: Wait for DOM
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. SCROLL PROGRESS INDICATOR
  // ============================================================
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });


  // ============================================================
  // 2. CUSTOM CURSOR
  // ============================================================
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // Only run custom cursor on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top  = `${mouseY}px`;
    });

    // Smooth follower with lerp
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top  = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity         = '0';
      cursorFollower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity         = '1';
      cursorFollower.style.opacity = '1';
    });
  }


  // ============================================================
  // 3. NAVBAR — sticky scroll behaviour
  // ============================================================
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // init


  // ============================================================
  // 4. HAMBURGER MENU (mobile)
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on resize back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });


  // ============================================================
  // 5. TYPING ANIMATION (Hero tagline)
  // ============================================================
  const typedEl    = document.getElementById('typed-text');
  const phrases    = [
    'Data Engineer',
    'Cloud & ETL Developer',
    'Pipeline Architect',
    'AWS Specialist',
    'Databricks Engineer',
  ];
  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let typingTimer  = null;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
    } else {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
      // Pause at end of word
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }

    typingTimer = setTimeout(typeLoop, delay);
  }

  // Start typing after hero animations finish
  setTimeout(typeLoop, 1200);


  // ============================================================
  // 6. INTERSECTION OBSERVER — Scroll Reveal
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));


  // ============================================================
  // 7. PROJECT FILTERING
  // ============================================================
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Active state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add('visible');
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ============================================================
  // 8. BACK TO TOP
  // ============================================================
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ============================================================
  // 9. FOOTER — Current Year
  // ============================================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // ============================================================
  // 10. CONTACT FORM — Frontend validation & feedback
  // ============================================================
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Basic validation
      if (!name) {
        showFeedback('Please enter your name.', 'error');
        form.name.focus();
        return;
      }
      if (!email || !emailRx.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        form.email.focus();
        return;
      }
      if (!message || message.length < 10) {
        showFeedback('Message must be at least 10 characters.', 'error');
        form.message.focus();
        return;
      }

      // Simulate send (replace with Formspree / Netlify Forms endpoint)
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        showFeedback('// Message sent. I\'ll get back to you soon.', 'success');
      }, 1200);
    });
  }

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.style.color = type === 'success' ? '#aaa' : '#888';
    setTimeout(() => {
      feedback.textContent = '';
    }, 5000);
  }


  // ============================================================
  // 11. SMOOTH ACTIVE NAV LINK (highlight current section)
  // ============================================================
  const sections    = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          allNavLinks.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--white)';
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));


  // ============================================================
  // 12. SKILL TAG hover — subtle entrance stagger on observe
  // ============================================================
  const skillCategories = document.querySelectorAll('.skill-category');
  const tagObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.skill-tag');
          tags.forEach((tag, i) => {
            tag.style.transitionDelay = `${i * 0.04}s`;
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          });
          tagObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  skillCategories.forEach((cat) => {
    const tags = cat.querySelectorAll('.skill-tag');
    tags.forEach((tag) => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(8px)';
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s, color 0.2s, background 0.2s';
    });
    tagObserver.observe(cat);
  });

}); // end DOMContentLoaded
