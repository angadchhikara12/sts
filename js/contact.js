document.addEventListener('DOMContentLoaded', function() {
    initFAQAccordion();
    initContactForm();
});

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const wasOpen = item.classList.contains('active');

            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const a = other.querySelector('.faq-answer');
                    if (a) a.style.maxHeight = '0';
                }
            });

            if (wasOpen) {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const contactData = {};
        formData.forEach((value, key) => {
            contactData[key] = value;
        });

        const isValid = validateContactForm(contactData);
        if (!isValid) return;

        try {
            await sendContactEmail(contactData);

            if (typeof addNotification === 'function') {
                addNotification(
                    'Message Sent',
                    'Thank you for contacting us! We\'ll get back to you soon.',
                    'success'
                );
            }

            showContactSuccessMessage(contactData);
            contactForm.reset();

        } catch (error) {
            console.error('Error sending contact form:', error);
            if (typeof addNotification === 'function') {
                addNotification(
                    'Send Failed',
                    'Failed to send your message. Please try again or email us directly at info@sants.us',
                    'error'
                );
            }
        }
    });
}

function validateContactForm(data) {
    let isValid = true;

    if (!data.firstName || !data.firstName.trim()) {
        showFieldError(document.getElementById('firstName'), 'First name is required');
        isValid = false;
    }

    if (!data.lastName || !data.lastName.trim()) {
        showFieldError(document.getElementById('lastName'), 'Last name is required');
        isValid = false;
    }

    if (!data.email || !data.email.trim() || !isValidEmail(data.email)) {
        showFieldError(document.getElementById('email'), 'Valid email is required');
        isValid = false;
    }

    if (!data.subject || !data.subject.trim()) {
        showFieldError(document.getElementById('subject'), 'Subject is required');
        isValid = false;
    }

    if (!data.message || !data.message.trim()) {
        showFieldError(document.getElementById('message'), 'Message is required');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.classList.add('error');

    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);

    setTimeout(() => {
        field.classList.remove('error');
        errorDiv.remove();
    }, 5000);
}

async function sendContactEmail(contactData) {
    const templateParams = {
        to_email: 'info@sants.us',
        to_name: 'SAN Transportation Team',
        from_name: `${contactData.firstName} ${contactData.lastName}`.trim(),
        from_email: contactData.email,
        reply_to: contactData.email,
        phone_number: contactData.phone || 'Not provided',
        subject: contactData.subject,
        message: contactData.message,
        submitted_date: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    console.log('Sending contact email to info@sants.us via EmailJS:', templateParams);

    if (typeof emailjs !== 'undefined' && emailjs.send) {
        await emailjs.send('service_g3l10te', 'template_8bmg7ti', templateParams);
        console.log('Contact email sent successfully');
        return { success: true };
    } else {
        console.log('EmailJS not loaded - skipping email send');
        return { success: false, message: 'EmailJS not available' };
    }
}

function showContactSuccessMessage(contactData) {
    const successModal = document.createElement('div');
    successModal.className = 'booking-modal';
    successModal.innerHTML = `
        <div class="booking-modal-content">
            <div class="modal-icon">
                <i class="fas fa-paper-plane"></i>
            </div>
            <h2>Message Sent Successfully!</h2>
            <p>Thank you, <strong>${contactData.firstName}</strong>!</p>
            <p>Your message has been sent to our team at <strong>info@sants.us</strong></p>
            <p>We typically respond within 24 hours during business days.</p>
            <div class="modal-actions">
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
                <button class="btn btn-primary" onclick="this.closest('.booking-modal').remove()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(successModal);

    setTimeout(() => {
        successModal.classList.add('active');
    }, 100);

    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.remove();
        }
    });
}