/**
 * Registration Form Handler
 * Miss South African Disability Website
 */

class RegistrationManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStepIndicator();
    }

    setupEventListeners() {
        // Multi-step form navigation
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        });

        // File upload handlers
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        });

        // Form submission
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitApplication();
            });
        }

        // Auto-save on input change
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveFormData();
            });
        });

        // Province-city mapping
        const provinceSelect = document.getElementById('province');
        if (provinceSelect) {
            provinceSelect.addEventListener('change', (e) => {
                this.updateCities(e.target.value);
            });
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateStepIndicator();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateStepIndicator();
        }
    }

    showStep(step) {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(stepEl => {
            stepEl.style.display = 'none';
        });

        // Show current step
        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
        }
    }

    updateStepIndicator() {
        const indicators = document.querySelectorAll('.step-indicator');
        indicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNum < this.currentStep) {
                indicator.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                indicator.classList.add('active');
            }
        });

        // Update progress bar
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    validateCurrentStep() {
        const currentStepEl = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepEl) return false;

        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Custom validation for specific steps
        if (this.currentStep === 1) {
            isValid = this.validatePersonalInfo() && isValid;
        } else if (this.currentStep === 2) {
            isValid = this.validateContactInfo() && isValid;
        } else if (this.currentStep === 3) {
            isValid = this.validatePageantInfo() && isValid;
        }

        return isValid;
    }

    validatePersonalInfo() {
        let isValid = true;
        
        // Age validation
        const dobInput = document.getElementById('dateOfBirth');
        if (dobInput && dobInput.value) {
            const age = this.calculateAge(new Date(dobInput.value));
            if (age < 18 || age > 30) {
                this.showFieldError(dobInput, 'Age must be between 18 and 30 years');
                isValid = false;
            } else {
                document.getElementById('age').value = age;
            }
        }

        // Phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value) {
            const phoneRegex = /^(\+27|0)[0-9]{9}$/;
            if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
                this.showFieldError(phoneInput, 'Please enter a valid South African phone number');
                isValid = false;
            }
        }

        return isValid;
    }

    validateContactInfo() {
        let isValid = true;

        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                this.showFieldError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }

        return isValid;
    }

    validatePageantInfo() {
        let isValid = true;

        // Minimum word count for text areas
        const platformCause = document.getElementById('platformCause');
        if (platformCause && platformCause.value) {
            const wordCount = platformCause.value.trim().split(/\s+/).length;
            if (wordCount < 50) {
                this.showFieldError(platformCause, 'Please provide at least 50 words');
                isValid = false;
            }
        }

        const whyCompete = document.getElementById('whyCompete');
        if (whyCompete && whyCompete.value) {
            const wordCount = whyCompete.value.trim().split(/\s+/).length;
            if (wordCount < 50) {
                this.showFieldError(whyCompete, 'Please provide at least 50 words');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        
        field.classList.add('error');
        field.parentNode.appendChild(errorEl);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    saveFormData() {
        const formEl = document.getElementById('registrationForm');
        if (!formEl) return;

        const formData = new FormData(formEl);
        this.formData = {};
        
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }

        // Save to localStorage as backup
        localStorage.setItem('registrationFormData', JSON.stringify(this.formData));
    }

    loadFormData() {
        const savedData = localStorage.getItem('registrationFormData');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                this.populateForm(this.formData);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }

    populateForm(data) {
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = data[key] === field.value;
                } else {
                    field.value = data[key];
                }
            }
        });
    }

    async uploadFile(file, bucket = 'contestant-documents') {
        try {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase client not available');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${bucket}/${fileName}`;

            const { data, error } = await client.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL
            const { data: urlData } = client.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return {
                success: true,
                path: filePath,
                url: urlData.publicUrl
            };
        } catch (error) {
            console.error('File upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.showFieldError(event.target, 'File size must be less than 5MB');
            return;
        }

        // Show upload progress
        const progressEl = event.target.parentNode.querySelector('.upload-progress');
        if (progressEl) {
            progressEl.style.display = 'block';
        }

        try {
            const result = await this.uploadFile(file);
            
            if (result.success) {
                // Store file URL in hidden input
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = `${event.target.name}_url`;
                hiddenInput.value = result.url;
                event.target.parentNode.appendChild(hiddenInput);

                // Show success message
                this.clearFieldError(event.target);
                const successEl = document.createElement('div');
                successEl.className = 'upload-success';
                successEl.textContent = '✓ File uploaded successfully';
                event.target.parentNode.appendChild(successEl);
            } else {
                this.showFieldError(event.target, result.error);
            }
        } catch (error) {
            this.showFieldError(event.target, 'Upload failed. Please try again.');
        } finally {
            if (progressEl) {
                progressEl.style.display = 'none';
            }
        }
    }

    updateCities(province) {
        const citySelect = document.getElementById('city');
        if (!citySelect) return;

        // Clear existing options
        citySelect.innerHTML = '<option value="">Select City</option>';

        // South African cities by province
        const cities = {
            'western-cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Worcester', 'Mossel Bay'],
            'gauteng': ['Johannesburg', 'Pretoria', 'Soweto', 'Sandton', 'Randburg', 'Roodepoort'],
            'kwazulu-natal': ['Durban', 'Pietermaritzburg', 'Newcastle', 'Richards Bay', 'Ladysmith'],
            'eastern-cape': ['Port Elizabeth', 'East London', 'Uitenhage', 'King Williams Town', 'Grahamstown'],
            'limpopo': ['Polokwane', 'Tzaneen', 'Thohoyandou', 'Giyani', 'Musina'],
            'mpumalanga': ['Nelspruit', 'Witbank', 'Secunda', 'Middelburg', 'Standerton'],
            'north-west': ['Mahikeng', 'Rustenburg', 'Klerksdorp', 'Potchefstroom', 'Brits'],
            'northern-cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar', 'Kuruman'],
            'free-state': ['Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem', 'Sasolburg']
        };

        if (cities[province]) {
            cities[province].forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase().replace(/\s+/g, '-');
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }

    async submitApplication() {
        try {
            // Validate all steps
            for (let i = 1; i <= this.totalSteps; i++) {
                this.currentStep = i;
                if (!this.validateCurrentStep()) {
                    this.showStep(i);
                    this.updateStepIndicator();
                    throw new Error(`Please complete all required fields in step ${i}`);
                }
            }

            const client = getSupabaseClient();
            if (!client) throw new Error('Database connection not available');

            // Show loading state
            this.setSubmitButtonState(true);

            // Collect all form data
            this.saveFormData();
            
            // Generate application number
            const applicationNumber = this.generateApplicationNumber();

            // Prepare contestant data
            const contestantData = {
                application_number: applicationNumber,
                user_id: authManager.currentUser?.id || null,
                first_name: this.formData.firstName,
                last_name: this.formData.lastName,
                email: this.formData.email,
                phone: this.formData.phone,
                date_of_birth: this.formData.dateOfBirth,
                age: parseInt(this.formData.age),
                province: this.formData.province,
                city: this.formData.city,
                address: this.formData.address,
                disability_type: this.formData.disabilityType,
                disability_description: this.formData.disabilityDescription,
                height: this.formData.height ? parseFloat(this.formData.height) : null,
                weight: this.formData.weight ? parseFloat(this.formData.weight) : null,
                emergency_contact_name: this.formData.emergencyContactName,
                emergency_contact_phone: this.formData.emergencyContactPhone,
                education_level: this.formData.educationLevel,
                occupation: this.formData.occupation,
                achievements: this.formData.achievements,
                hobbies: this.formData.hobbies,
                languages_spoken: this.formData.languagesSpoken ? this.formData.languagesSpoken.split(',').map(l => l.trim()) : [],
                talent_description: this.formData.talentDescription,
                platform_cause: this.formData.platformCause,
                why_compete: this.formData.whyCompete,
                previous_pageant_experience: this.formData.previousPageantExperience,
                photo_url: this.formData.photo_url || null,
                id_document_url: this.formData.idDocument_url || null,
                medical_certificate_url: this.formData.medicalCertificate_url || null,
                medical_clearance: !!this.formData.medicalCertificate_url,
                status: 'pending'
            };

            // Submit to database
            const { data, error } = await client
                .from('contestants')
                .insert([contestantData])
                .select();

            if (error) throw error;

            // Clear saved form data
            localStorage.removeItem('registrationFormData');

            // Show success message
            this.showSuccessMessage(applicationNumber);

            // Send confirmation email (if you have email service set up)
            // await this.sendConfirmationEmail(contestantData);

        } catch (error) {
            console.error('Application submission error:', error);
            showNotification(error.message || 'Failed to submit application. Please try again.', 'error');
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    generateApplicationNumber() {
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `MSAD${year}${timestamp}${random}`;
    }

    setSubmitButtonState(loading) {
        const submitBtn = document.querySelector('#registrationForm [type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Submitting...' : 'Submit Application';
        }
    }

    showSuccessMessage(applicationNumber) {
        const form = document.getElementById('registrationForm');
        const successHTML = `
            <div class="application-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Application Submitted Successfully!</h2>
                <p>Thank you for applying to Miss South African Disability.</p>
                <div class="application-details">
                    <p><strong>Application Number:</strong> ${applicationNumber}</p>
                    <p>Please save this number for your records.</p>
                </div>
                <div class="next-steps">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>You will receive a confirmation email shortly</li>
                        <li>Our team will review your application within 5-7 business days</li>
                        <li>We'll contact you with the next steps</li>
                    </ul>
                </div>
                <div class="success-actions">
                    <a href="/" class="btn btn-primary">Return to Home</a>
                    <a href="faq.html" class="btn btn-outline">View FAQ</a>
                </div>
            </div>
        `;
        
        form.innerHTML = successHTML;
    }
}

// Initialize registration manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('registrationForm')) {
        window.registrationManager = new RegistrationManager();
        
        // Load any saved form data
        registrationManager.loadFormData();
    }
});

// Export for global use
window.RegistrationManager = RegistrationManager;