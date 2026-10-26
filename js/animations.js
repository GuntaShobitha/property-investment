/**
 * STACKLY PROPERTY INVESTMENT — NORTH & CO ANIMATIONS ENGINE
 * Powered by GSAP & ScrollTrigger with resilient native fallback
 */

const StacklyAnimations = {
  hasReducedMotion: false,
  isGSAPLoaded: false,

  init() {
    this.hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isGSAPLoaded = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    if (this.hasReducedMotion) {
      this.disableAnimations();
      return;
    }

    if (this.isGSAPLoaded) {
      gsap.registerPlugin(ScrollTrigger);
      this.initGSAPAnimations();
    } else {
      this.initNativeScrollObserver();
    }

    this.initCounters();
  },

  disableAnimations() {
    document.querySelectorAll('.reveal-init, .reveal-left, .reveal-right, .reveal-mask, .reveal-scale').forEach(el => {
      el.classList.add('revealed');
    });
  },

  initGSAPAnimations() {
    // 1. Hero Editorial Entrance Animation
    const heroEyebrow = document.querySelector('.hero-content .eyebrow');
    const heroTitle = document.querySelector('.hero-title');
    const heroLead = document.querySelector('.hero-lead');
    const heroCtas = document.querySelector('.hero-cta-group');
    const heroImg = document.querySelector('.hero-main-img');
    const scrollCue = document.querySelector('.scroll-cue');

    if (heroTitle) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      if (heroEyebrow) {
        tl.fromTo(heroEyebrow, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1 });
      }

      tl.fromTo(heroTitle, { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, '-=0.5')
        .fromTo(heroLead, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.7')
        .fromTo(heroCtas, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6');

      if (heroImg) {
        tl.fromTo(heroImg, 
          { scale: 1.12, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, 
          { scale: 1, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power4.inOut' }, 
          '-=1.4'
        );
      }

      if (scrollCue) {
        tl.fromTo(scrollCue, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }
    }

    // 2. Section Headers & Text Reveals
    gsap.utils.toArray('.reveal-init').forEach(el => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 3. Staggered Property & Feature Grids (North & Co Card Stagger)
    const cardGrids = document.querySelectorAll('.stagger-grid');
    cardGrids.forEach(grid => {
      const items = grid.children;
      gsap.fromTo(items,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 4. Parallax Background & Architectural Images
    gsap.utils.toArray('.parallax-image').forEach(img => {
      gsap.to(img, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });

    // 5. Image Mask Reveals
    gsap.utils.toArray('.reveal-mask').forEach(mask => {
      gsap.fromTo(mask,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.3,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: mask,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  },

  // Resilient Native Fallback if GSAP is unavailable
  initNativeScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-init, .reveal-left, .reveal-right, .reveal-mask, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  },

  // Numerical Counter Animation
  initCounters() {
    const counterElements = document.querySelectorAll('.counter-val');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 2200;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = target * easeProgress;

            el.textContent = `${prefix}${currentVal.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            })}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
              })}${suffix}`;
            }
          };

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    counterElements.forEach(el => counterObserver.observe(el));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StacklyAnimations.init();
});
