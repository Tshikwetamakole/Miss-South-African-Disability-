/**
 * Form Integration Service for Miss South Africa Disability
 * Handles all form submissions and integrates with Supabase database
 */

class FormService {
  constructor() {
    this.initialized = false;
    this.dbService = null;
  }

  /**
   * Initialize form service
   */
  init(databaseService) {
    this.dbService = databaseService;
    this.initialized = true;
    this.bindFormHandlers();
    console.log('✅ Form service initialized');
  }

  /**
   * Bind event handlers to all forms
   */
  bindFormHandlers() {
    // Contact forms
    const contactForms = document.querySelectorAll('[data-form="contact"]');
    contactForms.forEach(form => this.bindContactForm(form));

    // Newsletter forms
    const newsletterForms = document.querySelectorAll('[data-form="newsletter"]');
    newsletterForms.forEach(form => this.bindNewsletterForm(form));

    // Application forms
    const applicationForms = document.querySelectorAll('[data-form="application"]');
    applicationForms.forEach(form => this.bindApplicationForm(form));

    // Event registration forms
    const eventForms = document.querySelectorAll('[data-form="event-registration"]');
    eventForms.forEach(form => this.bindEventRegistrationForm(form));

    // General forms (auto-detect)
    this.autoBindForms();
  }

  /**
   * Auto-bind forms based on their structure
   */
  autoBindForms() {
    // Contact forms (forms with name, email, message fields)
    const forms = document.querySelectorAll('form:not([data-form])');
    forms.forEach(form => {
      const hasName = form.querySelector('input[name*="name"], input[id*="name"]');
      const hasEmail = form.querySelector('input[type="email"], input[name*="email"]');
      const hasMessage = form.querySelector('textarea[name*="message"], textarea[id*="message"]');
      
      if (hasName && hasEmail && hasMessage && !form.hasAttribute('data-form-bound')) {
        form.setAttribute('data-form', 'contact');
        form.setAttribute('data-form-bound', 'true');
        this.bindContactForm(form);
      }
    });
  }

  // ===================
  // CONTACT FORM HANDLER
  // ===================

