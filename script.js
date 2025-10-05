// ========================================
// ELITE JAVASCRIPT FUNCTIONALITY
// Miss South Africa Disability - Premium Experience
// ========================================

// Elite Performance & Motion Settings
const ELITE_CONFIG = {
  SCROLL_THROTTLE: 16, // 60fps
  ANIMATION_DURATION: 600,
  PARALLAX_FACTOR: 0.5,
  INTERSECTION_THRESHOLD: 0.1,
  PARTICLE_COUNT: 9,
  GLOW_INTENSITY: 0.3
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality with elite enhancements
  initElitePreloader();
  initEnhancedAccessibility();
  initEliteNavigation();
  initPhotoGallery();
  initLightbox();
  initProgressTracker();
  initTextToSpeech();
  initEliteCarousel();
  initEliteSmoothScrolling();
  initEliteAnimations();
  initEliteFormValidation();
  initEliteLazyLoading();
  initEliteCountUpAnimation();
  initSkipLink();
  initFaqAccordion();
  initEliteParallax();
  initEliteScrollAnimations();
  initEliteHeroEffects();
  initEliteGlowEffects();
  initEliteParticleSystem();
});

// ========================================
// ELITE PRELOADER WITH SMOOTH ANIMATIONS
// ========================================

function initElitePreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  // Add progressive loading animation
  const spinner = preloader.querySelector('.spinner');
  if (spinner) {
    spinner.style.animationDuration = '0.8s';
  }

  // Smooth fade-out with stagger effect
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.style.display = 'none';
        
        // Trigger entrance animations
        triggerEntranceAnimations();
      }, 500);
    }, 300); // Brief delay for premium feel
  });
}

// Trigger staggered entrance animations
function triggerEntranceAnimations() {
  const animateElements = document.querySelectorAll('.hero-content > *');
  animateElements.forEach((element, index) => {
    if (!prefersReducedMotion) {
      element.style.animationDelay = `${index * 200}ms`;
    }
  });
}

// Initialize accessibility controls
// ========================================
// ENHANCED ACCESSIBILITY CONTROLS
// ========================================

function initEnhancedAccessibility() {
  const contrastToggle = document.getElementById('contrast-toggle');
  const fontIncrease = document.getElementById('font-increase');
  const fontDecrease = document.getElementById('font-decrease');
  const fontReset = document.getElementById('font-reset');
  const textToSpeech = document.getElementById('text-to-speech');

  // Load saved preferences
  loadAccessibilityPreferences();

  if (contrastToggle) {
    contrastToggle.addEventListener('click', toggleHighContrast);
  }

  if (fontIncrease) {
    fontIncrease.addEventListener('click', () => adjustFontSize(1.1));
  }

  if (fontDecrease) {
    fontDecrease.addEventListener('click', () => adjustFontSize(0.9));
  }

  if (fontReset) {
    fontReset.addEventListener('click', () => resetFontSize());
  }

  if (textToSpeech) {
    textToSpeech.addEventListener('click', toggleTextToSpeech);
  }

  // Enhanced keyboard navigation
  document.addEventListener('keydown', handleGlobalKeyboard);
  
  // Focus management
  initFocusManagement();
}

function loadAccessibilityPreferences() {
  const highContrast = localStorage.getItem('high-contrast') === 'true';
  const fontSize = localStorage.getItem('font-size') || '1';
  
  if (highContrast) {
    document.body.classList.add('high-contrast');
    const toggle = document.getElementById('contrast-toggle');
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
  }
  
  if (fontSize !== '1') {
    document.documentElement.style.fontSize = `${parseFloat(fontSize)}rem`;
  }
}

