/* File: /miss-sa-disability/js/main.js */
/* Main JavaScript functionality for Miss South Africa Disability Site */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Mobile navigation toggle =====
  const navToggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('primary-menu');

  navToggleBtn.addEventListener('click', () => {
    const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true' || false;
    navToggleBtn.setAttribute('aria-expanded', !expanded);
    navToggleBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu when clicking menu links (for better UX)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggleBtn.classList.remove('active');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ===== High contrast mode toggle =====
  const contrastToggleBtn = document.getElementById('contrast-toggle');

  function setContrastMode(enabled) {
    if (enabled) {
      document.body.classList.add('high-contrast');
      contrastToggleBtn.setAttribute('aria-pressed', 'true');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.body.classList.remove('high-contrast');
      contrastToggleBtn.setAttribute('aria-pressed', 'false');
      localStorage.setItem('highContrast', 'false');
    }
  }

  // Initialize contrast mode from localStorage
  const storedContrast = localStorage.getItem('highContrast');
  if (storedContrast === 'true') {
    setContrastMode(true);
  } else {
    setContrastMode(false);
  }

  contrastToggleBtn.addEventListener('click', () => {
    const currentlyHighContrast = document.body.classList.contains('high-contrast');
    setContrastMode(!currentlyHighContrast);
  });

  // ===== Countdown Timer =====
  // Set the target date/time for next pageant event (e.g., Nov 15, 2024 18:00 SAST)
  const countdownTargetDate = new Date('2024-11-15T18:00:00+02:00');

  function updateCountdown() {
    const now = new Date();
    const diff = countdownTargetDate - now;
    if (diff <= 0) {
      document.getElementById('countdown-timer').textContent = 'The event has started!';
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // ===== Carousel for Highlight Reel =====
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');

    let currentIndex = 0;

    function updateCarousel(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== index);
      });

      // shift track
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
    });

    // Keyboard navigation for carousel
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateCarousel(currentIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateCarousel(currentIndex + 1);
      }
    });

    // Initialize carousel
    updateCarousel(0);
  }

  // ===== Smooth scroll for anchor links =====
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetElem.focus({ preventScroll: true });
        if(document.activeElement !== targetElem) {
          targetElem.setAttribute('tabindex', '-1');
          targetElem.focus({ preventScroll: true });
        }
      }
    });
  });

  // ===== Lazy loading for images and videos (using native loading attribute) =====
  // Already used loading="lazy" on img elements - supported by modern browsers.

  // For browsers that do not support loading=lazy, optionally implement IntersectionObserver fallback.

  // check for intersection observer support
  if ('IntersectionObserver' in window) {
    const lazyElements = [].slice.call(document.querySelectorAll('img[loading="lazy"], video[preload="metadata"]'));
    const config = { rootMargin: '50px 0px', threshold: 0.01 };
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.tagName.toLowerCase() === 'img') {
            el.src = el.dataset.src || el.src;
            if (el.dataset.srcset) {
              el.srcset = el.dataset.srcset;
            }
          } else if (el.tagName.toLowerCase() === 'video') {
            el.load();
          }
          observer.unobserve(el);
        }
      });
    }, config);

    lazyElements.forEach(lazyEl => {
      observer.observe(lazyEl);
    });
  }

});