/**
 * STACKLY PROPERTY INVESTMENT — CORE WEBSITE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Scroll Effect
  const header = document.querySelector('.header-site');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Drawer Navigation
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  if (hamburgerBtn && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      hamburgerBtn.classList.toggle('active', isOpen);
      if (mobileBackdrop) mobileBackdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close when clicking any nav link inside mobile drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        if (mobileBackdrop) mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Active Page Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. Social Media Links Redirection to 404.html (Section 6 & 18 Strict Requirement)
  document.querySelectorAll('.social-icon-btn, a[href*="facebook"], a[href*="twitter"], a[href*="instagram"], a[href*="linkedin"]').forEach(btn => {
    btn.setAttribute('href', '404.html');
  });

  // 5. FAQ Accordions
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other sibling items in same accordion
        const parentAccordion = item.closest('.accordion');
        if (parentAccordion) {
          parentAccordion.querySelectorAll('.accordion-item').forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
              const otherBody = other.querySelector('.accordion-body');
              if (otherBody) otherBody.style.maxHeight = null;
            }
          });
        }

        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first accordion by default if present
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    firstAccordion.classList.add('active');
    const firstBody = firstAccordion.querySelector('.accordion-body');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }

  // 6. Testimonial Carousel / Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevBtn = testimonialSlider.querySelector('.testimonial-prev');
    const nextBtn = testimonialSlider.querySelector('.testimonial-next');
    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });
    };

    if (slides.length > 0) {
      showSlide(currentIndex);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(currentIndex);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % slides.length;
          showSlide(currentIndex);
        });
      }
    }
  }

  // 7. Newsletter Form Handler


  // 8. Contact & Enquiry Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const fullName = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      const enquiryType = document.getElementById('contactEnquiryType');

      let isValid = true;

      // Validate Name
      if (!fullName || !fullName.value.trim()) {
        if (fullName) fullName.classList.add('is-invalid');
        isValid = false;
      } else {
        fullName.classList.remove('is-invalid');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        if (email) email.classList.add('is-invalid');
        isValid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      // Validate Message
      if (!message || message.value.trim().length < 10) {
        if (message) message.classList.add('is-invalid');
        isValid = false;
      } else {
        message.classList.remove('is-invalid');
      }

      if (!isValid) {
        showToast('Please fill out all required fields with valid details.', 'error');
        return;
      }

      // Prevent duplicate submissions and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">progress_activity</span> Submitting Enquiry...';
      }

      setTimeout(() => {
        // Save demo enquiry to localStorage for the Admin Dashboard to review!
        const demoEnquiries = getStoredData('demo_enquiries', []);
        demoEnquiries.unshift({
          id: 'ENQ-' + Math.floor(1000 + Math.random() * 9000),
          name: fullName.value.trim(),
          email: email.value.trim(),
          type: enquiryType ? enquiryType.value : 'General Investment',
          message: message.value.trim(),
          date: new Date().toISOString().split('T')[0],
          status: 'New'
        });
        setStoredData('demo_enquiries', demoEnquiries);
window.location.href='./404.html'
        showToast('Thank you! Your private investment enquiry has been recorded for demonstration.', 'success');
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Private Enquiry <span class="material-symbols-outlined">arrow_forward</span>';
        }
      }, 900);
    });
  }
});




document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const errorMessage = document.getElementById("newsletterError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      errorMessage.textContent = "Please enter your email address.";
      emailInput.classList.add("error");
      return;
    }

    if (!emailPattern.test(email)) {
      errorMessage.textContent = "Please enter a valid email address.";
      emailInput.classList.add("error");
      return;
    }

    // Valid email
    errorMessage.textContent = "";
    emailInput.classList.remove("error");

    window.location.href='./404.html'

    form.reset();
  });

  // Clear the error while the user types
  emailInput.addEventListener("input", () => {
    errorMessage.textContent = "";
    emailInput.classList.remove("error");
  });
});