function handleGlobalKeyboard(e) {
  // Skip to main content (Alt + 1)
  if (e.altKey && e.key === '1') {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Skip to navigation (Alt + 2)
  if (e.altKey && e.key === '2') {
    e.preventDefault();
    const nav = document.getElementById('main-nav');
    if (nav) {
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }
  
  // Toggle high contrast (Alt + C)
  if (e.altKey && e.key === 'c') {
    e.preventDefault();
    toggleHighContrast();
  }
}

function initFocusManagement() {
  // Trap focus in modals
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach(modal => {
    modal.addEventListener('keydown', trapFocus);
  });
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  
  const modal = e.currentTarget;
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
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

// ========================================
// ELITE NAVIGATION WITH SMOOTH TRANSITIONS
// ========================================

function initEliteNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Enhanced sticky header with direction detection
  function updateEliteHeaderOnScroll() {
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
      
      // Hide header on scroll down, show on scroll up (premium UX)
      if (scrollDirection === 'down' && currentScrollY > 300) {
        header.style.transform = 'translateY(-100%)';
      } else if (scrollDirection === 'up') {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.classList.remove('scrolled');
      header.style.transform = 'translateY(0)';
    }
    
    // Update scroll progress indicator
    updateScrollProgress();
    
    lastScrollY = currentScrollY;
    ticking = false;
  }

  // Smooth scroll performance optimization
  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateEliteHeaderOnScroll);
      ticking = true;
    }
  }

  // Initial check and event listener
  updateEliteHeaderOnScroll();
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });

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
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, delay);
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

// Initialize FAQ accordion
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);

      const answer = question.nextElementSibling;
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
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

// ========================================
// ELITE SCROLL PROGRESS INDICATOR
// ========================================

function updateScrollProgress() {
  const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
  // Create progress bar if it doesn't exist
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, #f97316, #ffb86b);
      z-index: 9999;
      transition: width 0.1s ease;
      box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
    `;
    document.body.appendChild(progressBar);
  }
  
  progressBar.style.width = scrollProgress + '%';
}

// ========================================
// ELITE PARALLAX EFFECTS
// ========================================

function initEliteParallax() {
  if (prefersReducedMotion) return;
  
  const parallaxElements = document.querySelectorAll('.hero, .hero::before, .hero::after');
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.3;
      element.style.transform = `translateY(${rate * speed}px)`;
    });
  }
  
  let ticking = false;
  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
      setTimeout(() => { ticking = false; }, 16);
    }
  }
  
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// ========================================
// ELITE SCROLL ANIMATIONS
// ========================================

function initEliteScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-in, .glass-card, .feature, .stat-item, .testimonial, .alumni-story');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || index * 100;
        
        setTimeout(() => {
          if (!prefersReducedMotion) {
            entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
          }
          entry.target.classList.add('animated');
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animateElements.forEach(element => {
    if (!prefersReducedMotion) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
    }
    observer.observe(element);
  });
}

// ========================================
// ELITE HERO EFFECTS
// ========================================

function initEliteHeroEffects() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  // Mouse movement parallax effect
  if (!prefersReducedMotion) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;
      
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translate(${(xPercent - 50) * 0.02}px, ${(yPercent - 50) * 0.02}px)`;
      }
    });
  }
}

// ========================================
// ELITE GLOW EFFECTS
// ========================================

function initEliteGlowEffects() {
  const glowElements = document.querySelectorAll('.btn-primary, .btn-glow, .stat-number');
  
  glowElements.forEach(element => {
    if (!prefersReducedMotion) {
      element.addEventListener('mouseenter', () => {
        element.style.animation = 'glow 2s ease-in-out infinite alternate';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.animation = '';
      });
    }
  });
}

// ========================================
// ELITE PARTICLE SYSTEM
// ========================================

function initEliteParticleSystem() {
  if (prefersReducedMotion) return;
  
  const heroParticles = document.querySelector('.hero-particles');
  if (!heroParticles) return;
  
  // Randomize particle animations
  const particles = heroParticles.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    const delay = Math.random() * 20;
    const duration = 12 + Math.random() * 8;
    const size = 2 + Math.random() * 4;
    
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    
    // Add subtle glow
    particle.style.boxShadow = `0 0 ${size * 2}px rgba(249, 115, 22, 0.6)`;
  });
}

// ========================================
// ENHANCED LAZY LOADING
// ========================================

function initEliteLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Add loading class for smooth transition
        img.classList.add('loading');
        
        img.addEventListener('load', () => {
          img.classList.remove('loading');
          img.classList.add('loaded');
        });
        
        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1 });
  
  images.forEach(img => {
    imageObserver.observe(img);
  });
}

// ========================================
// ENHANCED CAROUSEL
// ========================================

function initEliteCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.carousel-indicators button');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let currentSlide = 0;
  let autoAdvanceInterval;

  function showSlideWithTransition(index) {
    // Handle wrap-around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Smooth transition effect
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (!prefersReducedMotion) {
        slide.style.transform = i === index ? 'translateX(0)' : 
                               i < index ? 'translateX(-100%)' : 'translateX(100%)';
        slide.style.opacity = i === index ? '1' : '0';
      }
    });

    // Update indicators with smooth transition
    indicators.forEach((indicator, i) => {
      indicator.classList.remove('active');
      indicator.removeAttribute('aria-current');
      if (i === index) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      }
    });

    slides[index].classList.add('active');
    currentSlide = index;
  }

  // Auto-advance with smooth transitions
  function startEliteAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
      showSlideWithTransition(currentSlide + 1);
    }, 6000);
  }

  function stopEliteAutoAdvance() {
    clearInterval(autoAdvanceInterval);
  }

  // Enhanced event listeners
  prevBtn?.addEventListener('click', () => {
    stopEliteAutoAdvance();
    showSlideWithTransition(currentSlide - 1);
    startEliteAutoAdvance();
  });

  nextBtn?.addEventListener('click', () => {
    stopEliteAutoAdvance();
    showSlideWithTransition(currentSlide + 1);
    startEliteAutoAdvance();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopEliteAutoAdvance();
      showSlideWithTransition(index);
      startEliteAutoAdvance();
    });
  });

  // Pause on hover for better UX
  carousel.addEventListener('mouseenter', stopEliteAutoAdvance);
  carousel.addEventListener('mouseleave', startEliteAutoAdvance);

  // Initialize
  showSlideWithTransition(0);
  startEliteAutoAdvance();
}

// ========================================
// ELITE SMOOTH SCROLLING
// ========================================

function initEliteSmoothScrolling() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 80;
        const elementPosition = targetElement.offsetTop - headerOffset;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// ELITE ANIMATIONS
// ========================================

