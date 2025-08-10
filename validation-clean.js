/**
 * Client-side validation utilities for Miss South Africa Disability
 */

// Validation rules
const validationRules = {
  name: {
    pattern: /^[A-Za-z\s\-']{2,50}$/,
    message: "Please enter a valid name (2-50 characters, letters only)"
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  phone: {
    pattern: /^\+?[\d\s\-]{7,15}$/,
    message: "Please enter a valid phone number"
  },
  idNumber: {
    pattern: /^[0-9]{13}$/,
    message: "Please enter a valid 13-digit ID number"
  },
  dateOfBirth: {
    validate: (value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 65;
    },
    message: "Age must be between 18 and 65"
  }
};

// File validation
const fileValidation = {
  photo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    message: "Photo must be less than 5MB and in JPG, PNG, or GIF format"
  },
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    message: "Documents must be less than 10MB and in PDF, DOC, or DOCX format"
  }
};

// Validation functions
const validators = {
  validateField: (value, rule) => {
    if (!value || !value.trim()) return "This field is required";
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
    
    if (rule.validate && !rule.validate(value)) {
      return rule.message;
    }
    
    return null;
  },

  validateFile: (file, validation) => {
    if (!file) return null;
    
    if (file.size > validation.maxSize) {
      return validation.message;
    }
    
    if (!validation.allowedTypes.includes(file.type)) {
      return validation.message;
    }
    
    return null;
  },

  validateForm: (formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const error = validators.validateField(formData.get(field), rules[field]);
      if (error) errors[field] = error;
    });
    
    return errors;
  }
};

// Form validation helper
const formValidator = {
  validateApplicationForm: (formData) => {
    const errors = {};
    
    // Required fields
    const required = ["first-name", "last-name", "email", "phone", "date-of-birth"];
    required.forEach(field => {
      const error = validators.validateField(formData.get(field), validationRules[field] || {});
      if (error) errors[field] = error;
    });

    // Email validation
    const email = formData.get("email");
    if (email) {
      const emailError = validators.validateField(email, validationRules.email);
      if (emailError) errors.email = emailError;
    }

    // Phone validation
    const phone = formData.get("phone");
    if (phone) {
      const phoneError = validators.validateField(phone, validationRules.phone);
      if (phoneError) errors.phone = phoneError;
    }

    // ID validation
    const idNumber = formData.get("id-number");
    if (idNumber) {
      const idError = validators.validateField(idNumber, validationRules.idNumber);
      if (idError) errors["id-number"] = idError;
    }

    // File validations
    const photo = formData.get("photo");
    if (photo) {
      const photoError = validators.validateFile(photo, fileValidation.photo);
      if (photoError) errors.photo = photoError;
    }

    return errors;
  },

  validateContactForm: (formData) => {
    const errors = {};
    
    const required = ["contact-name", "contact-email", "contact-message"];
    required.forEach(field => {
      const rule = field === "contact-email" ? validationRules.email : {};
      const error = validators.validateField(formData.get(field), rule);
      if (error) errors[field] = error;
    });

    return errors;
  },

  displayErrors: (form, errors) => {
    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Display new errors
    Object.keys(errors).forEach(field => {
      const errorElement = form.querySelector(`#${field} + .error-message`);
      if (errorElement) {
        errorElement.textContent = errors[field];
      }
    });
  },

  clearErrors: (form) => {
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validators, formValidator, validationRules, fileValidation };
} else {
  window.FormValidator = formValidator;
}
