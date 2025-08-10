/* ========================================
   MISS SOUTH AFRICA DISABILITY - MAIN JS (UPDATED)
   ======================================== */

// Utility Functions - Renamed to avoid jQuery conflicts
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

// Persistent ARIA-live element for announcements
const createAriaLiveElement = () => {
  const liveRegion = document.createElement('div');
  liveRegion.id = 'aria-live-region';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  document.body.appendChild(liveRegion);
  return liveRegion;
};

const ariaLiveRegion = createAriaLiveElement();

// Screen Reader Announcements - Updated to use persistent element
function announceToScreenReader(message) {
  ariaLiveRegion.textContent = message;
  // Clear after a delay to allow screen readers to read it
  setTimeout(() => {
    ariaLiveRegion.textContent = '';
  }, 1000);
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility function
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
  };
}

// Mobile Navigation Toggle - Updated with null checks
function initMobileNav() {
  const navToggle = qs("#nav-toggle");
  const navMenu = qs("#primary-menu");
  
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".main-nav")) {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("active");
    }
  });
}

// High Contrast Mode - Updated with null checks
function initHighContrast() {
  const contrastToggle = qs("#contrast-toggle");
  const html = document.documentElement;

  if (!contrastToggle) return;

  // Load saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "high-contrast") {
    html.setAttribute("data-theme", "high-contrast");
  }

  contrastToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "high-contrast" ? "default" : "high-contrast";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    announceToScreenReader(
      newTheme === "high-contrast" 
        ? "High contrast mode enabled" 
        : "High contrast mode disabled"
    );
  });
}

// Accessible Carousel - Updated with null checks
function initCarousel() {
  const carousel = qs(".carousel");
  if (!carousel) return;

  const slides = qsa(".carousel-slide");
  const prevBtn = qs(".carousel-prev");
  const nextBtn = qs(".carousel-next");
  const indicators = qsa(".carousel-indicators button");

  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });

    const activeSlide = slides[index];
    const caption = activeSlide.querySelector(".slide-caption h3");
    if (caption) {
      announceToScreenReader(
        `Slide ${index + 1} of ${totalSlides}: ${caption.textContent}`
      );
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Keyboard navigation
  carousel.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        prevSlide();
        break;
      case "ArrowRight":
        nextSlide();
        break;
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }
}

// Form Handling - Updated with null checks and FormData support
function initForms() {
  // Application Form
  const applicationForm = qs("#application-form");
  if (applicationForm) {
    applicationForm.addEventListener("submit", handleApplicationSubmit);
  }

  // Contact Form
  const contactForm = qs("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
}

// Application Form Handler - Updated with FormData and proper validation
async function handleApplicationSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Client-side validation
  if (!validateApplicationForm(formData)) return;

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("/api/apply", {
      method: "POST",
      body: formData, // FormData handles file uploads
    });

    const result = await response.json();

    if (response.ok) {
      showFormMessage(
        form,
        "Application submitted successfully! We'll be in touch soon.",
        "success"
      );
      form.reset();
    } else {
      throw new Error(result.message || "Failed to submit application");
    }
  } catch (error) {
    console.error("Error:", error);
    showFormMessage(
      form,
      "Sorry, there was an error submitting your application. Please try again.",
      "error"
    );
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Contact Form Handler - Updated with JSON handling
async function handleContactSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (!validateContactForm(data)) return;

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showFormMessage(
        form,
        "Thank you! Your message has been sent.",
        "success"
      );
      form.reset();
    } else {
      throw new Error(result.message || "Failed to send message");
    }
  } catch (error) {
    console.error("Error:", error);
    showFormMessage(
      form,
      "Sorry, there was an error sending your message. Please try again.",
      "error"
    );
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Validation Functions - Updated with comprehensive validation
function validateApplicationForm(formData) {
  const errors = [];
  
  // Required fields
  const required = ["first-name", "last-name", "email", "phone", "date-of-birth"];
  
  required.forEach(field => {
    if (!formData.get(field) || !formData.get(field).trim()) {
      errors.push(`${field.replace('-', ' ')} is required`);
    }
  });

  // Email validation
  const email = formData.get("email");
  if (email && !validateEmail(email)) {
    errors.push("Please enter a valid email address");
  }

  // Phone validation
  const phone = formData.get("phone");
  if (phone && !/^\+?[\d\s\-]{7,15}$/.test(phone)) {
    errors.push("Please enter a valid phone number");
  }

  // Age validation
  const dob = formData.get("date-of-birth");
  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18 || age > 65) {
      errors.push("Age must be between 18 and 65");
    }
  }

  // File validation
  const photo = formData.get("photo");
  if (photo && photo.size > 5 * 1024 * 1024) {
    errors.push("Photo must be less than 5MB");
  }

  if (errors.length > 0) {
    showFormMessage(
      qs("#application-form"),
      errors[0],
      "error"
    );
    return false;
  }

  return true;
}

function validateContactForm(data) {
  const errors = [];

  if (!data["contact-name"] || data["contact-name"].trim().length < 2) {
    errors.push("Please enter your full name");
  }

  if (!validateEmail(data["contact-email"])) {
    errors.push("Please enter a valid email address");
  }

  if (!data["contact-message"] || data["contact-message"].trim().length < 10) {
    errors.push("Please enter a message (at least 10 characters)");
  }

  if (errors.length > 0) {
    showFormMessage(
      qs("#contact-form"),
      errors[0],
      "error"
    );
    return false;
  }

  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Form Message Display - Updated with ARIA-live
function showFormMessage(form, message, type) {
  const messageDiv = form.querySelector(".form-message") || document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.setAttribute("role", type === "error" ? "alert" : "status");
  messageDiv.setAttribute("aria-live", "polite");
  messageDiv.textContent = message;

  if (!form.querySelector(".form-message")) {
    form.appendChild(messageDiv);
  }

  // Auto-hide success messages
  if (type === "success") {
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Smooth Scroll for Anchor Links - Updated with debounce
function initSmoothScroll() {
  const links = qsa('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", debounce((e) => {
      e.preventDefault();
      const target = qs(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100));
  });
}

// Lazy Loading Images - Updated with throttle
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    qsa("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Event Filters - Updated with debounce
function initEventFilters() {
  const filterButtons = qsa(".filter-btn");
  const eventCards = qsa(".event-card");

  if (!filterButtons.length || !eventCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", debounce(() => {
      const filter = button.dataset.filter;

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter events
      eventCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    }, 150));
  });
}

// Initialize all functionality with null checks
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHighContrast();
  initCarousel();
  initForms();
  initSmoothScroll();
  initLazyLoading();
  initEventFilters();
});

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered"))
      .catch((registrationError) => console.log("SW registration failed"));
  });
}

// Performance Monitoring
if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "navigation") {
        console.log(
          "Page load time:",
          entry.loadEventEnd - entry.loadEventStart
        );
      }
    }
  });
  observer.observe({ entryTypes: ["navigation"] });
}