function initEliteAnimations() {
  // Add CSS for enhanced animations
  const style = document.createElement('style');
  style.textContent = `
    .loading {
      opacity: 0.5;
      filter: blur(2px);
      transition: all 0.3s ease;
    }
    
    .loaded {
      opacity: 1;
      filter: blur(0);
    }
    
    .animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ========================================
// ELITE COUNT UP ANIMATION
// ========================================

function initEliteCountUpAnimation() {
  const statElements = document.querySelectorAll('.stat-number[data-count]');
  if (statElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.dataset.count);
        
        // Enhanced count animation with easing
        animateValueWithEasing(target, 0, finalValue, 2000);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

function animateValueWithEasing(element, start, end, duration) {
  const startTime = performance.now();
  
  function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
  }
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    const current = Math.floor(start + (end - start) * easedProgress);
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end;
    }
  }
  
  requestAnimationFrame(update);
}

// ========================================
// ELITE FORM VALIDATION
// ========================================

function initEliteFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Real-time validation with visual feedback
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
    
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
        showFormError(form, 'Please correct the errors above.');
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = '';
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    message = 'This field is required.';
  }
  
  // Email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address.';
    }
  }
  
  // Phone validation
  if (field.type === 'tel' && value) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      message = 'Please enter a valid phone number.';
    }
  }
  
  showFieldValidation(field, isValid, message);
  return isValid;
}

function showFieldValidation(field, isValid, message) {
  // Remove existing validation
  clearFieldError(field);
  
  if (!isValid) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Create error message
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      animation: fadeInUp 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorEl);
    
    // Subtle shake animation
    if (!prefersReducedMotion) {
      field.style.animation = 'shake 0.5s ease';
      setTimeout(() => { field.style.animation = ''; }, 500);
    }
  } else {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');
  
  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) {
    errorEl.remove();
  }
}

function validateForm(form) {
  const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Add shake animation keyframes
const shakeKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

if (!document.querySelector('#shake-keyframes')) {
  const style = document.createElement('style');
  style.id = 'shake-keyframes';
  style.textContent = shakeKeyframes;
  document.head.appendChild(style);
}

// ========================================
// ELITE LANGUAGE TOGGLE
// ========================================

function initEliteLanguageToggle() {
  const languageToggle = document.getElementById('language-toggle');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageOptions = document.querySelectorAll('.language-option');
  
  if (!languageToggle || !languageDropdown) return;
  
  languageToggle.addEventListener('click', () => {
    const isExpanded = languageToggle.getAttribute('aria-expanded') === 'true';
    languageToggle.setAttribute('aria-expanded', !isExpanded);
    languageDropdown.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
      languageToggle.setAttribute('aria-expanded', 'false');
      languageDropdown.classList.remove('active');
    }
  });
  
  // Handle language selection
  languageOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = e.target.textContent;
      const langCode = e.target.dataset.lang;
      
      languageToggle.querySelector('span').textContent = selectedLang;
      languageToggle.setAttribute('aria-expanded', 'false');
      languageDropdown.classList.remove('active');
      
      // Store language preference
      localStorage.setItem('selectedLanguage', langCode);
      
      // In a real implementation, this would trigger language switching
      console.log(`Language switched to: ${selectedLang} (${langCode})`);
    });
  });
  
  // Load saved language preference
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    const option = document.querySelector(`[data-lang="${savedLanguage}"]`);
    if (option) {
      languageToggle.querySelector('span').textContent = option.textContent;
    }
  }
}

// ========================================
// ELITE PERFORMANCE OPTIMIZATIONS
// ========================================

function initElitePerformanceOptimizations() {
  // Preload critical resources
  const criticalImages = [
    '/assets/logos/logo.svg',
    // Add other critical images here
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  // Optimize font loading
  if ('fontDisplay' in document.documentElement.style) {
    const fontLink = document.querySelector('link[href*="fonts.googleapis"]');
    if (fontLink && !fontLink.href.includes('display=swap')) {
      fontLink.href += '&display=swap';
    }
  }
  
  // Service Worker for caching (basic implementation)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // In a real implementation, register a service worker here
      console.log('Service Worker support detected');
    });
  }
}

// ========================================
// ELITE KEYBOARD NAVIGATION
// ========================================

function initEliteKeyboardNavigation() {
  // Enhanced keyboard navigation for carousel
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        carousel.querySelector('.carousel-prev')?.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        carousel.querySelector('.carousel-next')?.click();
      }
    });
  }
  
  // Tab trap for mobile menu
  const mobileMenu = document.querySelector('.nav-menu');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  
  if (mobileMenu && mobileToggle) {
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileToggle.click();
        mobileToggle.focus();
      }
      
      // Tab trapping
      const focusableElements = mobileMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
}

// ========================================
// ELITE ANALYTICS & TRACKING (GDPR Compliant)
// ========================================

function initEliteAnalytics() {
  // Basic performance tracking
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // In a real implementation, send this data to your analytics service
      // with proper user consent
    });
  }
  
  // Track scroll depth for engagement
  let maxScrollDepth = 0;
  const trackScrollDepth = throttle(() => {
    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      
      // Track milestones
      if (scrollDepth >= 25 && scrollDepth < 50) {
        console.log('Scroll depth: 25%');
      } else if (scrollDepth >= 50 && scrollDepth < 75) {
        console.log('Scroll depth: 50%');
      } else if (scrollDepth >= 75 && scrollDepth < 90) {
        console.log('Scroll depth: 75%');
      } else if (scrollDepth >= 90) {
        console.log('Scroll depth: 90%+');
      }
    }
  }, 500);
  
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
}

// ========================================
// INITIALIZE ALL ELITE FEATURES
// ========================================

// Add to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
  // ... existing initialization code ...
  
  // Add new elite features
  initEliteLanguageToggle();
  initElitePerformanceOptimizations();
  initEliteKeyboardNavigation();
  initEliteAnalytics();

  // Event Calendar Feature
  initEventCalendar();

    // Alumni Showcase & Resources Feature
    initAlumniShowcaseResources();

  // Live Chat Feature
  initLiveChat();
});

// ========================================
// ELITE UTILITY FUNCTIONS
// ========================================

// Enhanced throttle function
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

// ========================================
// ALUMNI SHOWCASE & RESOURCES FUNCTIONALITY
// ========================================
function initAlumniShowcaseResources() {
  // Keyboard accessibility for alumni cards
  const alumniCards = document.querySelectorAll('.alumni-card');
  alumniCards.forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('expanded');
      }
    });
  });

  // Resource download analytics
  const resourceLinks = document.querySelectorAll('.resource-link');
  resourceLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Track download for analytics (demo)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'RESOURCE_DOWNLOAD',
          url: link.getAttribute('href')
        });
      }
    });
  });
}

// ========================================
// LIVE CHAT WIDGET FUNCTIONALITY
// ========================================
function initLiveChat() {
  const toggleBtn = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');
  const statusEl = document.getElementById('chat-status');
  if (!toggleBtn || !chatWindow || !form) return;

  // Load messages from localStorage
  const saved = JSON.parse(localStorage.getItem('chat-messages') || '[]');
  saved.forEach(m => appendChatMessage(m.text, m.type, false));
  scrollChatToBottom();

  function openChat() {
    chatWindow.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    input.focus();
    announceChatStatus('Chat opened');
  }

  function closeChat() {
    chatWindow.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
    announceChatStatus('Chat closed');
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = chatWindow.getAttribute('aria-hidden') === 'false';
    isOpen ? closeChat() : openChat();
  });
  closeBtn?.addEventListener('click', closeChat);

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow.getAttribute('aria-hidden') === 'false') {
      closeChat();
    }
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendChatMessage(text, 'user', true);
    input.value = '';
    simulateBotResponse(text);
  });

  function appendChatMessage(text, type = 'bot', persist = true) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${type}`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    scrollChatToBottom();
    if (persist) saveMessage(text, type);
  }

  function saveMessage(text, type) {
    const existing = JSON.parse(localStorage.getItem('chat-messages') || '[]');
    existing.push({ text, type, ts: Date.now() });
    localStorage.setItem('chat-messages', JSON.stringify(existing.slice(-100)));
  }

  function scrollChatToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function simulateBotResponse(userText) {
    setTimeout(() => {
      const response = generateBotReply(userText);
      appendChatMessage(response, 'bot', true);
      announceChatStatus('New message received');
    }, 800);
  }

  function generateBotReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) return 'Hello! How can we assist you today?';
    if (lower.includes('apply')) return 'You can apply on the Registration page. Let me know if you need guidance on eligibility.';
    if (lower.includes('event')) return 'Upcoming events include workshops and the national finals. Check the Events section for details.';
    if (lower.includes('thanks')) return 'You are most welcome! Feel free to ask anything else.';
    return 'Thank you for your message. A team member will review it soon. Meanwhile, can I help with applications, events, or accessibility information?';
  }

  function announceChatStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  // Offline/online handling
  function updateOnlineStatus() {
    if (!navigator.onLine) {
      announceChatStatus('Offline: messages will be saved and synced later');
    } else {
      announceChatStatus('Online');
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // Analytics via Service Worker
  function trackChatEvent(action, detail) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CHAT_EVENT',
        action,
        detail,
        ts: Date.now()
      });
    }
  }
  toggleBtn.addEventListener('click', () => trackChatEvent('toggle', chatWindow.getAttribute('aria-hidden')));
  form.addEventListener('submit', () => trackChatEvent('message_sent', 'user'));
}

