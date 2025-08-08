/* Enhanced JavaScript for Miss South Africa Disability */

document.addEventListener('DOMContentLoaded', () => {
    // Enhanced mobile navigation
    const navToggleBtn = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('primary-menu');
    
    if (navToggleBtn && navMenu) {
        navToggleBtn.addEventListener('click', () => {
            const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true' || false;
            navToggleBtn.setAttribute('aria-expanded', String(!expanded));
            navToggleBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !navToggleBtn.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggleBtn.classList.remove('active');
                navToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggleBtn.classList.remove('active');
                navToggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Enhanced countdown timer
    const countdownTargetDate = new Date('2025-11-15T18:00:00+02:00');
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date();
        const diff = countdownTargetDate - now;
        
        if (diff <= 0) {
            const countdownTimer = document.getElementById('countdown-timer');
            if (countdownTimer) {
                countdownTimer.innerHTML = '<div>The event has started!</div>';
            }
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const daysElem = document.getElementById('days');
        const hoursElem = document.getElementById('hours');
        const minutesElem = document.getElementById('minutes');
        const secondsElem = document.getElementById('seconds');

        if (daysElem) daysElem.textContent = days.toString().padStart(2, '0');
        if (hoursElem) hoursElem.textContent = hours.toString().padStart(2, '0');
        if (minutesElem) minutesElem.textContent = minutes.toString().padStart(2, '0');
        if (secondsElem) secondsElem.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown(); // Initial call to avoid delay

    // Enhanced carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');

        let currentIndex = 0;
        let autoSlideInterval;

        function updateCarousel(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;

            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
                slide.style.transform = `translateX(${(i - index) * 100}%)`;
            });
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, 5000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
                startAutoSlide();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
                startAutoSlide();
            });
        }

        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);

        // Initialize
        updateCarousel(0);
        startAutoSlide();
    }

    // Form validation for contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) throw new Error('Network response not ok');

                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                    contactForm.reset();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Error submitting form. Please try again.');
                console.error('Contact form submission error:', error);
            }
        });
    }

    // Application form submission
    const applicationForm = document.getElementById('pageant-application');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) throw new Error('Network response not ok');

                const result = await response.json();
                
                if (result.success) {
                    const successMsg = document.getElementById('form-success');
                    if (successMsg) successMsg.style.display = 'block';
                    applicationForm.style.display = 'none';
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Error submitting application. Please try again.');
                console.error('Application form submission error:', error);
            }
        });
    }

    // Smooth scroll for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) { // Ignore href="#"
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Active navigation highlighting on scroll
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        let current = '';
        const scrollPos = window.scrollY || window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop - 200 && scrollPos < sectionTop + sectionHeight - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Initial highlight
    highlightNavigation();

    // Loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});
