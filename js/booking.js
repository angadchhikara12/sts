console.log('booking.js loaded');
try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (_) {}

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Handle both click and touch events for mobile
    function handleNextButton(e) {
        e.preventDefault();
        const currentStep = getCurrentStep();
        const nextStep = currentStep + 1;
        
        console.log('Next button clicked - Current step:', currentStep, 'Next step:', nextStep);
        const validationResult = validateCurrentStep(currentStep);
        console.log('Validation result:', validationResult);
        
        if (validationResult) {
            console.log('Validation passed - moving to step:', nextStep);
            goToStep(nextStep);
            
            if (nextStep === 5) {
                populateSummary();
            } else if (nextStep === 4) {
                populatePaymentPricing();
            }
        } else {
            console.log('Validation failed - staying on step:', currentStep);
        }
    }
    
    function handlePrevButton(e) {
        e.preventDefault();
        const currentStep = getCurrentStep();
        const prevStep = currentStep - 1;
        console.log('Previous button clicked - moving to:', prevStep);
        goToStep(prevStep);
    }
    
    nextButtons.forEach(button => {
        button.addEventListener('click', handleNextButton);
        button.addEventListener('touchstart', handleNextButton, { passive: false });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', handlePrevButton);
        button.addEventListener('touchstart', handlePrevButton, { passive: false });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const validationResult = validateCurrentStep(5);
        console.log('Form submit - validation result:', validationResult);
        
        if (validationResult) {
            console.log('Form validation passed - submitting booking');
            submitBooking();
        } else {
            console.log('Form validation failed - not submitting');
        }
    });
    
    // Also add touch support to the submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }, { passive: false });
    }
    
    const vehicleOptions = document.querySelectorAll('.vehicle-option input[type="radio"]');
    vehicleOptions.forEach(option => {
        option.addEventListener('change', function() {
            vehicleOptions.forEach(opt => {
                opt.closest('.vehicle-option').classList.remove('selected');
            });
            this.closest('.vehicle-option').classList.add('selected');
            populatePaymentPricing();
        });
    });

    setupServiceTypeHandler();
    setupHourlyDropoff();
    setupAddStop();
    setupChildSeat();
    setupProgressStepClicks();
}


function getCurrentStep() {
    const activeStep = document.querySelector('.booking-step.active');
    return activeStep ? parseInt(activeStep.getAttribute('data-step')) : 1;
}

