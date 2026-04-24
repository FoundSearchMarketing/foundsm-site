/**
 * Found Search Marketing - Main JavaScript
 * Vanilla JS | No dependencies | < 10KB
 * Handles: animations, navigation, interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================
  // 1. TYPEWRITER SEARCH BAR (Homepage)
  // Cycles through search queries with typing + erase effect
  // =========================================================
  function initTypewriter() {
    const el = document.querySelector('#hero-typewriter');
    if (!el) return;

    const queries = [
      'What does AI mean for performance media?',
      'What are industry benchmarks for CVR, CPL, close rates etc?',
      'How to overcome AI Overviews and keep traffic high via SERPs',
      'Should we use Target CPA or Target ROAS and what are the trade-offs?',
      'How do we get more leads this month?'
    ];

    let queryIndex = 0;
    let charIndex = 0;
    let isErasing = false;
    const typeSpeed = 60;
    const eraseSpeed = 35;
    const pauseAfterType = 2000;
    const pauseBetween = 400;

    function tick() {
      const current = queries[queryIndex];

      if (!isErasing) {
        // Typing forward
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          // Finished typing, pause then erase
          isErasing = true;
          setTimeout(tick, pauseAfterType);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        // Erasing
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished erasing, move to next query
          isErasing = false;
          queryIndex = (queryIndex + 1) % queries.length;
          // Fade transition via opacity
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.opacity = '1';
            setTimeout(tick, pauseBetween);
          }, 300);
          return;
        }
        setTimeout(tick, eraseSpeed);
      }
    }

    // Set transition for opacity fades
    el.style.transition = 'opacity 0.6s ease-out';
    el.style.opacity = '1';

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
      let i = 0;
      setInterval(() => {
        el.textContent = queries[i % queries.length];
        i++;
      }, 4000);
      return;
    }

    tick();
  }

  // =========================================================
  // 2. COUNT-UP STATS (Homepage)
  // Animate numbers from 0 to target using rAF
  // =========================================================
  function initCountUp() {
    const stats = document.querySelectorAll('.stats__item[data-target]');
    if (!stats.length) return;

    const duration = 2000; // ms

    function animateCount(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const valueEl = el.querySelector('.stats__value');
      if (!valueEl) return;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        valueEl.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      if (prefersReducedMotion) {
        valueEl.textContent = prefix + target.toLocaleString() + suffix;
        return;
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target); // Only trigger once
        }
      });
    }, { threshold: 0.3 });

    stats.forEach(stat => observer.observe(stat));
  }

  // =========================================================
  // 3. LOGO MARQUEE (Homepage)
  // CSS-driven infinite scroll, pause on hover
  // =========================================================
  function initMarquee() {
    const track = document.querySelector('.logo-marquee__scroll');
    if (!track) return;

    // Pause on hover
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  // =========================================================
  // 4. ACCORDION (Our Approach page)
  // Expand/collapse with chevron rotation
  // =========================================================
  function initAccordion() {
    const container = document.querySelector('.accordion');
    if (!container) return;

    // Event delegation on the accordion container
    container.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion-item__trigger');
      if (!trigger) return;

      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-item__content');
      const chevron = trigger.querySelector('.accordion-item__icon');
      const isOpen = item.classList.contains('is-open');

      // Close all others (single-open mode)
      if (container.hasAttribute('data-single-open')) {
        container.querySelectorAll('.accordion-item.is-open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            const c = openItem.querySelector('.accordion-item__content');
            const ch = openItem.querySelector('.accordion-item__icon');
            if (c) c.style.maxHeight = null;
            if (ch) ch.style.transform = '';
          }
        });
      }

      // Toggle current
      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = null;
        if (chevron) chevron.style.transform = '';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // =========================================================
  // 5. TAB SWITCHING (Homepage)
  // Show/hide panels with aria support
  // =========================================================
  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    if (!tabContainers.length) return;

    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('[role="tab"]');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const panelId = tab.getAttribute('aria-controls');

          // Deactivate all tabs
          tabs.forEach(t => {
            t.classList.remove('tabs__tab--active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
          });

          // Deactivate all panels
          container.parentElement.querySelectorAll('[role="tabpanel"]').forEach(p => {
            p.classList.remove('tabs__panel--active');
            p.hidden = true;
          });

          // Activate clicked tab
          tab.classList.add('tabs__tab--active');
          tab.setAttribute('aria-selected', 'true');
          tab.removeAttribute('tabindex');

          // Activate target panel
          const panel = document.getElementById(panelId);
          if (panel) {
            panel.classList.add('tabs__panel--active');
            panel.hidden = false;
          }
        });
      });
    });
  }

  // =========================================================
  // 6. FADE-IN-UP ON SCROLL (All pages)
  // IntersectionObserver with stagger support
  // =========================================================
  function initFadeInUp() {
    const elements = document.querySelectorAll('.fade-in-up');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // Check for staggered children
        const staggerChildren = el.querySelectorAll('.stagger');
        if (staggerChildren.length) {
          staggerChildren.forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add('is-visible');
          });
        }

        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }

  // Sticky nav + mobile menu behavior moved to Header.astro inline script.

  // =========================================================
  // 9. BLOG CATEGORY FILTERING (Insights page)
  // Filter cards by data-category
  // =========================================================
  function initBlogFilter() {
    const filterContainer = document.querySelector('.blog-filters');
    if (!filterContainer) return;

    // Event delegation for filter buttons
    filterContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.blog-filters__btn');
      if (!pill) return;

      const category = pill.getAttribute('data-filter');

      // Update active button
      filterContainer.querySelectorAll('.blog-filters__btn').forEach(p => {
        p.classList.remove('blog-filters__btn--active');
      });
      pill.classList.add('blog-filters__btn--active');

      // Filter cards
      const cards = document.querySelectorAll('.blog-card');
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const show = category === 'all' || cardCategory === category;

        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          // Hide after transition
          setTimeout(() => {
            if (!card.style.opacity || card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  }

  // =========================================================
  // 10. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector('.site-header')?.offsetHeight || 0;

      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

      // Offset for sticky nav
      if (navHeight) {
        window.scrollBy({ top: -navHeight, behavior: 'instant' });
      }

      // Update URL without jumping
      history.pushState(null, '', id);
    });
  }

  // =========================================================
  // 11. HERO TEXT STAGGER ANIMATION ON PAGE LOAD
  // Elements with .hero-stagger get delayed fade-in-up
  // =========================================================
  function initHeroStagger() {
    const elements = document.querySelectorAll('.hero-stagger');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    elements.forEach((el, i) => {
      // Stagger: 0ms, 200ms, 400ms, 600ms, 800ms, 1000ms
      const delay = i * 200;
      el.style.transitionDelay = `${delay}ms`;

      // Trigger on next frame to allow CSS initial state to apply
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
        });
      });
    });
  }

  // =========================================================
  // INITIALIZE ALL MODULES
  // =========================================================
  initSmoothScroll();
  initHeroStagger();
  initTypewriter();
  initCountUp();
  initMarquee();
  initAccordion();
  initTabs();
  initFadeInUp();
  initBlogFilter();
});