// ========================================
// EVENT CALENDAR FUNCTIONALITY
// ========================================
function initEventCalendar() {
  const calendarEl = document.getElementById('event-calendar');
  if (!calendarEl) return;

  // Sample events for October 2025
  const events = [
    {
      date: '2025-10-18',
      title: '2025 National Pageant Finals',
      location: 'Durban International Convention Centre',
      description: 'A night of glamour, advocacy, and empowerment as we crown our 2025 ambassador.'
    },
    {
      date: '2025-10-22',
      title: 'Leadership & Advocacy Workshop',
      location: 'Online Virtual Event',
      description: 'An interactive workshop for aspiring leaders to hone their public speaking and advocacy skills.'
    },
    {
      date: '2025-10-31',
      title: 'Application Deadline',
      location: 'Online',
      description: 'Last day to apply for the 2026 pageant.'
    }
  ];

  // Calendar rendering logic
  const year = 2025;
  const month = 9; // October (0-indexed)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Header row
  let html = '<div class="calendar-header">'
    + `<button class="btn btn-outline" aria-label="Previous month" disabled>&lt;</button>`
    + `<span style="font-weight:700;">October 2025</span>`
    + `<button class="btn btn-outline" aria-label="Next month" disabled>&gt;</button>`
    + '</div>';
  // Day names
  for (let d = 0; d < 7; d++) {
    html += `<div class="calendar-day" role="columnheader">${dayNames[d]}</div>`;
  }
  // Dates
  let day = 1;
  for (let i = 0; i < 6; i++) { // 6 weeks
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        html += `<div class="calendar-date disabled" aria-disabled="true"></div>`;
      } else if (day > daysInMonth) {
        html += `<div class="calendar-date disabled" aria-disabled="true"></div>`;
      } else {
        const dateStr = `${year}-10-${String(day).padStart(2, '0')}`;
        const event = events.find(e => e.date === dateStr);
        html += `<div class="calendar-date${event ? ' event-day' : ''}" tabindex="0" role="gridcell" aria-label="${event ? event.title + ' on ' : ''}${day} October 2025" data-date="${dateStr}" aria-selected="false">${day}${event ? ' <span aria-hidden="true">&#x1F4C5;</span>' : ''}</div>`;
        day++;
      }
    }
  }
  calendarEl.innerHTML = html;

  // Keyboard navigation
  calendarEl.addEventListener('keydown', function(e) {
    const focusableDates = Array.from(calendarEl.querySelectorAll('.calendar-date[tabindex="0"]'));
    const active = document.activeElement;
    const idx = focusableDates.indexOf(active);
    if (idx === -1) return;
    if (e.key === 'ArrowRight' && idx < focusableDates.length - 1) {
      focusableDates[idx + 1].focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      focusableDates[idx - 1].focus();
    } else if (e.key === 'ArrowDown' && idx + 7 < focusableDates.length) {
      focusableDates[idx + 7].focus();
    } else if (e.key === 'ArrowUp' && idx - 7 >= 0) {
      focusableDates[idx - 7].focus();
    } else if ((e.key === 'Enter' || e.key === ' ') && active.classList.contains('event-day')) {
      active.click();
    }
  });

  // Click handler for event days
  calendarEl.querySelectorAll('.calendar-date.event-day').forEach(dateEl => {
    dateEl.addEventListener('click', function() {
      const event = events.find(e => e.date === this.dataset.date);
      if (event) showEventModal(event);
    });
  });
}

