document.addEventListener('DOMContentLoaded', function() {
    initContactFormValidation();
    initRealTimeValidation();
    initFAQAccordion();
});

function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm(contactForm)) {
            submitContactForm(contactForm);
        }
    });
}

function validateContactForm(form) {
    let isValid = true;
    
    const firstName = form.querySelector('#firstName');
    const lastName = form.querySelector('#lastName');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    
    if (firstName && !validateRequired(firstName, 'First name is required')) {
        isValid = false;
    }
    
    if (lastName && !validateRequired(lastName, 'Last name is required')) {
        isValid = false;
    }
    
    if (email) {
        if (!validateRequired(email, 'Email is required')) {
            isValid = false;
        } else if (!validateEmail(email, 'Please enter a valid email address')) {
            isValid = false;
        }
    }
    
    if (phone && phone.value.trim()) {
        if (!validatePhone(phone, 'Please enter a valid phone number')) {
            isValid = false;
        }
    }
    
    if (subject && !validateRequired(subject, 'Please select a subject')) {
        isValid = false;
    }
    
    if (message && !validateRequired(message, 'Message is required')) {
        isValid = false;
    }
    
    return isValid;
}

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

function initRealTimeValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    clearError(field);
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && field.value.trim()) {
        if (!isValidEmailFormat(field.value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'tel' && field.value.trim()) {
        if (!isValidPhoneFormat(field.value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function validateRequired(field, message) {
    if (!field.value.trim()) {
        showError(field, message);
        return false;
    }
    clearError(field);
    return true;
}

function validateEmail(field, message) {
    if (!isValidEmailFormat(field.value)) {
        showError(field, message);
        return false;
    }
    clearError(field);
    return true;
}

function validatePhone(field, message) {
    if (!isValidPhoneFormat(field.value)) {
        showError(field, message);
        return false;
    }
    clearError(field);
    return true;
}

function isValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneFormat(phone) {
    const cleanedPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(cleanedPhone);
}

function showError(field, message) {
    clearError(field);
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    
    const parent = field.parentNode;
    parent.appendChild(errorDiv);
    
    field.focus();
}

function clearError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const parent = field.parentNode;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function submitContactForm(form) {
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    data.timestamp = new Date().toISOString();
    
    console.log('Contact form submitted:', data);
    
    showSuccessMessage(form);
    
    form.reset();
}

function showSuccessMessage(form) {
    const successDiv = document.createElement('div');
    successDiv.classList.add('success-message');
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    const formParent = form.parentNode;
    formParent.insertBefore(successDiv, form);
    
    setTimeout(() => {
        successDiv.classList.add('active');
    }, 100);
    
    setTimeout(() => {
        successDiv.classList.remove('active');
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 5000);
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    input.value = value;
}

document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

function restrictDateInput(input) {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    input.setAttribute('min', minDate);
}

document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        restrictDateInput(input);
    });
});

function validateFileSize(input, maxSizeMB = 5) {
    if (input.files && input.files[0]) {
        const fileSize = input.files[0].size / 1024 / 1024;
        if (fileSize > maxSizeMB) {
            showError(input, `File size must be less than ${maxSizeMB}MB`);
            input.value = '';
            return false;
        }
    }
    return true;
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function validateFormLength(form, maxLength = 1000) {
    const textareas = form.querySelectorAll('textarea');
    let isValid = true;
    
    textareas.forEach(textarea => {
        if (textarea.value.length > maxLength) {
            showError(textarea, `Message must be less than ${maxLength} characters`);
            isValid = false;
        }
    });
    
    return isValid;
}
