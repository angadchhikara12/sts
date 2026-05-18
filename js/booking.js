// Supabase Configuration
const SUPABASE_URL = 'https://ktnxwyuukscetpoxjety.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bnh3eXV1a3NjZXRwb3hqZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTc5NjYsImV4cCI6MjA5NDAzMzk2Nn0.D2Nv_5FSwl9-4B0zTEsrLyIKOi-75Qq41TFp82nyLt0';
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const nextButtons = form.querySelectorAll('.btn-next');
    const prevButtons = form.querySelectorAll('.btn-prev');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = getCurrentStep();
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            console.log('Next button clicked - Current step:', currentStep, 'Next step:', nextStep);
            const validationResult = validateCurrentStep(currentStep);
            console.log('Validation result:', validationResult);
            
            if (validationResult) {
                console.log('Validation passed - moving to step:', nextStep);
                goToStep(nextStep);
                
                if (nextStep === 4) {
                    populateSummary();
                }
            } else {
                console.log('Validation failed - staying on step:', currentStep);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            console.log('Previous button clicked - moving to:', prevStep);
            goToStep(prevStep);
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const validationResult = validateCurrentStep(4);
        console.log('Form submit - validation result:', validationResult);
        
        if (validationResult) {
            console.log('Form validation passed - submitting booking');
            submitBooking();
        } else {
            console.log('Form validation failed - not submitting');
        }
    });
    
    const vehicleOptions = document.querySelectorAll('.vehicle-option input[type="radio"]');
    vehicleOptions.forEach(option => {
        option.addEventListener('change', function() {
            vehicleOptions.forEach(opt => {
                opt.closest('.vehicle-option').classList.remove('selected');
            });
            this.closest('.vehicle-option').classList.add('selected');
        });
    });
}


function getCurrentStep() {
    const activeStep = document.querySelector('.booking-step.active');
    return activeStep ? parseInt(activeStep.getAttribute('data-step')) : 1;
}

function goToStep(stepNumber) {
    const steps = document.querySelectorAll('.booking-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    steps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) === stepNumber) {
            step.classList.add('active');
        }
    });
    
    progressSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
    
    const bookingContainer = document.querySelector('.booking-container');
    if (bookingContainer) {
        bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function validateCurrentStep(stepNumber) {
    console.log('=== VALIDATING STEP', stepNumber, '===');

    const currentStep = document.querySelector(`.booking-step[data-step="${stepNumber}"]`);

    if (!currentStep) {
        return true;
    }

    let isValid = true;

    const requiredFields = currentStep.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        console.log('Field details:', {
            id: field.id,
            name: field.name,
            type: field.type,
            value: field.value,
            checked: field.checked,
            required: field.required
        });

        clearFieldError(field);

        // CHECKBOX
        if (field.type === 'checkbox') {

            if (!field.checked) {
                console.log('Checkbox validation failed:', field.name);
                isValid = false;
                showFieldError(field, 'This field is required');
            }

            return;
        }

        // RADIO
        if (field.type === 'radio') {

            const radioGroup = currentStep.querySelectorAll(
                `input[name="${field.name}"]` 
            );

            const checked = [...radioGroup].some(radio => radio.checked);

            if (!checked) {
                console.log('Radio validation failed:', field.name);
                isValid = false;
                showNotification('Please select an option', 'error');
            }

            return;
        }

        // NORMAL INPUTS
        if (!field.value || !field.value.trim()) {
            console.log('Input validation failed (empty):', field.name, 'value:', field.value);
            isValid = false;
            showFieldError(field, 'This field is required');

        } else if (field.type === 'email' && !isValidEmail(field.value)) {

            isValid = false;
            showFieldError(field, 'Please enter a valid email');

        } else if (field.type === 'tel' && !isValidPhone(field.value)) {

            isValid = false;
            showFieldError(field, 'Please enter a valid phone number');
        } else {
            console.log('Input validation passed:', field.name, 'value:', field.value);
        }
    });

    console.log('Validation result:', isValid);

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('field-error');
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function populateSummary() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const serviceType = form.querySelector('#serviceType');
    const serviceText = serviceType.options[serviceType.selectedIndex].text;
    document.getElementById('summaryService').textContent = serviceText;
    
    const pickupDate = form.querySelector('#pickupDate').value;
    const pickupTime = form.querySelector('#pickupTime').value;
    if (pickupDate && pickupTime) {
        const dateObj = new Date(pickupDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeObj = new Date(`2000-01-01T${pickupTime}`);
        const formattedTime = timeObj.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        document.getElementById('summaryDateTime').textContent = `${formattedDate} at ${formattedTime}`;
    }
    
    document.getElementById('summaryPickup').textContent = form.querySelector('#pickupLocation').value || '-';
    document.getElementById('summaryDropoff').textContent = form.querySelector('#dropoffLocation').value || '-';
    document.getElementById('summaryPassengers').textContent = form.querySelector('#passengers').value || '-';
    
    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    document.getElementById('summaryVehicle').textContent = selectedVehicle ? selectedVehicle.value : '-';
    
    const firstName = form.querySelector('#firstName').value;
    const lastName = form.querySelector('#lastName').value;
    document.getElementById('summaryName').textContent = `${firstName} ${lastName}`;
    document.getElementById('summaryEmail').textContent = form.querySelector('#email').value || '-';
    document.getElementById('summaryPhone').textContent = form.querySelector('#phone').value || '-';
}