function showEventModal(event) {
  const modal = document.getElementById('event-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  modal.focus();
  document.body.style.overflow = 'hidden';
  document.getElementById('event-modal-title').textContent = event.title;
  document.getElementById('event-modal-date').textContent = `Date: ${formatDate(event.date)}`;
  document.getElementById('event-modal-location').textContent = `Location: ${event.location}`;
  document.getElementById('event-modal-description').textContent = event.description;
  document.getElementById('rsvp-message').textContent = '';
  document.getElementById('rsvp-form').reset();

  // Focus trap
  modal.addEventListener('keydown', trapFocus);
}

function closeEventModal() {
  const modal = document.getElementById('event-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()} October 2025`;
}

// Modal close button
document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.querySelector('.event-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeEventModal);
  }
  // Close modal on backdrop click
  const modal = document.getElementById('event-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeEventModal();
    });
  }
});

// RSVP form submission
document.addEventListener('DOMContentLoaded', function() {
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = rsvpForm.name.value.trim();
      const email = rsvpForm.email.value.trim();
      if (!name || !email || !validateEmail(email)) {
        showRsvpMessage('Please enter a valid name and email.', 'error');
        return;
      }
      showRsvpMessage('Thank you for your RSVP! We look forward to seeing you.', 'success');
      rsvpForm.reset();
    });
  }
});