function setupProgressStepClicks() {
    document.querySelectorAll('.progress-step').forEach(el => {
        el.addEventListener('click', function() {
            const targetStep = parseInt(this.dataset.step);
            let highest = 0;
            document.querySelectorAll('.progress-step').forEach(ps => {
                if (ps.classList.contains('completed') || ps.classList.contains('active')) {
                    highest = Math.max(highest, parseInt(ps.dataset.step));
                }
            });
            if (targetStep <= highest) {
                goToStep(targetStep);
            } else {
                showNotification('Please complete the current step first', 'error');
            }
        });
        el.style.cursor = 'pointer';
    });
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
    
    progressSteps.forEach(step => {
        if (step.classList.contains('active')) {
            step.classList.add('completed');
        }
        step.classList.remove('active');
    });
    progressSteps.forEach((step, index) => {
        if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
    
    const bookingContainer = document.querySelector('.booking-container');
    if (bookingContainer) {
        bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const mapWrapper = document.querySelector('.booking-map-wrapper');
    const formWrapper = document.querySelector('.booking-form-wrapper');
    if (mapWrapper && formWrapper) {
        if (stepNumber === 1 || stepNumber === 5) {
            mapWrapper.style.display = '';
            formWrapper.style.flex = '0 0 55%';
        } else {
            mapWrapper.style.display = 'none';
            formWrapper.style.flex = '1';
        }
    }

    const navBack = document.getElementById('navBack');
    const navNext = document.getElementById('navNext');
    const navSubmit = document.getElementById('navSubmit');
    if (navBack) navBack.style.display = stepNumber === 1 ? 'none' : '';
    if (navNext) navNext.style.display = stepNumber === 5 ? 'none' : '';
    if (navSubmit) navSubmit.style.display = stepNumber === 5 ? '' : 'none';
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

const SUFFIX_ABBR = { 'street':'St','st':'St','avenue':'Ave','ave':'Ave','road':'Rd','rd':'Rd',
    'boulevard':'Blvd','blvd':'Blvd','drive':'Dr','dr':'Dr','lane':'Ln','ln':'Ln',
    'way':'Wy','wy':'Wy','court':'Ct','ct':'Ct','circle':'Cir','cir':'Cir',
    'place':'Pl','pl':'Pl','terrace':'Ter','ter':'Ter','highway':'Hwy','hwy':'Hwy',
    'parkway':'Pkwy','pkwy':'Pkwy','turnpike':'Tpke','tpke':'Tpke','square':'Sq','sq':'Sq',
    'pike':'Pk','pk':'Pk','trace':'Tr','tr':'Tr','run':'Run' };
const DIR_ABBR = { 'north':'N','south':'S','east':'E','west':'W','northeast':'NE','northwest':'NW','southeast':'SE','southwest':'SW' };
const STATE_ABBR = { 'alabama':'AL','alaska':'AK','arizona':'AZ','arkansas':'AR','california':'CA',
    'colorado':'CO','connecticut':'CT','delaware':'DE','florida':'FL','georgia':'GA',
    'hawaii':'HI','idaho':'ID','illinois':'IL','indiana':'IN','iowa':'IA','kansas':'KS',
    'kentucky':'KY','louisiana':'LA','maine':'ME','maryland':'MD','massachusetts':'MA',
    'michigan':'MI','minnesota':'MN','mississippi':'MS','missouri':'MO','montana':'MT',
    'nebraska':'NE','nevada':'NV','new hampshire':'NH','new jersey':'NJ','new mexico':'NM',
    'new york':'NY','north carolina':'NC','north dakota':'ND','ohio':'OH','oklahoma':'OK',
    'oregon':'OR','pennsylvania':'PA','rhode island':'RI','south carolina':'SC',
    'south dakota':'SD','tennessee':'TN','texas':'TX','utah':'UT','vermont':'VT',
    'virginia':'VA','washington':'WA','west virginia':'WV','wisconsin':'WI','wyoming':'WY' };

function abbrevWord(w) {
    const lw = w.toLowerCase();
    if (SUFFIX_ABBR[lw]) return SUFFIX_ABBR[lw];
    if (DIR_ABBR[lw]) return DIR_ABBR[lw];
    if (lw === 'and') return '&';
    return w;
}

function abbreviateAddress(props) {
    const iata = props.iata || props.other_names?.iata;
    if (iata) {
        return [iata.toUpperCase(), props.city, props.state ? (STATE_ABBR[props.state.toLowerCase()] || props.state) : '', (props.country_code || '').toUpperCase()].filter(Boolean).join(', ');
    }
    const state = props.state ? (STATE_ABBR[props.state.toLowerCase()] || props.state) : '';
    const country = props.country_code ? props.country_code.toUpperCase() : '';
    const fullStreet = ((props.housenumber ? props.housenumber + ' ' : '') + (props.street || '')).toLowerCase().trim();
    if (props.name && props.name.toLowerCase() !== fullStreet) {
        return [props.name, props.city, state, country].filter(Boolean).join(', ');
    }
    let street = '';
    if (props.housenumber) street += props.housenumber + ' ';
    if (props.street) street += props.street.split(' ').map(abbrevWord).join(' ');
    return [street, props.city, state, country, props.postcode].filter(Boolean).join(', ');
}

function addressIcon(props) {
    if (props.iata || props.other_names?.iata) return 'fa-plane';
    const rt = (props.result_type || '').toLowerCase();
    const cats = (props.categories || []).map(c => c.toLowerCase());
    const all = [rt, ...cats].join(' ');
    if (all.includes('airport')) return 'fa-plane';
    if (all.includes('restaurant') || all.includes('food') || all.includes('cafe')) return 'fa-utensils';
    if (all.includes('hotel') || all.includes('lodging')) return 'fa-hotel';
    if (all.includes('house') || all.includes('residential')) return 'fa-home';
    if (all.includes('shop') || all.includes('mall') || all.includes('store')) return 'fa-shopping-bag';
    if (all.includes('school') || all.includes('university') || all.includes('college')) return 'fa-graduation-cap';
    if (all.includes('hospital') || all.includes('clinic') || all.includes('pharmacy')) return 'fa-hospital';
    if (all.includes('park') || all.includes('garden')) return 'fa-tree';
    if (all.includes('railway') || all.includes('train') || all.includes('bus')) return 'fa-train';
    if (all.includes('museum') || all.includes('theatre') || all.includes('cinema')) return 'fa-film';
    if (all.includes('stadium') || all.includes('sports')) return 'fa-futbol';
    if (all.includes('bank') || all.includes('post') || all.includes('landmark')) return 'fa-landmark';
    if (all.includes('tower') || all.includes('skyscraper')) return 'fa-building';
    if (all.includes('commercial') || all.includes('office') || all.includes('industrial')) return 'fa-building';
    if (all.includes('building') || all.includes('apartment')) return 'fa-building';
    const name = (props.name || '').toLowerCase();
    if (name.includes('tower')) return 'fa-building';
    if (all.includes('parking')) return 'fa-parking';
    if (all.includes('church') || all.includes('religious')) return 'fa-place-of-worship';
    if (all.includes('city') || all.includes('town') || all.includes('village')) return 'fa-city';
    if (all.includes('street') || all.includes('road')) return 'fa-road';
    if (all.includes('beach') || (props.name || '').toLowerCase().includes('beach')) return 'fa-umbrella-beach';
    if (all.includes('bar') || all.includes('pub')) return 'fa-beer';
    if (all.includes('gym') || all.includes('fitness')) return 'fa-dumbbell';
    return 'fa-map-marker-alt';
}

function calcPricing(miles, vehicle) {
    let rate = 3.50, fuelFixed = 0, gratFixed = 0;
    if (carsPricingCache && vehicle && carsPricingCache[vehicle]) {
        const c = carsPricingCache[vehicle];
        rate = c.rate;
        fuelFixed = c.fuelFixed;
        gratFixed = c.gratFixed;
    }
    const base = miles * rate;
    const total = base + fuelFixed + gratFixed + PRICING.flatFee;
    return { base, fuel: fuelFixed, rate, gratuity: gratFixed, flat: PRICING.flatFee, total };
}

function populatePaymentPricing() {
    const miles = lastRouteDistance / 1609.344;
    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    const vehicle = selectedVehicle ? selectedVehicle.value : null;
    const p = calcPricing(miles, vehicle);
    const f = n => '$' + n.toFixed(2);
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('paymentDistance', miles.toFixed(1) + ' mi');
    set('paymentEta', lastRouteDuration ? formatDuration(lastRouteDuration) : '-');
    set('paymentRate', '$' + p.rate.toFixed(2) + '/mi');
    set('paymentBaseFare', f(p.base));
    set('paymentFuelSurcharge', f(p.fuel));
    set('paymentGratuity', f(p.gratuity));
    set('paymentTotal', f(p.total));
}

function populateSummary() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const stEl = form.querySelector('#serviceType');
    const st = stEl?.value;
    const serviceText = stEl?.options[stEl.selectedIndex]?.text || '-';
    document.getElementById('summaryService').textContent = serviceText;

    const isHourlySame = st === 'hourly' && !document.getElementById('differentDropoff')?.checked;

    const pickupDate = form.querySelector('#pickupDate').value;
    const pickupTime = form.querySelector('#pickupTime').value;
    if (pickupDate && pickupTime) {
        const dateObj = new Date(pickupDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeObj = new Date(`2000-01-01T${pickupTime}`);
        const formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        document.getElementById('summaryDateTime').textContent = `${formattedDate} at ${formattedTime}`;
    }

    const pickupVal = form.querySelector('#pickupLocation')?.value || '-';
    document.getElementById('summaryPickup').textContent = pickupVal;

    let dropoffVal;
    if (isHourlySame) {
        dropoffVal = pickupVal + ' (Same as pickup)';
    } else {
        dropoffVal = form.querySelector('#dropoffLocation')?.value || '-';
    }
    document.getElementById('summaryDropoff').textContent = dropoffVal;

    document.getElementById('summaryPassengers').textContent = form.querySelector('#passengers')?.value || '-';

    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    document.getElementById('summaryVehicle').textContent = selectedVehicle ? selectedVehicle.value : '-';

    const firstName = form.querySelector('#firstName')?.value || '';
    const lastName = form.querySelector('#lastName')?.value || '';
    document.getElementById('summaryName').textContent = `${firstName} ${lastName}`.trim() || '-';
    document.getElementById('summaryEmail').textContent = form.querySelector('#email')?.value || '-';
    document.getElementById('summaryPhone').textContent = form.querySelector('#phone')?.value || '-';

    const accessible = document.getElementById('accessibleVehicle')?.checked;
    let extras = [];
    if (accessible) extras.push('Accessible vehicle');
    const seatEntries = document.querySelectorAll('#childSeatsContainer .child-seat-entry');
    let seatInfo = '';
    seatEntries.forEach(e => {
        const age = e.querySelector('select')?.value;
        const qty = e.querySelectorAll('select')[1]?.value;
        if (age) seatInfo += (seatInfo ? ', ' : '') + `${qty || 1}x ${age}`;
    });
    if (seatInfo) extras.push('Child seats: ' + seatInfo);
    const extrasEl = document.getElementById('summaryExtras');
    if (extrasEl) extrasEl.textContent = extras.length ? extras.join(' | ') : 'None';

    const miles = lastRouteDistance / 1609.344;
    const vehicle = selectedVehicle ? selectedVehicle.value : null;
    const p = calcPricing(miles, vehicle);
    const f = n => '$' + n.toFixed(2);
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    const distanceStr = miles >= 1 ? miles.toFixed(1) + ' mi' : (lastRouteDistance / 1000).toFixed(2) + ' km';
    set('summaryPricingDistance', distanceStr);
    set('summaryPricingRate', '$' + p.rate.toFixed(2) + '/mi');
    set('summaryPricingBase', f(p.base));
    set('summaryPricingFuel', f(p.fuel));
    set('summaryPricingGratuity', f(p.gratuity));
    set('summaryPricingFlat', f(p.flat));
    set('summaryPricingTotal', f(p.total));
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
    const miles = lastRouteDistance / 1609.344;
    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    const vehicle = selectedVehicle ? selectedVehicle.value : null;
    const p = calcPricing(miles, vehicle);

    const isHourlySame = bookingData.serviceType === 'hourly' && !document.getElementById('differentDropoff')?.checked;
    const dropoffLoc = isHourlySame ? bookingData.pickupLocation : bookingData.dropoffLocation;

    const stops = [];
    const stopInputs = document.querySelectorAll('[name^="stopLocation_"]');
    stopInputs.forEach(inp => { if (inp.value.trim()) stops.push(inp.value.trim()); });

    const seats = [];
    document.querySelectorAll('#childSeatsContainer .child-seat-entry').forEach(e => {
        const seatType = e.querySelector('select')?.value;
        const qty = e.querySelectorAll('select')[1]?.value;
        if (seatType) seats.push({ type: seatType, qty: parseInt(qty) || 1 });
    });

    const dbData = {
        service_type: bookingData.serviceType,
        pickup_date: bookingData.pickupDate,
        pickup_time: bookingData.pickupTime,
        pickup_location: bookingData.pickupLocation,
        dropoff_location: dropoffLoc,
        passengers: parseInt(bookingData.passengers) || 1,
        luggage_count: parseInt(bookingData.luggage) || 0,
        special_request: bookingData.specialRequests || null,
        vehicle: bookingData.vehicle,
        first_name: bookingData.firstName,
        last_name: bookingData.lastName || null,
        email: bookingData.email,
        phone_number: bookingData.phone,
        company_name: bookingData.company || null,
        stops: stops.length ? stops.join(' | ') : null,
        accessible_vehicle: document.getElementById('accessibleVehicle')?.checked || false,
        child_seats: seats.length ? JSON.stringify(seats) : null,
        distance_miles: parseFloat(miles.toFixed(1)),
        base_fare: parseFloat(p.base.toFixed(2)),
        fuel_surcharge: parseFloat(p.fuel.toFixed(2)),
        gratuity: parseFloat(p.gratuity.toFixed(2)),
        flat_fee: parseFloat(p.flat.toFixed(2)),
        total_price: parseFloat(p.total.toFixed(2)),
        booking_code: bookingCode,
        status: 'pending',
        payment_status: 'paid'
    };
    
    try {
        if (typeof addNotification === 'function') {
            addNotification('Booking Submission', 'Processing payment...', 'info');
        }

        // Process payment via Helcim
        const cardName = document.getElementById('cardName')?.value || '';
        const cardNumber = document.getElementById('cardNumber')?.value?.replace(/\s/g, '') || '';
        const cardExpiry = document.getElementById('cardExpiry')?.value?.replace('/', '') || '';
        const cardCvc = document.getElementById('cardCvc')?.value || '';
        const helcimAmount = parseFloat(p.total.toFixed(2));

        if (!cardNumber || !cardExpiry || !cardCvc) {
            showBookingError('Please fill in all card details.');
            return;
        }

        const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => ({ json: () => ({ ip: '127.0.0.1' }) }));
        const ipData = await ipResponse.json();
        const customerIp = ipData.ip || '127.0.0.1';

        const helcimResponse = await fetch(HELCIM_API_URL, {
            method: 'POST',
            headers: {
                'api-token': HELCIM_API_TOKEN,
                'Content-Type': 'application/json',
                'idempotency-key': crypto.randomUUID()
            },
            body: JSON.stringify({
                ipAddress: customerIp,
                ecommerce: true,
                currency: 'USD',
                amount: helcimAmount,
                cardData: {
                    cardHolderName: cardName,
                    cardNumber: cardNumber,
                    cardExpiry: cardExpiry,
                    cardCvv: cardCvc
                }
            })
        });

        const helcimResult = await helcimResponse.json();

        if (!helcimResponse.ok || helcimResult.status !== 'APPROVED') {
            const errMsg = helcimResult.errors?.[0] || helcimResult.message || 'Payment was declined. Please check your card details and try again.';
            showBookingError(errMsg);
            return;
        }

        dbData.payment_status = 'paid';
        dbData.helcim_transaction_id = helcimResult.transactionId || null;

        if (typeof addNotification === 'function') {
            addNotification('Booking Submission', 'Payment successful! Saving your booking...', 'info');
        }
        
        if (!supabaseClient) {
            showBookingError('Database connection not available. Please try again or contact us at info@sants.us');
            return;
        }
        const { data, error } = await supabaseClient
            .from('Bookings')
            .insert([dbData])
            .select();
        
        if (error) {
            console.error(error);
            showBookingError('We could not save your booking information. Please try again or contact us at info@sants.us');
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

        clearSavedFormData();
        form.reset();

        showBookingConfirmation({
            ...bookingData,
            bookingId: bookingCode
        });
        
    } catch (err) {
        console.error(err);
        showBookingError('An unexpected error occurred. Please try again or contact us at info@sants.us');
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
        <div class="booking-modal-content success">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p class="booking-id">Booking ID: <strong>${bookingData.bookingId}</strong></p>
            <p>Thank you for choosing SAN Transportation Services. A confirmation email has been sent to <strong>${bookingData.email}</strong></p>
            <p>Our team will contact you within 2 hours to confirm availability and provide a final quote.</p>
            <div class="booking-notice" style="background-color: #fff3cd; color: #856404; padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 14px; border-left: 4px solid #ffc107;">
                <strong>Notice:</strong> If you haven't seen the confirmation email, please consider checking your Spam folder.
            </div>
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

function showBookingError(errorMessage) {
    const modal = document.createElement('div');
    modal.classList.add('booking-modal');
    modal.innerHTML = `
        <div class="booking-modal-content error">
            <div class="modal-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h2>Booking Failed</h2>
            <div class="error-message-box">
                <p>${errorMessage}</p>
            </div>
            <p>Please try again or contact us directly at <strong>info@sants.us</strong></p>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.booking-modal').remove()">Try Again</button>
                <a href="contact.html" class="btn btn-primary">Contact Us</a>
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

const FORM_SAVE_KEY = 'sants_booking_form';

function saveFormData() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    const data = {};
    form.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.name && el.type !== 'radio' && el.type !== 'checkbox') {
            data[el.name] = el.value;
        }
    });
    form.querySelectorAll('input[type="checkbox"]').forEach(el => {
        if (el.name) data['_cb_' + el.name] = el.checked;
    });
    form.querySelectorAll('input[type="radio"]:checked').forEach(el => {
        if (el.name) data['_radio_' + el.name] = el.value;
    });
    localStorage.setItem(FORM_SAVE_KEY, JSON.stringify(data));
}

function restoreFormData() {
    console.log('restoreFormData called');
    const raw = localStorage.getItem(FORM_SAVE_KEY);
    if (!raw) { console.log('restoreFormData: no saved data'); return; }
    console.log('restoreFormData: found data, restoring...');
    try {
        const data = JSON.parse(raw);
        const form = document.getElementById('bookingForm');
        if (!form) return;
        Object.keys(data).forEach(key => {
            if (key.startsWith('_cb_')) {
                const el = form.querySelector(`[name="${key.slice(4)}"]`);
                if (el && el.type === 'checkbox') el.checked = data[key];
            } else if (key.startsWith('_radio_')) {
                const el = form.querySelector(`[name="${key.slice(7)}"][value="${data[key]}"]`);
                if (el) el.checked = true;
            } else if (!key.startsWith('_map_')) {
                const el = form.querySelector(`[name="${key}"]`);
                if (el) el.value = data[key];
            }
        });
        // Sync custom pickers and service type handler
        ['serviceType', 'pickupDate', 'pickupTime'].forEach(name => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el) el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        // Directly trigger service type UI update (change event may not always propagate reliably)
        updateFormForServiceType();
    } catch (e) { console.error('restoreFormData error:', e); }
}

function clearSavedFormData() {
    localStorage.removeItem(FORM_SAVE_KEY);
    clearRoute();
    pickupCoords = null;
    dropoffCoords = null;
    stopsCoords = [];
    lastRouteDistance = 0;
}

function setupFormAutoSave() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    form.addEventListener('input', saveFormData);
    form.addEventListener('change', saveFormData);
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
            name: `${bookingData.firstName} ${bookingData.lastName || ''}`.trim(),
            email: bookingData.email,
            order_id: bookingCode,
            service: bookingData.serviceType,
            pickup: bookingData.pickupLocation,
            dropoff: bookingData.dropoffLocation,
            date: formattedDate,
            time: bookingData.pickupTime,
            passengers: bookingData.passengers
        };

        console.log('Sending booking confirmation email via EmailJS:', templateParams);

        if (typeof emailjs === 'undefined' || !emailjs.send) {
            console.error('EmailJS is not loaded or not available');
            throw new Error('EmailJS is not loaded. Please refresh the page and try again.');
        }

        await emailjs.send('service_g3l10te', 'template_bk9pui8', templateParams, EMAILJS_PUBLIC_KEY);
        console.log('Booking confirmation email sent successfully');

    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        throw error;
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

// ==========================================
// MAP FUNCTIONALITY (MapLibre GL)
// ==========================================

// GEOAPIFY_KEY loaded from config.js
const STADIA_KEY = 'cb479201-3aee-4ec1-b890-296f8503d0d1';
let pickupCoords = null, dropoffCoords = null;
let stopsCoords = [];
let lastRouteDistance = 0;
let lastRouteDuration = 0;
const PRICING = { flatFee: 25.00 };
let carsPricingCache = null;

async function loadCarsPricing() {
    try {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/cars?select=name,vehicle_rate,fuel_surcharge,standard_gratuity`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (!resp.ok) return;
        const cars = await resp.json();
        carsPricingCache = {};
        cars.forEach(c => {
            carsPricingCache[c.name] = {
                rate: parseFloat(c.vehicle_rate) || 3.50,
                fuelFixed: parseFloat(c.fuel_surcharge) || 0,
                gratFixed: parseFloat(c.standard_gratuity) || 0
            };
        });
    } catch (e) {
        console.error('Failed to load car pricing:', e);
    }
}



function geocodeAddress(query) {
    if (!query || query.length < 1) return Promise.resolve([]);
    const key = query.toLowerCase().trim();
    if (geocodeCache.has(key)) return Promise.resolve(geocodeCache.get(key));
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}&limit=5`;
    return fetch(url)
        .then(r => r.json())
        .then(data => {
            const results = data.features || [];
            geocodeCache.set(key, results);
            if (geocodeCache.size > 100) {
                const first = geocodeCache.keys().next().value;
                geocodeCache.delete(first);
            }
            return results;
        })
        .catch(() => []);
}

function renderGeocodeResults(input, suggestions, results, type) {
    suggestions.innerHTML = '';
    if (!results || results.length === 0) { suggestions.classList.remove('active'); return; }
    const cat = input.dataset.geoCategory;
    if (cat) {
        console.log('Filtering for category:', cat, 'total results:', results.length);
        results = results.filter(r => {
            const p = r.properties || {};
            if (p.result_type === cat) return true;
            if (p.categories && p.categories.includes(cat)) return true;
            if ((p.formatted || '').toLowerCase().includes('airport')) return true;
            return false;
        });
        results.sort((a, b) => {
            const aIata = a.properties?.iata || a.properties?.other_names?.iata ? 1 : 0;
            const bIata = b.properties?.iata || b.properties?.other_names?.iata ? 1 : 0;
            return bIata - aIata;
        });
        console.log('Filtered results:', results.length, results.map(r => r.properties?.formatted));
        if (results.length === 0) { suggestions.classList.remove('active'); return; }
    }
    results = results.filter(r => {
        const p = r.properties || {};
        return p.country_code === 'us' && p.state_code === 'CA';
    });
    if (results.length === 0) { suggestions.classList.remove('active'); return; }
    results.forEach(r => {
        const div = document.createElement('div');
        div.className = 'address-suggestion-item';
        div.innerHTML = `<i class="fas ${addressIcon(r.properties)}"></i> ${abbreviateAddress(r.properties)}`;
        div.dataset.lat = r.properties.lat;
        div.dataset.lon = r.properties.lon;
        div.addEventListener('click', function() {
            input.value = abbreviateAddress(r.properties);
            suggestions.classList.remove('active');
            suggestions.innerHTML = '';
            const lat = parseFloat(r.properties.lat);
            const lng = parseFloat(r.properties.lon);
            if (type === 'pickup') {
                pickupCoords = { lat, lng };
            } else if (type === 'dropoff') {
                dropoffCoords = { lat, lng };
            } else if (type.startsWith('stop_')) {
                const idx = parseInt(type.split('_')[1]) - 1;
                stopsCoords[idx] = { lat, lng };
            }
            if (type === 'pickup' || type === 'dropoff' || type.startsWith('stop_')) {
                updateRoute();
            }
        });
        suggestions.appendChild(div);
    });
    suggestions.classList.add('active');
}

function setupAddressAutocomplete(inputId, suggestionsId, type) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);
    if (!input || !suggestions) return;

    function triggerGeocode() {
        const query = input.value.trim();
        if (query.length < 1) { suggestions.classList.remove('active'); suggestions.innerHTML = ''; return; }
        geocodeAddress(query).then(results => {
            renderGeocodeResults(input, suggestions, results, type);
        });
    }

    input.addEventListener('input', function() {
        if (type === 'pickup') {
            pickupCoords = null;
        } else if (type === 'dropoff') {
            dropoffCoords = null;
        }
        if (type === 'pickup' || type === 'dropoff') {
            clearRoute();
            document.getElementById('mapDistance').textContent = '';
            document.getElementById('mapTime').textContent = '';
        }
        triggerGeocode();
    });

    input.addEventListener('focus', function() {
        const query = input.value.trim();
        if (query.length < 1) { suggestions.classList.remove('active'); suggestions.innerHTML = ''; return; }
        geocodeAddress(query).then(results => {
            renderGeocodeResults(input, suggestions, results, type);
        });
    });

    input.addEventListener('keydown', function(e) {
        const items = suggestions.querySelectorAll('.address-suggestion-item');
        if (items.length === 0) return;
        const active = suggestions.querySelector('.address-suggestion-item.active');
        let idx = -1;
        if (active) idx = Array.from(items).indexOf(active);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items.forEach(i => i.classList.remove('active'));
            const next = idx >= items.length - 1 ? 0 : idx + 1;
            items[next].classList.add('active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items.forEach(i => i.classList.remove('active'));
            const prev = idx <= 0 ? items.length - 1 : idx - 1;
            items[prev].classList.add('active');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (active) { active.click(); }
        } else if (e.key === 'Escape') {
            suggestions.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('active');
        }
    });
}

function setupBillingAutocomplete() {
    const input = document.getElementById('billingAddress');
    const suggestions = document.getElementById('billingSuggestions');
    if (!input || !suggestions) return;

    function triggerGeocode() {
        const query = input.value.trim();
        if (query.length < 1) { suggestions.classList.remove('active'); suggestions.innerHTML = ''; return; }
        geocodeAddress(query).then(results => {
            suggestions.innerHTML = '';
            if (!results || results.length === 0) { suggestions.classList.remove('active'); return; }
            results = results.filter(r => {
                const p = r.properties || {};
                return p.country_code === 'us' || p.country_code === 'ca';
            });
            if (results.length === 0) { suggestions.classList.remove('active'); return; }
            results.forEach(r => {
                const div = document.createElement('div');
                div.className = 'address-suggestion-item';
                div.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${r.properties.formatted || r.properties.address_line1 || r.properties.name}`;
                div.addEventListener('click', function() {
                    const p = r.properties || {};
                    const raw = input.value;
                    const streetBase = p.address_line1 || p.name || p.formatted || '';
                    let aptSuffix = '';
                    const commaIdx = raw.indexOf(',');
                    if (commaIdx > 0 && commaIdx < raw.length - 1) {
                        const after = raw.substring(commaIdx + 1).trim();
                        if (after && !after.toLowerCase().includes(streetBase.toLowerCase())) {
                            aptSuffix = ', ' + after;
                        }
                    }
                    document.getElementById('billingAddress').value = streetBase + aptSuffix;
                    if (p.city) document.getElementById('billingCity').value = p.city;
                    if (p.state || p.state_code) document.getElementById('billingState').value = p.state || p.state_code;
                    if (p.postcode) document.getElementById('billingZip').value = p.postcode;
                    if (p.country) document.getElementById('billingCountry').value = p.country;
                    suggestions.classList.remove('active');
                    suggestions.innerHTML = '';
                });
                suggestions.appendChild(div);
            });
            suggestions.classList.add('active');
        });
    }

    input.addEventListener('input', triggerGeocode);

    input.addEventListener('focus', function() {
        const query = input.value.trim();
        if (query.length < 1) { suggestions.classList.remove('active'); suggestions.innerHTML = ''; return; }
        geocodeAddress(query).then(results => {
            suggestions.innerHTML = '';
            if (!results || results.length === 0) { suggestions.classList.remove('active'); return; }
            results = results.filter(r => {
                const p = r.properties || {};
                return p.country_code === 'us' || p.country_code === 'ca';
            });
            if (results.length === 0) { suggestions.classList.remove('active'); return; }
            results.forEach(r => {
                const div = document.createElement('div');
                div.className = 'address-suggestion-item';
                div.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${r.properties.formatted || r.properties.address_line1 || r.properties.name}`;
                div.addEventListener('click', function() {
                    const p = r.properties || {};
                    const raw = input.value;
                    const streetBase = p.address_line1 || p.name || p.formatted || '';
                    let aptSuffix = '';
                    const commaIdx = raw.indexOf(',');
                    if (commaIdx > 0 && commaIdx < raw.length - 1) {
                        const after = raw.substring(commaIdx + 1).trim();
                        if (after && !after.toLowerCase().includes(streetBase.toLowerCase())) {
                            aptSuffix = ', ' + after;
                        }
                    }
                    document.getElementById('billingAddress').value = streetBase + aptSuffix;
                    if (p.city) document.getElementById('billingCity').value = p.city;
                    if (p.state || p.state_code) document.getElementById('billingState').value = p.state || p.state_code;
                    if (p.postcode) document.getElementById('billingZip').value = p.postcode;
                    if (p.country) document.getElementById('billingCountry').value = p.country;
                    suggestions.classList.remove('active');
                    suggestions.innerHTML = '';
                });
                suggestions.appendChild(div);
            });
            suggestions.classList.add('active');
        });
    });

    input.addEventListener('keydown', function(e) {
        const items = suggestions.querySelectorAll('.address-suggestion-item');
        if (items.length === 0) return;
        const active = suggestions.querySelector('.address-suggestion-item.active');
        let idx = -1;
        if (active) idx = Array.from(items).indexOf(active);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items.forEach(i => i.classList.remove('active'));
            const next = idx >= items.length - 1 ? 0 : idx + 1;
            items[next].classList.add('active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items.forEach(i => i.classList.remove('active'));
            const prev = idx <= 0 ? items.length - 1 : idx - 1;
            items[prev].classList.add('active');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (active) active.click();
        } else if (e.key === 'Escape') {
            suggestions.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('active');
        }
    });
}

async function getRoute(pickup, dropoff, stops) {
    const waypoints = [pickup, ...(stops || []).filter(Boolean), dropoff];
    const geoWaypoints = waypoints.map(p => `${p.lat},${p.lng}`).join('|');
    const geoUrl = `https://api.geoapify.com/v1/routing?waypoints=${geoWaypoints}&mode=drive&traffic=approximated&apiKey=${GEOAPIFY_KEY}`;
    try {
        const resp = await fetch(geoUrl);
        const data = await resp.json();
        const feat = data?.features?.[0];
        if (feat && (feat.geometry?.coordinates?.length || feat.geometry?.coordinates?.[0]?.length)) {
            return {
                geometry: feat.geometry,
                distance: feat.properties.distance.value,
                duration: feat.properties.time.value,
                steps: feat.properties.legs?.[0]?.steps || []
            };
        }
    } catch (_) {}

    const osmWaypoints = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
    const osmUrl = `https://router.project-osrm.org/route/v1/driving/${osmWaypoints}?overview=full&geometries=geojson`;
    try {
        const resp = await fetch(osmUrl);
        const data = await resp.json();
        if (data?.code === 'Ok' && data.routes?.[0]) {
            const r = data.routes[0];
            return { geometry: r.geometry, distance: r.distance, duration: r.duration, steps: [] };
        }
    } catch (_) {}
    return null;
}

function clearRoute() {
}

function formatDistance(meters) {
    if (!meters) return '';
    const miles = meters / 1609.344;
    if (miles >= 1) return miles.toFixed(1) + ' mi';
    return (meters / 1000).toFixed(2) + ' km';
}

function formatDuration(seconds) {
    if (!seconds) return '';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return hrs + 'h ' + mins + 'm';
    return mins + ' min';
}

function updateRoute() {
    const distEl = document.getElementById('mapDistance');
    const timeEl = document.getElementById('mapTime');
    if (!distEl || !timeEl) return;

    if (!pickupCoords || !dropoffCoords) {
        distEl.textContent = '';
        timeEl.textContent = '';
        return;
    }

    console.log('updateRoute: fetching route...');
    getRoute(pickupCoords, dropoffCoords, stopsCoords).then(result => {
        let distance, duration;

        if (result) {
            distance = result.distance;
            duration = result.duration;
            const isMulti = result.geometry.type === 'MultiLineString';
            const routeCoords = isMulti ? result.geometry.coordinates.flat() : result.geometry.coordinates;
            console.log('Route:', routeCoords.length, 'pts,', (result.steps || []).length, 'steps, multi:', isMulti);
        }

        if (!distance && pickupCoords && dropoffCoords) {
            const R = 6371000;
            const dLat = (dropoffCoords.lat - pickupCoords.lat) * Math.PI / 180;
            const dLon = (dropoffCoords.lng - pickupCoords.lng) * Math.PI / 180;
            const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(pickupCoords.lat*Math.PI/180)*Math.cos(dropoffCoords.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
            distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1.35;
            duration = distance / 13.9;
            console.log('updateRoute: fallback distance', distance, 'duration', duration);
        }

        lastRouteDistance = distance > 0 ? distance : lastRouteDistance;
        lastRouteDuration = duration > 0 ? duration : lastRouteDuration;
        distEl.textContent = distance ? 'Distance: ' + formatDistance(distance) : '';
        timeEl.textContent = duration ? 'Est. time: ' + formatDuration(duration) : '';
        populatePaymentPricing();
    });
}



let stopCount = 0;
const geocodeCache = new Map();

function updateFormForServiceType() {
    const st = document.getElementById('serviceType')?.value;
    const dg = document.getElementById('dropoffGroup');
    const ddg = document.getElementById('differentDropoffGroup');
    const asg = document.getElementById('addStopGroup');
    const pk = document.getElementById('pickupLocation');
    const dr = document.getElementById('dropoffLocation');
    const sc = document.getElementById('stopsContainer');
    const diffCb = document.getElementById('differentDropoff');
    if (sc) sc.innerHTML = '';
    stopsCoords = [];
    stopCount = 0;

    if (dg) { dg.style.display = ''; if (dr) dr.required = true; }
    if (ddg) ddg.style.display = 'none';
    if (asg) asg.style.display = 'none';
    if (pk) { pk.dataset.geoCategory = ''; pk.placeholder = 'Enter pickup address'; }
    if (dr) { dr.dataset.geoCategory = ''; dr.placeholder = 'Enter destination address'; }
    if (diffCb) diffCb.checked = false;

    if (st === 'airport-pickup') {
        if (pk) { pk.dataset.geoCategory = 'airport'; pk.placeholder = 'Search airports (LAX, SFO, SJC, OAK...)'; }
    } else if (st === 'airport-dropoff') {
        if (dr) { dr.dataset.geoCategory = 'airport'; dr.placeholder = 'Search airports (LAX, SFO, SJC, OAK...)'; }
    } else if (st === 'hourly') {
        if (ddg) ddg.style.display = '';
        if (dg) dg.style.display = 'none';
        if (dr) dr.required = false;
    }
    if (st && st !== '') {
        if (asg) asg.style.display = '';
    }
}

function setupServiceTypeHandler() {
    const sel = document.getElementById('serviceType');
    if (!sel) return;
    sel.addEventListener('change', updateFormForServiceType);
    setTimeout(updateFormForServiceType, 50);
}

function setupHourlyDropoff() {
    const cb = document.getElementById('differentDropoff');
    if (!cb) return;
    cb.addEventListener('change', function() {
        const dg = document.getElementById('dropoffGroup');
        const dr = document.getElementById('dropoffLocation');
        if (this.checked) {
            if (dg) dg.style.display = '';
            if (dr) dr.required = true;
        } else {
            if (dg) dg.style.display = 'none';
            if (dr) { dr.required = false; dr.value = ''; }
        }
        if (pickupCoords && !this.checked) {
            dropoffCoords = null;
        }
        clearRoute();
        document.getElementById('mapDistance').textContent = '';
        document.getElementById('mapTime').textContent = '';
    });
}

function setupAddStop() {
    const btn = document.getElementById('addStopBtn');
    if (!btn) return;
    btn.addEventListener('click', function() {
        stopCount++;
        const container = document.getElementById('stopsContainer');
        const div = document.createElement('div');
        div.className = 'stop-entry';
        div.draggable = true;
        div.innerHTML = `
            <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
            <span class="stop-number-badge">${stopCount}</span>
            <div class="form-group">
                <input type="text" id="stopLocation_${stopCount}" name="stopLocation_${stopCount}" placeholder="Stop ${stopCount} address" autocomplete="off">
                <div class="address-suggestions" id="stopSuggestions_${stopCount}"></div>
            </div>
            <button type="button" class="remove-stop-btn" data-stop="${stopCount}"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(div);
        setupAddressAutocomplete(`stopLocation_${stopCount}`, `stopSuggestions_${stopCount}`, `stop_${stopCount}`);
        div.querySelector('.remove-stop-btn').addEventListener('click', function() {
            const idx = parseInt(this.dataset.stop) - 1;
            stopsCoords[idx] = null;
            div.remove();
            if (pickupCoords && dropoffCoords) { updateRoute(); }
        });
        div.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', Array.from(container.children).indexOf(div));
            div.style.opacity = '0.4';
        });
        div.addEventListener('dragend', function() {
            div.style.opacity = '1';
            container.querySelectorAll('.stop-entry').forEach(el => el.classList.remove('drag-over'));
        });
        div.addEventListener('dragover', function(e) {
            e.preventDefault();
            container.querySelectorAll('.stop-entry').forEach(el => el.classList.remove('drag-over'));
            div.classList.add('drag-over');
        });
        div.addEventListener('dragleave', function() {
            div.classList.remove('drag-over');
        });
        div.addEventListener('drop', function(e) {
            e.preventDefault();
            container.querySelectorAll('.stop-entry').forEach(el => el.classList.remove('drag-over'));
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const toIdx = Array.from(container.children).indexOf(div);
            if (fromIdx === toIdx) return;
            const items = Array.from(container.children);
            const [moved] = items.splice(fromIdx, 1);
            items.splice(toIdx, 0, moved);
            container.innerHTML = '';
            items.forEach(el => container.appendChild(el));
            reindexStops();
            if (pickupCoords && dropoffCoords) { updateRoute(); }
        });
    });
}

function reindexStops() {
    const entries = document.querySelectorAll('#stopsContainer .stop-entry');
    const newCoords = [];
    entries.forEach((el, i) => {
        const num = i + 1;
        const badge = el.querySelector('.stop-number-badge');
        if (badge) badge.textContent = num;
        const inp = el.querySelector('input');
        if (inp) { inp.id = `stopLocation_${num}`; inp.name = `stopLocation_${num}`; inp.placeholder = `Stop ${num} address`; }
        const oldIdx = parseInt(el.querySelector('.remove-stop-btn')?.dataset?.stop || '1') - 1;
        if (el.querySelector('.remove-stop-btn')) el.querySelector('.remove-stop-btn').dataset.stop = num;
        const suggests = el.querySelector('.address-suggestions');
        if (suggests) suggests.id = `stopSuggestions_${num}`;
        newCoords.push(stopsCoords[oldIdx] || null);
    });
    stopsCoords = newCoords;
}

function setupChildSeat() {
    const btn = document.getElementById('addChildSeatBtn');
    if (!btn) return;
    const container = document.getElementById('childSeatsContainer');
    let seatCount = 0;
    btn.addEventListener('click', function() {
        seatCount++;
        const div = document.createElement('div');
        div.className = 'child-seat-entry';
        div.innerHTML = `
            <span style="color:var(--gold-accent);font-weight:600">#${seatCount}</span>
            <select name="childSeatType_${seatCount}" required>
                <option value="">Seat type</option>
                <option value="rear-facing">Rear Facing Seat (Infant)</option>
                <option value="forward-facing">Forward Facing Seat (Toddler)</option>
                <option value="booster">Booster</option>
            </select>
            <select name="childSeatQty_${seatCount}">
                <option value="1">1 seat</option>
                <option value="2">2 seats</option>
            </select>
            <button type="button" class="remove-btn" title="Remove"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(div);
        div.querySelector('.remove-btn').addEventListener('click', function() {
            div.remove();
        });
    });
}

function setupCardFormatting() {
    const cardNum = document.getElementById('cardNumber');
    if (cardNum) {
        cardNum.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        });
    }
    const cardExp = document.getElementById('cardExpiry');
    if (cardExp) {
        cardExp.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').slice(0, 4);
            if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
            this.value = v;
        });
    }
    const cardCvc = document.getElementById('cardCvc');
    if (cardCvc) {
        cardCvc.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }
    const cardZip = document.getElementById('billingZip');
    if (cardZip) {
        cardZip.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCarsPricing();
    initBookingForm();
    loadQuickBookingData();
    setupFormAutoSave();
    setMinDate();
    preSelectVehicleFromURL();
    restoreFormData();
    setupAddressAutocomplete('pickupLocation', 'pickupSuggestions', 'pickup');
    setupAddressAutocomplete('dropoffLocation', 'dropoffSuggestions', 'dropoff');
    setupBillingAutocomplete();
    setupCardFormatting();
});