async function submitBooking() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const bookingData = {};
    
    formData.forEach((value, key) => {
        bookingData[key] = value;
    });
    
    const bookingCode = generateBookingId();
    const dbData = {
        service_type: bookingData.serviceType,
        pickup_date: bookingData.pickupDate,
        pickup_time: bookingData.pickupTime,
        pickup_location: bookingData.pickupLocation,
        dropoff_location: bookingData.dropoffLocation,
        passengers: parseInt(bookingData.passengers) || 1,
        luggage_count: parseInt(bookingData.luggage) || 0,
        special_request: bookingData.specialRequests || null,
        vehicle: bookingData.vehicle,
        first_name: bookingData.firstName,
        last_name: bookingData.lastName || null,
        email: bookingData.email,
        phone_number: bookingData.phone,
        company_name: bookingData.company || null,
        booking_code: bookingCode,
        status: 'pending',
        payment_status: 'unpaid'
    };
    
    try {
        // Use the global notification system from main.js
        if (typeof addNotification === 'function') {
            addNotification('Booking Submission', 'Submitting your booking request...', 'info');
        }
        
        const { data, error } = await supabaseClient
            .from('Bookings')
            .insert([dbData])
            .select();
        
        if (error) {
            console.error(error);
            if (typeof addNotification === 'function') {
                addNotification('Booking Failed', 'Failed to submit booking. Please try again.', 'error');
            }
            return;
        }
        
        console.log('Booking inserted:', data);
        if (typeof addNotification === 'function') {
            addNotification(
                'Booking Successful',
                `Booking ${bookingCode} submitted successfully! We'll contact you soon.`,
                'success'
            );
        }

        await sendBookingConfirmationEmail(bookingData, bookingCode);

        showBookingConfirmation({
            ...bookingData,
            bookingId: bookingCode
        });

        form.reset();
        
    } catch (err) {
        console.error(err);
        if (typeof addNotification === 'function') {
            addNotification('System Error', 'An unexpected error occurred. Please try again.', 'error');
        }
    }
}