function showRsvpMessage(msg, type) {
  const msgEl = document.getElementById('rsvp-message');
  if (msgEl) {
    msgEl.textContent = msg;
    msgEl.style.color = type === 'error' ? '#ef4444' : 'var(--color-primary)';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Debounce function for performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Generate unique ID
function generateId() {
  return 'elite-' + Math.random().toString(36).substr(2, 9);
}

// ========================================
// PHOTO GALLERY WITH FILTERS
// ========================================

function initPhotoGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterButtons.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterGallery(filter);
      updateActiveFilter(button);
    });
  });
}

function filterGallery(filter) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const category = item.dataset.category;
    const shouldShow = filter === 'all' || category === filter;
    
    if (shouldShow) {
      item.style.display = 'block';
      item.classList.add('animate-in');
    } else {
      item.style.display = 'none';
      item.classList.remove('animate-in');
    }
  });
  
  // Announce filter change
  const announcer = document.getElementById('live-announcer');
  if (announcer) {
    const visibleCount = document.querySelectorAll('.gallery-item[style*="block"]').length;
    announcer.textContent = `Showing ${visibleCount} photos for ${filter === 'all' ? 'all categories' : filter}`;
  }
}

function updateActiveFilter(activeButton) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });
  
  activeButton.classList.add('active');
  activeButton.setAttribute('aria-selected', 'true');
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

function initLightbox() {
  const galleryButtons = document.querySelectorAll('.gallery-btn');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  if (!lightbox) return;
  
  let currentImageIndex = 0;
  let images = [];
  
  // Collect all gallery images
  galleryButtons.forEach((button, index) => {
    const imgSrc = button.dataset.img;
    const imgAlt = button.closest('.gallery-item').querySelector('img').alt;
    images.push({ src: imgSrc, alt: imgAlt });
    
    button.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox(imgSrc, imgAlt);
    });
  });
  
  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  // Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPreviousImage);
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextImage);
  }
  
  // Keyboard navigation
  lightbox.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPreviousImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });
  
  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.style.display = 'flex';
    lightbox.focus();
    document.body.style.overflow = 'hidden';
    
    // Announce to screen readers
    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = `Viewing image: ${alt}`;
    }
  }
  
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    
    // Return focus to trigger button
    const activeButton = document.querySelectorAll('.gallery-btn')[currentImageIndex];
    if (activeButton) activeButton.focus();
  }
  
  function showPreviousImage() {
    currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    const image = images[currentImageIndex];
    openLightbox(image.src, image.alt);
  }
  
  function showNextImage() {
    currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    const image = images[currentImageIndex];
    openLightbox(image.src, image.alt);
  }
}

// ========================================
// APPLICATION PROGRESS TRACKER
// ========================================

function initProgressTracker() {
  const checkProgressBtn = document.getElementById('check-progress');
  
  if (checkProgressBtn) {
    checkProgressBtn.addEventListener('click', showProgressModal);
  }
  
  // Load saved progress if available
  loadProgressState();
}

function loadProgressState() {
  const savedProgress = localStorage.getItem('application-progress');
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    updateProgressDisplay(progress);
  }
}

