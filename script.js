// script.js - Enhanced functionality for Miss South Africa Disability website

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initAccessibilityControls();
  initNavigation();
  initCarousel();
  initSmoothScrolling();
  initAnimations();
  initFormValidation();
  initLazyLoading();
  initCountUpAnimation();
  initSkipLink();
});

// Initialize accessibility controls
function initAccessibilityControls() {
  // High contrast toggle
  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('click', function() {
      document.body.classList.toggle('high-contrast');
      const isHighContrast = document.body.classList.contains('high-contrast');
      localStorage.setItem('highContrast', isHighContrast);
      this.setAttribute('aria-pressed', isHighContrast);
    });

    // Load saved preference
    if (localStorage.getItem('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
      contrastToggle.setAttribute('aria-pressed', 'true');
    }
  }

  // Font size controls
  const baseFontSize = 16;
  const minFontSize = 12;
  const maxFontSize = 24;

  document.getElementById('font-increase')?.addEventListener('click', function() {
    adjustFontSize(1, minFontSize, maxFontSize);
  });

  document.getElementById('font-decrease')?.addEventListener('click', function() {
    adjustFontSize(-1, minFontSize, maxFontSize);
  });

  document.getElementById('font-reset')?.addEventListener('click', function() {
    document.documentElement.style.fontSize = baseFontSize + 'px';
    localStorage.removeItem('fontSize');
  });

  // Load saved font size
  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize + 'px';
  }
}

// Adjust font size function
function adjustFontSize(direction, min, max) {
  const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
  let newSize = currentSize + direction;

  if (newSize >= min && newSize <= max) {
    document.documentElement.style.fontSize = newSize + 'px';
    localStorage.setItem('fontSize', newSize);
  }
}

// Initialize navigation functionality
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky header on scroll
  function updateHeaderOnScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initial check and event listener
  updateHeaderOnScroll();
  window.addEventListener('scroll', throttle(updateHeaderOnScroll, 100));

  // Mobile navigation toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('active');
      document.body.style.overflow = expanded ? '': 'hidden';
    });

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Highlight active navigation link based on scroll position
  highlightActiveNavLink();
}

// Initialize carousel functionality
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.carousel-indicators button');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let currentSlide = 0;
  let autoAdvanceInterval;

  function showSlide(index) {
    // Handle wrap-around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Hide all slides and remove active status
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
      indicator.removeAttribute('aria-current');
    });

    // Show the selected slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    indicators[index].setAttribute('aria-current', 'true');

    currentSlide = index;

    // Announce slide change for screen readers
    announceSlideChange(slides[index]);
  }

  function announceSlideChange(slide) {
    const caption = slide.querySelector('.slide-caption h3')?.textContent || 'Slide';
    const liveRegion = document.getElementById('carousel-live-region') || createLiveRegion();
    liveRegion.textContent = `Now showing: ${caption}`;
  }

  function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('id', 'carousel-live-region');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('sr-only');
    carousel.appendChild(liveRegion);
    return liveRegion;
  }

  function startAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000); // Change slide every 6 seconds
  }

  function stopAutoAdvance() {
    clearInterval(autoAdvanceInterval);
  }

  // Event listeners for controls
  prevBtn?.addEventListener('click', () => {
    stopAutoAdvance();
    showSlide(currentSlide - 1);
    startAutoAdvance();
  });

  nextBtn?.addEventListener('click', () => {
    stopAutoAdvance();
    showSlide(currentSlide + 1);
    startAutoAdvance();
  });

  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoAdvance();
      showSlide(index);
      startAutoAdvance();
    });
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopAutoAdvance();
      showSlide(currentSlide - 1);
      startAutoAdvance();
    } else if (e.key === 'ArrowRight') {
      stopAutoAdvance();
      showSlide(currentSlide + 1);
      startAutoAdvance();
    }
  });

  // Pause auto-advance on hover/focus for better accessibility
  carousel.addEventListener('mouseenter',
    stopAutoAdvance);
  carousel.addEventListener('mouseleave',
    startAutoAdvance);
  carousel.addEventListener('focusin',
    stopAutoAdvance);
  carousel.addEventListener('focusout',
    startAutoAdvance);

  // Start auto-advance
  startAutoAdvance();
}

// Initialize smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate offset based on header height
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling (for deep linking)
        history.pushState(null, null, targetId);

        // Update active nav link
        highlightActiveNavLink();
      }
    });
  });
}

// Initialize animations
function initAnimations() {
  const animatedElements = document.querySelectorAll('.animate-in');

  if (animatedElements.length > 0 && !shouldReduceMotion()) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Apply animations immediately if reduced motion is preferred
    animatedElements.forEach(el => el.classList.add('animated'));
  }
}

// Initialize form validation
function initFormValidation() {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (isValidEmail(email)) {
      // Simulate successful submission
      showFormMessage(this, 'Thank you for subscribing to our newsletter!', 'success');
      emailInput.value = '';

      // Here you would typically send the data to your server
      console.log('Subscription email:', email);
    } else {
      showFormMessage(this, 'Please enter a valid email address.', 'error');
    }
  });
}

// Initialize lazy loading
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger loading
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Initialize count-up animation for stats
function initCountUpAnimation() {
  const statElements = document.querySelectorAll('.stat-number');
  if (statElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target, 0, parseInt(entry.target.dataset.count), 2000);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statElements.forEach(el => observer.observe(el));
}

// Initialize skip link functionality
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) return;

  skipLink.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
      targetElement.removeAttribute('tabindex');
    }
  });
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
  let currentSection = '';

  // Get current scroll position
  const scrollPosition = window.scrollY + headerHeight + 50;

  // Find current section
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  // Update active link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(currentSection)) {
      link.classList.add('active');
    }
  });
}

// Utility function to throttle events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Utility function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to show form messages
function showFormMessage(form, message, type) {
  // Remove any existing messages
  const existingMessage = form.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message element
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message--${type}`;
  messageEl.textContent = message;
  messageEl.setAttribute('role', 'alert');

  form.appendChild(messageEl);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

// Utility function to check if reduced motion is preferred
function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility function to animate values (for stats counter)
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}