  bindContactForm(form) {
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handleContactFormSubmission(form);
    });
  }

  async handleContactFormSubmission(form) {
    if (!this.dbService) {
      this.showFormMessage(form, 'Service not available. Please try again later.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
      // Show loading state
      this.setFormLoadingState(form, true, 'Sending message...');

      // Extract form data
      const formData = new FormData(form);
      const messageData = {
        name: this.getFormValue(formData, ['name', 'fullName', 'full_name']),
        email: this.getFormValue(formData, ['email', 'email_address']),
        phone: this.getFormValue(formData, ['phone', 'telephone', 'phone_number']),
        subject: this.getFormValue(formData, ['subject', 'topic']),
        message: this.getFormValue(formData, ['message', 'comment', 'inquiry']),
        message_type: this.getFormValue(formData, ['message_type', 'type']) || 'general'
      };

      // Validate required fields
      if (!messageData.name || !messageData.email || !messageData.message) {
        throw new Error('Please fill in all required fields (name, email, and message).');
      }

      if (!this.isValidEmail(messageData.email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Submit to database
      const result = await this.dbService.submitContactMessage(messageData);

      if (result.success) {
        this.showFormMessage(form, 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        form.reset();
        
        // Track analytics if available
        this.trackFormSubmission('contact', messageData.message_type);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }

    } catch (error) {
      console.error('Contact form error:', error);
      this.showFormMessage(form, error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      this.setFormLoadingState(form, false, originalText);
    }
  }

  // ===================
  // NEWSLETTER FORM HANDLER
  // ===================

  bindNewsletterForm(form) {
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handleNewsletterFormSubmission(form);
    });
  }

  async handleNewsletterFormSubmission(form) {
    if (!this.dbService) {
      this.showFormMessage(form, 'Service not available. Please try again later.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
      // Show loading state
      this.setFormLoadingState(form, true, 'Subscribing...');

      // Extract form data
      const formData = new FormData(form);
      const email = this.getFormValue(formData, ['email', 'email_address']);
      const name = this.getFormValue(formData, ['name', 'full_name']);
      
      // Get interests from checkboxes
      const interests = [];
      const interestCheckboxes = form.querySelectorAll('input[name*="interest"]:checked, input[name*="topic"]:checked');
      interestCheckboxes.forEach(checkbox => interests.push(checkbox.value));

      // Default interests if none selected
      if (interests.length === 0) {
        interests.push('general');
      }

      // Validate
      if (!email) {
        throw new Error('Please enter your email address.');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Submit to database
      const result = await this.dbService.subscribeToNewsletter(email, name, interests);

      if (result.success) {
        this.showFormMessage(form, 'Thank you for subscribing! You\'ll receive our latest updates and news.', 'success');
        form.reset();
        
        // Track analytics
        this.trackFormSubmission('newsletter', 'subscription');
      } else {
        // Handle duplicate subscription gracefully
        if (result.error.includes('duplicate') || result.error.includes('unique')) {
          this.showFormMessage(form, 'You\'re already subscribed to our newsletter. Thank you!', 'info');
        } else {
          throw new Error(result.error || 'Failed to subscribe');
        }
      }

    } catch (error) {
      console.error('Newsletter form error:', error);
      this.showFormMessage(form, error.message || 'Failed to subscribe. Please try again.', 'error');
    } finally {
      this.setFormLoadingState(form, false, originalText);
    }
  }

  // ===================
  // APPLICATION FORM HANDLER
  // ===================

  bindApplicationForm(form) {
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handleApplicationFormSubmission(form);
    });
  }

  async handleApplicationFormSubmission(form) {
    // Check if user is authenticated
    if (!authService || !authService.isAuthenticated()) {
      this.showFormMessage(form, 'Please log in to submit your application.', 'error');
      // Redirect to login
      setTimeout(() => {
        window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 2000);
      return;
    }

    if (!this.dbService) {
      this.showFormMessage(form, 'Service not available. Please try again later.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
      // Show loading state
      this.setFormLoadingState(form, true, 'Submitting application...');

      // Extract all form data
      const formData = new FormData(form);
      const applicationData = {};
      
      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        if (applicationData[key]) {
          // Handle multiple values (like checkboxes)
          if (Array.isArray(applicationData[key])) {
            applicationData[key].push(value);
          } else {
            applicationData[key] = [applicationData[key], value];
          }
        } else {
          applicationData[key] = value;
        }
      }

      // Get current user
      const currentUser = authService.getCurrentUser();
      
      const application = {
        user_id: currentUser.id,
        application_data: applicationData,
        status: 'submitted'
      };

      // Submit to database
      const result = await this.dbService.submitApplication(application);

      if (result.success) {
        this.showFormMessage(form, 'Thank you! Your application has been submitted successfully. We\'ll review it and get back to you soon.', 'success');
        
        // Track analytics
        this.trackFormSubmission('application', 'contestant');
        
        // Redirect to dashboard after delay
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Application form error:', error);
      this.showFormMessage(form, error.message || 'Failed to submit application. Please try again.', 'error');
    } finally {
      this.setFormLoadingState(form, false, originalText);
    }
  }

  // ===================
  // EVENT REGISTRATION HANDLER
  // ===================

  bindEventRegistrationForm(form) {
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handleEventRegistrationSubmission(form);
    });
  }

  async handleEventRegistrationSubmission(form) {
    // Check if user is authenticated
    if (!authService || !authService.isAuthenticated()) {
      this.showFormMessage(form, 'Please log in to register for events.', 'error');
      setTimeout(() => {
        window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 2000);
      return;
    }

    if (!this.dbService) {
      this.showFormMessage(form, 'Service not available. Please try again later.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
      // Show loading state
      this.setFormLoadingState(form, true, 'Registering...');

      // Get event ID from form or data attribute
      const eventId = form.dataset.eventId || form.querySelector('input[name="event_id"]')?.value;
      if (!eventId) {
        throw new Error('Event ID not found');
      }

      // Extract form data
      const formData = new FormData(form);
      const registrationData = {};
      
      for (let [key, value] of formData.entries()) {
        if (key !== 'event_id') {
          registrationData[key] = value;
        }
      }

      // Get current user
      const currentUser = authService.getCurrentUser();

      // Submit registration
      const result = await this.dbService.registerForEvent(eventId, currentUser.id, registrationData);

      if (result.success) {
        this.showFormMessage(form, 'Registration successful! You\'ll receive a confirmation email shortly.', 'success');
        form.reset();
        
        // Track analytics
        this.trackFormSubmission('event_registration', eventId);
        
        // Update UI to show registered state
        this.updateEventRegistrationUI(form, true);
      } else {
        if (result.error.includes('duplicate') || result.error.includes('unique')) {
          this.showFormMessage(form, 'You\'re already registered for this event.', 'info');
          this.updateEventRegistrationUI(form, true);
        } else {
          throw new Error(result.error || 'Failed to register');
        }
      }

    } catch (error) {
      console.error('Event registration error:', error);
      this.showFormMessage(form, error.message || 'Failed to register. Please try again.', 'error');
    } finally {
      this.setFormLoadingState(form, false, originalText);
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  getFormValue(formData, possibleNames) {
    for (const name of possibleNames) {
      const value = formData.get(name);
      if (value) return value;
    }
    return '';
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  setFormLoadingState(form, loading, loadingText = 'Processing...') {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea, select, button');

    inputs.forEach(input => {
      input.disabled = loading;
    });

    if (submitBtn) {
      if (loading) {
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.innerHTML = `<span class="loading-spinner"></span>${loadingText}`;
      } else {
        submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
        submitBtn.removeAttribute('data-original-text');
      }
    }
  }

  showFormMessage(form, message, type = 'info') {
    // Remove existing messages
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.innerHTML = `
      <div class="message-content">
        <i class="fas fa-${this.getMessageIcon(type)}" aria-hidden="true"></i>
        <span>${message}</span>
      </div>
    `;

    // Add styles
    messageEl.style.cssText = `
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 0.5rem;
      border: 1px solid;
      font-size: 0.875rem;
      ${this.getMessageStyles(type)}
    `;

    // Insert at top of form
    form.insertBefore(messageEl, form.firstChild);

    // Auto-remove after delay
    setTimeout(() => {
      messageEl.remove();
    }, type === 'success' ? 10000 : 8000);

    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  getMessageIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  getMessageStyles(type) {
    const styles = {
      success: 'background: #dcfce7; color: #166534; border-color: #bbf7d0;',
      error: 'background: #fef2f2; color: #dc2626; border-color: #fecaca;',
      warning: 'background: #fef3c7; color: #d97706; border-color: #fde68a;',
      info: 'background: #e0f2fe; color: #0369a1; border-color: #bae6fd;'
    };
    return styles[type] || styles.info;
  }

  updateEventRegistrationUI(form, registered) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn && registered) {
      submitBtn.textContent = 'Registered ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = '#10b981';
    }
  }

  trackFormSubmission(formType, category) {
    // Track with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'Form',
        event_label: formType,
        value: category
      });
    }

    // Track with custom analytics
    if (typeof analytics !== 'undefined') {
      analytics.track('Form Submitted', {
        form_type: formType,
        category: category,
        timestamp: new Date().toISOString()
      });
    }
  }
}

// Create global instance
const formService = new FormService();

// Initialize when database service is ready
document.addEventListener('DOMContentLoaded', async () => {
  const checkServices = setInterval(() => {
    if (dbService && dbService.initialized) {
      formService.init(dbService);
      clearInterval(checkServices);
    }
  }, 100);
});

// Add loading spinner styles
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
  .loading-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .message-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
document.head.appendChild(spinnerStyles);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormService, formService };
}