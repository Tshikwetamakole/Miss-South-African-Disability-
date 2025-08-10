/* ========================================
   MISS SOUTH AFRICA DISABILITY - MAIN JS
   ======================================== */

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Mobile Navigation Toggle
function initMobileNav() {
  const navToggle = $(".mobile-nav-toggle");
  const navMenu = $("#nav-menu");

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

// High Contrast Mode
function initHighContrast() {
  const contrastToggle = $("#contrast-toggle");
  const html = document.documentElement;

  if (!contrastToggle) return;

  // Load saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "high-contrast") {
    html.setAttribute("data-theme", "high-contrast");
  }

  contrastToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme =
      currentTheme === "high-contrast" ? "default" : "high-contrast";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Announce change to screen readers
    announceToScreenReader(
      newTheme === "high-contrast"
        ? "High contrast mode enabled"
        : "High contrast mode disabled"
    );
  });
}

// Screen Reader Announcements
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Accessible Carousel
function initCarousel() {
  const carousel = $(".carousel");
  if (!carousel) return;

  const slides = $$(".carousel-slide");
  const prevBtn = $(".carousel-prev");
  const nextBtn = $(".carousel-next");
  const indicators = $$(".carousel-indicators button");

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

    // Announce slide change
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

  // Event listeners
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

  // Auto-advance (optional)
  // setInterval(nextSlide, 5000);
}

// Form Handling
function initForms() {
  // Contact Form
  const contactForm = $("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  // Application Form
  const applicationForm = $("#application-form");
  if (applicationForm) {
    applicationForm.addEventListener("submit", handleApplicationSubmit);
  }

  // Newsletter Form
  const newsletterForm = $("#newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit);
  }
}

// Contact Form Handler
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

// Application Form Handler
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

// Newsletter Handler
async function handleNewsletterSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const email = form.querySelector('input[type="email"]').value;

  if (!validateEmail(email)) {
    showFormMessage(form, "Please enter a valid email address.", "error");
    return;
  }

  // Fallback for demo - replace with actual API call
  alert(
    "Thank you for subscribing! (This is a demo - integrate with your email service)"
  );
  form.reset();
}

// Validation Functions
function validateContactForm(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Please enter your full name");
  }

  if (!validateEmail(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Please enter a message (at least 10 characters)");
  }

  if (errors.length > 0) {
    showFormMessage(
      document.querySelector("#contact-form"),
      errors[0],
      "error"
    );
    return false;
  }

  return true;
}

function validateApplicationForm(formData) {
  const errors = [];

  // Basic validation - add more as needed
  const required = ["fullName", "email", "phone", "age"];

  required.forEach((field) => {
    if (!formData.get(field)) {
      errors.push(`${field} is required`);
    }
  });

  const email = formData.get("email");
  if (email && !validateEmail(email)) {
    errors.push("Please enter a valid email address");
  }

  const age = parseInt(formData.get("age"));
  if (age && (age < 18 || age > 65)) {
    errors.push("Age must be between 18 and 65");
  }

  // File validation
  const photo = formData.get("photo");
  if (photo && photo.size > 5 * 1024 * 1024) {
    // 5MB limit
    errors.push("Photo must be less than 5MB");
  }

  if (errors.length > 0) {
    showFormMessage(
      document.querySelector("#application-form"),
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

// Form Message Display
function showFormMessage(form, message, type) {
  const messageDiv =
    form.querySelector(".form-message") || document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.setAttribute("role", type === "error" ? "alert" : "status");
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

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Lazy Loading Images
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Event Filters
function initEventFilters() {
  const filterButtons = $$(".filter-btn");
  const eventCards = $$(".event-card");

  if (!filterButtons.length || !eventCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
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
    });
  });
}

// Initialize all functionality
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHighContrast();
  initCarousel();
  initForms();
  initSmoothScroll();
  initLazyLoading();
  initEventFilters();
});

// Service Worker Registration (for PWA)
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