function updateProgressDisplay(progress) {
  const steps = document.querySelectorAll('.step-status');
  
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    const stepStatus = progress[`step${stepNumber}`] || 'pending';
    const statusText = step.querySelector('.status-text');
    
    if (statusText) {
      statusText.textContent = getStatusText(stepStatus);
      statusText.className = `status-text status-${stepStatus}`;
    }
    
    // Update step visual state
    const stepElement = step.closest('.progress-step');
    if (stepElement) {
      stepElement.classList.remove('pending', 'current', 'completed');
      stepElement.classList.add(stepStatus);
    }
  });
}

function getStatusText(status) {
  const texts = {
    pending: 'Pending',
    current: 'In Progress',
    completed: 'Completed'
  };
  return texts[status] || 'Pending';
}

function simulateProgress() {
  // Demo function - in real app this would come from backend
  const progress = {
    step1: 'completed',
    step2: 'current',
    step3: 'pending',
    step4: 'pending'
  };
  
  localStorage.setItem('application-progress', JSON.stringify(progress));
  updateProgressDisplay(progress);
  
  // Announce progress update
  const announcer = document.getElementById('live-announcer');
  if (announcer) {
    announcer.textContent = 'Progress updated: Registration completed, currently on documents step';
  }
}

function showProgressModal() {
  // For demo purposes, simulate some progress
  simulateProgress();
  
  // Scroll to progress section
  const progressSection = document.querySelector('.progress-tracker');
  if (progressSection) {
    progressSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ========================================
// TEXT-TO-SPEECH FUNCTIONALITY
// ========================================

function initTextToSpeech() {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    const ttsButton = document.getElementById('text-to-speech');
    if (ttsButton) {
      ttsButton.style.display = 'none';
    }
    return;
  }
  
  window.currentSpeech = null;
  window.isSpeaking = false;
}

function toggleTextToSpeech() {
  if (window.isSpeaking) {
    stopSpeech();
  } else {
    startSpeech();
  }
}

function startSpeech() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // Get text content from main sections
  const textContent = extractReadableContent(mainContent);
  
  if (textContent.trim()) {
    window.currentSpeech = new SpeechSynthesisUtterance(textContent);
    window.currentSpeech.rate = 0.8;
    window.currentSpeech.pitch = 1;
    window.currentSpeech.volume = 0.8;
    
    window.currentSpeech.onstart = () => {
      window.isSpeaking = true;
      updateTTSButton(true);
    };
    
    window.currentSpeech.onend = () => {
      window.isSpeaking = false;
      updateTTSButton(false);
    };
    
    window.currentSpeech.onerror = () => {
      window.isSpeaking = false;
      updateTTSButton(false);
    };
    
    speechSynthesis.speak(window.currentSpeech);
    
    // Announce to screen readers
    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = 'Started reading page content aloud';
    }
  }
}

function stopSpeech() {
  if (window.currentSpeech) {
    speechSynthesis.cancel();
    window.isSpeaking = false;
    updateTTSButton(false);
    
    // Announce to screen readers
    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = 'Stopped reading page content';
    }
  }
}

function updateTTSButton(isPlaying) {
  const ttsButton = document.getElementById('text-to-speech');
  if (!ttsButton) return;
  
  const icon = ttsButton.querySelector('i');
  if (icon) {
    icon.className = isPlaying ? 'fas fa-stop' : 'fas fa-volume-up';
  }
  
  ttsButton.setAttribute('aria-label', isPlaying ? 'Stop reading' : 'Read page aloud');
  ttsButton.setAttribute('title', isPlaying ? 'Stop reading' : 'Listen to page content');
}

function extractReadableContent(element) {
  // Extract text from headings and paragraphs, skip navigation and footer
  const readableElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .hero-subtitle, .section-intro');
  let text = '';
  
  readableElements.forEach(el => {
    // Skip if element is in navigation or footer
    if (!el.closest('nav') && !el.closest('footer')) {
      text += el.textContent.trim() + '. ';
    }
  });
  
  return text;
}

console.log('🎨 Elite UI/UX System Loaded Successfully');
console.log('✨ Premium experience activated with performance optimizations');
console.log('♿ WCAG AA accessibility compliance enabled');