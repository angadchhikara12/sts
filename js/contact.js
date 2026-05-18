const SUPABASE_URL = 'https://ktnxwyuukscetpoxjety.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bnh3eXV1a3NjZXRwb3hqZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNjQyMDAsImV4cCI6MjA1OTY0MDIwMH0.8Rup8E4Jrl9LFeQMJJSVhnImzr3RAl-DYf0x2VeA4-Y';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Add touch support to submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            contactForm.dispatchEvent(new Event('submit'));
        }, { passive: false });
    }

    // Handle form submit
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
            const { error: dbError } = await supabaseClient
                .from('contacts')
                .insert([
                    {
                        first_name: contactData.firstName,
                        last_name: contactData.lastName,
                        email: contactData.email,
                        phone: contactData.phone || null,
                        subject: contactData.subject,
                        message: contactData.message,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (dbError) {
                console.error('Database error:', dbError);
                throw new Error('Failed to save to database');
            }

            console.log('Contact saved to database successfully');

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
        name: `${contactData.firstName} ${contactData.lastName}`.trim(),
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        time: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    console.log('Sending contact email via EmailJS:', templateParams);

    if (typeof emailjs === 'undefined' || !emailjs.send) {
        console.error('EmailJS is not loaded or not available');
        throw new Error('EmailJS is not loaded. Please refresh the page and try again.');
    }

    try {
        await emailjs.send('service_g3l10te', 'template_8bmg7ti', templateParams, 'lrCm2SvIUDYFyHLup');
        console.log('Contact email sent successfully');
        return { success: true };
    } catch (emailError) {
        console.error('EmailJS send error:', emailError);
        throw new Error('Failed to send email. Please try again or email us directly at info@sants.us');
    }
}

function showContactSuccessMessage(contactData) {
    const successModal = document.createElement('div');
    successModal.className = 'contact-modal';
    successModal.innerHTML = `
        <div class="contact-modal-content">
            <div class="modal-icon">
                <i class="fas fa-paper-plane"></i>
            </div>
            <h2>Message Sent Successfully!</h2>
            <p>Thank you, <strong>${contactData.firstName}</strong>!</p>
            <p>Your message has been sent to our team at <strong>info@sants.us</strong></p>
            <p>We typically respond within 24 hours during business days.</p>
            <div class="booking-notice" style="background-color: #fff3cd; color: #856404; padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 14px; border-left: 4px solid #ffc107;">
                <strong>Notice:</strong> If you haven't seen our reply email, please consider checking your Spam folder.
            </div>
            <div class="modal-actions">
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
                <button class="btn btn-primary" onclick="this.closest('.contact-modal').remove()">Close</button>
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