function generateBookingId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VL-${timestamp}-${random}`;
}

// saveBookingToLocalStorage() - Removed as we now use Supabase

function showBookingConfirmation(bookingData) {
    const modal = document.createElement('div');
    modal.classList.add('booking-modal');
    modal.innerHTML = `
        <div class="booking-modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p class="booking-id">Booking ID: <strong>${bookingData.bookingId}</strong></p>
            <p>Thank you for choosing SAN Transportation Services. A confirmation email has been sent to <strong>${bookingData.email}</strong></p>
            <p>Our team will contact you within 2 hours to confirm availability and provide a final quote.</p>
            <div class="modal-actions">
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
                <button class="btn btn-primary" onclick="this.closest('.booking-modal').remove()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadQuickBookingData() {
    const quickBookingData = localStorage.getItem('quickBookingData');
    
    if (!quickBookingData) return;
    
    try {
        const data = JSON.parse(quickBookingData);
        const form = document.getElementById('bookingForm');
        
        if (!form) return;
        
        if (data.pickupLocation) {
            const pickupField = form.querySelector('#pickupLocation');
            if (pickupField) pickupField.value = data.pickupLocation;
        }
        
        if (data.dropoffLocation) {
            const dropoffField = form.querySelector('#dropoffLocation');
            if (dropoffField) dropoffField.value = data.dropoffLocation;
        }
        
        if (data.pickupDate) {
            const dateField = form.querySelector('#pickupDate');
            if (dateField) dateField.value = data.pickupDate;
        }
        
        if (data.pickupTime) {
            const timeField = form.querySelector('#pickupTime');
            if (timeField) timeField.value = data.pickupTime;
        }
        
        if (data.passengers) {
            const passengersField = form.querySelector('#passengers');
            if (passengersField) passengersField.value = data.passengers;
        }
        
        localStorage.removeItem('quickBookingData');
        
    } catch (error) {
        console.error('Error loading quick booking data:', error);
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function setMinDate() {
    const dateInput = document.getElementById('pickupDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

async function sendBookingConfirmationEmail(bookingData, bookingCode) {
    try {
        const pickupDate = new Date(bookingData.pickupDate);
        const formattedDate = pickupDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const templateParams = {
            to_email: bookingData.email,
            to_name: `${bookingData.firstName} ${bookingData.lastName || ''}`.trim(),
            booking_code: bookingCode,
            service_type: bookingData.serviceType,
            vehicle: bookingData.vehicle,
            pickup_date: formattedDate,
            pickup_time: bookingData.pickupTime,
            pickup_location: bookingData.pickupLocation,
            dropoff_location: bookingData.dropoffLocation,
            passengers: bookingData.passengers
        };

        console.log('Sending booking confirmation email via EmailJS:', templateParams);

        if (typeof emailjs !== 'undefined' && emailjs.send) {
            await emailjs.send('service_g3l10te', 'template_bk9pui8', templateParams);
            console.log('Booking confirmation email sent successfully');
        } else {
            console.log('EmailJS not loaded - skipping email send');
        }

    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
    }
}

function preSelectVehicleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleParam = urlParams.get('vehicle');
    
    if (!vehicleParam) {
        console.log('No vehicle parameter found in URL');
        return;
    }
    
    console.log('Vehicle parameter found:', vehicleParam);
    
    const decodedVehicle = decodeURIComponent(vehicleParam);
    console.log('Decoded vehicle name:', decodedVehicle);
    
    setTimeout(() => {
        const vehicleRadio = document.querySelector(`input[name="vehicle"][value="${decodedVehicle}"]`);
        
        if (vehicleRadio) {
            vehicleRadio.checked = true;
            console.log('Vehicle selected:', decodedVehicle);
            
            const vehicleOption = vehicleRadio.closest('.vehicle-option');
            if (vehicleOption) {
                vehicleOption.classList.add('selected');
                document.querySelectorAll('.vehicle-option').forEach(option => {
                    if (option !== vehicleOption) {
                        option.classList.remove('selected');
                    }
                });
            }
            
            window.history.replaceState({}, '', window.location.pathname);
        } else {
            console.log('Vehicle not found in options:', decodedVehicle);
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    loadQuickBookingData();
    setMinDate();
    preSelectVehicleFromURL();
});
