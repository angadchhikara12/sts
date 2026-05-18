document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFleetFilters();
    initTestimonialsSlider();
    initQuickBookingForm();
    initNotificationBell();
    initCustomDropdowns();
    initCustomTimePickers();
    initCustomDatePickers();
    initCounterAnimation();
    initHeroSlideshow();
    initHeroVideo();
});

// Notification System
let notifications = [];
let notificationIdCounter = 0;

function initNotificationBell() {
    // Desktop notification bell
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationList = document.getElementById('notificationList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    // Mobile notification bell
    const mobileNotificationBell = document.getElementById('mobileNotificationBell');
    const mobileNotificationDropdown = document.getElementById('mobileNotificationDropdown');
    const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');
    const mobileNotificationList = document.getElementById('mobileNotificationList');
    const mobileClearAllBtn = document.getElementById('mobileClearAllBtn');
    
    // Initialize desktop bell
    if (notificationBell) {
        // Toggle dropdown on bell click
        notificationBell.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
        });
        
        // Prevent clicks inside dropdown from toggling it
        notificationDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Clear all notifications
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                clearAllNotifications();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationBell.contains(e.target)) {
                notificationDropdown.classList.remove('active');
            }
        });
    }
    
    // Initialize mobile bell
    if (mobileNotificationBell) {
        // Toggle dropdown on bell click
        mobileNotificationBell.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNotificationDropdown.classList.toggle('active');
        });
        
        // Prevent clicks inside dropdown from toggling it
        mobileNotificationDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Clear all notifications
        if (mobileClearAllBtn) {
            mobileClearAllBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                clearAllNotifications();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNotificationBell.contains(e.target)) {
                mobileNotificationDropdown.classList.remove('active');
            }
        });
    }
    
    // Load existing notifications
    updateNotificationDisplay();
}

function addNotification(title, message, type = 'info') {
    const notification = {
        id: ++notificationIdCounter,
        title: title,
        message: message,
        type: type,
        timestamp: new Date().toISOString()
    };
    
    notifications.unshift(notification); // Add to beginning
    if (notifications.length > 10) {
        notifications = notifications.slice(0, 10); // Keep only 10 most recent
    }
    
    // Show popup notification
    showNotificationPopup(notification);
    
    // Update dropdown
    updateNotificationDisplay();
}

function showNotificationPopup(notification) {
    // Get notification bell position
    const notificationBell = document.getElementById('notificationBell');
    if (!notificationBell) return;
    
    const bellRect = notificationBell.getBoundingClientRect();
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = `notification-popup notification-${notification.type}`;
    popup.innerHTML = `
        <div class="notification-popup-content">
            <div class="notification-popup-header">
                <span class="notification-popup-title">${notification.title}</span>
                <button class="notification-popup-close">&times;</button>
            </div>
            <div class="notification-popup-message">${notification.message}</div>
        </div>
    `;
    
    // Position popup
    popup.style.position = 'fixed';
    popup.style.top = `${bellRect.bottom + 10}px`;
    popup.style.right = `${window.innerWidth - bellRect.right}px`;
    popup.style.zIndex = '2000';
    
    // Add to page
    document.body.appendChild(popup);
    
    // Animate in
    setTimeout(() => popup.classList.add('active'), 10);
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        popup.classList.remove('active');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }, 2000);
    
    // Close button handler
    const closeBtn = popup.querySelector('.notification-popup-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        });
    }
}

function updateNotificationDisplay() {
    // Desktop elements
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationList = document.getElementById('notificationList');
    
    // Mobile elements
    const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');
    const mobileNotificationList = document.getElementById('mobileNotificationList');
    
    // Update badge
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Update desktop badge
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount > 0 ? unreadCount : '';
    }
    
    // Update mobile badge
    if (mobileNotificationBadge) {
        mobileNotificationBadge.textContent = unreadCount > 0 ? unreadCount : '';
    }
    
    // Generate notification HTML
    let notificationHTML;
    if (notifications.length === 0) {
        notificationHTML = `
            <div class="no-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
            </div>
        `;
    } else {
        notificationHTML = notifications.map(notification => `
            <div class="notification-item" data-id="${notification.id}">
                <div class="notification-item-header">
                    <span class="notification-item-title">${notification.title}</span>
                    <span class="notification-item-time">${formatNotificationTime(notification.timestamp)}</span>
                </div>
                <div class="notification-item-message">${notification.message}</div>
            </div>
        `).join('');
    }
    
    // Update desktop dropdown list
    if (notificationList) {
        notificationList.innerHTML = notificationHTML;
    }
    
    // Update mobile dropdown list
    if (mobileNotificationList) {
        mobileNotificationList.innerHTML = notificationHTML;
    }
}

function clearAllNotifications() {
    notifications = [];
    updateNotificationDisplay();
}

function formatNotificationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} min ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }
        document.body.classList.toggle('menu-open');
    });
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
            document.body.classList.remove('menu-open');
        });
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

function initFleetFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    if (filterButtons.length === 0 || vehicleCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            vehicleCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    const dots = document.querySelectorAll('.slider-dot');
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    setInterval(nextSlide, 5000);
}

function initQuickBookingForm() {
    const form = document.getElementById('quickBookingForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        localStorage.setItem('quickBookingData', JSON.stringify(data));
        
        window.location.href = 'booking.html';
    });
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function initHeroSlideshow() {
    const slideshow = document.querySelector('.hero-slideshow');
    
    if (!slideshow) return;
    
    const slides = slideshow.querySelectorAll('.hero-slide');
    
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(showNextSlide, 5000);
}

function initHeroVideo() {
    const heroVideo = document.getElementById('heroVideo');
    const heroPoster = document.querySelector('.hero-poster');
    
    if (!heroVideo) return;

    heroVideo.classList.add('video-hidden');
    
    function tryPlayVideo() {
        heroVideo.play().then(() => {
            heroVideo.classList.remove('video-hidden');
            if (heroPoster) heroPoster.style.display = 'none';
        }).catch(() => {
        });
    }

    window.addEventListener("scroll", tryPlayVideo, { once: true });
    window.addEventListener("touchstart", tryPlayVideo, { once: true });
    window.addEventListener("click", tryPlayVideo, { once: true });
    
    setTimeout(tryPlayVideo, 1000);
}

function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const select = dropdown.querySelector('select');
        const selectedDisplay = dropdown.querySelector('.custom-dropdown-selected');
        const optionsContainer = dropdown.querySelector('.custom-dropdown-options');
        
        if (!select || !selectedDisplay || !optionsContainer) return;
        
        const options = Array.from(select.options);
        
        function updateSelectedText() {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption.value === '') {
                selectedDisplay.innerHTML = `<span class="custom-dropdown-placeholder">${selectedOption.textContent}</span>`;
            } else {
                selectedDisplay.textContent = selectedOption.textContent;
            }
            
            options.forEach(opt => {
                const optionEl = optionsContainer.querySelector(`[data-value="${opt.value}"]`);
                if (optionEl) {
                    if (opt.selected) {
                        optionEl.classList.add('selected');
                    } else {
                        optionEl.classList.remove('selected');
                    }
                }
            });
        }
        
        function openDropdown() {
            dropdown.classList.add('open');
            document.addEventListener('click', handleOutsideClick);
        }
        
        function closeDropdown() {
            dropdown.classList.remove('open');
            document.removeEventListener('click', handleOutsideClick);
        }
        
        function handleOutsideClick(e) {
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        }
        
        selectedDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            
            document.querySelectorAll('.custom-dropdown.open').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('open');
                }
            });
            
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });
        
        options.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('custom-dropdown-option');
            optionEl.textContent = option.textContent;
            optionEl.setAttribute('data-value', option.value);
            
            optionEl.addEventListener('click', function(e) {
                e.stopPropagation();
                select.value = option.value;
                updateSelectedText();
                select.dispatchEvent(new Event('change', { bubbles: true }));
                closeDropdown();
            });
            
            optionsContainer.appendChild(optionEl);
        });
        
        updateSelectedText();
    });
}

function initCustomTimePickers() {
    const timePickers = document.querySelectorAll('.custom-time-picker');
    
    timePickers.forEach(picker => {
        const hiddenInput = picker.querySelector('input[type="hidden"]');
        const display = picker.querySelector('.custom-time-picker-display');
        const dropdown = picker.querySelector('.custom-time-picker-dropdown');
        const hourColumn = picker.querySelector('.hour-column .column-options');
        const minuteColumn = picker.querySelector('.minute-column .column-options');
        const periodColumn = picker.querySelector('.period-column .column-options');
        
        if (!hiddenInput || !display || !dropdown) return;
        
        let selectedHour = '';
        let selectedMinute = '';
        let selectedPeriod = '';
        
        const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
        const periods = ['AM', 'PM'];
        
        function populateOptions(container, options, type) {
            container.innerHTML = '';
            options.forEach(opt => {
                const optionEl = document.createElement('div');
                optionEl.classList.add('time-option');
                optionEl.textContent = opt;
                optionEl.setAttribute('data-value', opt);
                
                optionEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    if (type === 'hour') {
                        selectedHour = opt;
                    } else if (type === 'minute') {
                        selectedMinute = opt;
                    } else if (type === 'period') {
                        selectedPeriod = opt;
                    }
                    
                    updateSelection(type);
                    updateDisabledTimes();
                    updateDisplay();
                    updateHiddenInput();
                });
                
                container.appendChild(optionEl);
            });
        }
        
        function updateDisabledTimes() {
            const dateInput = document.getElementById('pickupDate');
            if (!dateInput || !dateInput.value) return;
            
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate.getTime() !== today.getTime()) {
                hourColumn.querySelectorAll('.time-option').forEach(opt => {
                    opt.style.pointerEvents = 'auto';
                    opt.style.opacity = '1';
                    opt.style.cursor = 'pointer';
                });
                minuteColumn.querySelectorAll('.time-option').forEach(opt => {
                    opt.style.pointerEvents = 'auto';
                    opt.style.opacity = '1';
                    opt.style.cursor = 'pointer';
                });
                periodColumn.querySelectorAll('.time-option').forEach(opt => {
                    opt.style.pointerEvents = 'auto';
                    opt.style.opacity = '1';
                    opt.style.cursor = 'pointer';
                });
                return;
            }
            
            const now = new Date();
            const currentHour24 = now.getHours();
            const currentMinute = now.getMinutes();
            
            periodColumn.querySelectorAll('.time-option').forEach(opt => {
                const period = opt.dataset.value;
                if (period === 'AM' && currentHour24 >= 12) {
                    opt.style.pointerEvents = 'none';
                    opt.style.opacity = '0.3';
                    opt.style.cursor = 'not-allowed';
                } else {
                    opt.style.pointerEvents = 'auto';
                    opt.style.opacity = '1';
                    opt.style.cursor = 'pointer';
                }
            });
            
            hourColumn.querySelectorAll('.time-option').forEach(opt => {
                const hour = parseInt(opt.dataset.value);
                const selectedPeriod = periodColumn.querySelector('.time-option.selected');
                const period = selectedPeriod ? selectedPeriod.dataset.value : (currentHour24 >= 12 ? 'PM' : 'AM');
                
                let hour24 = hour;
                if (period === 'PM' && hour !== 12) {
                    hour24 = hour + 12;
                } else if (period === 'AM' && hour === 12) {
                    hour24 = 0;
                }
                
                if (hour24 < currentHour24) {
                    opt.style.pointerEvents = 'none';
                    opt.style.opacity = '0.3';
                    opt.style.cursor = 'not-allowed';
                } else {
                    opt.style.pointerEvents = 'auto';
                    opt.style.opacity = '1';
                    opt.style.cursor = 'pointer';
                }
            });
            
            minuteColumn.querySelectorAll('.time-option').forEach(opt => {
                const minute = parseInt(opt.dataset.value);
                const selectedHourEl = hourColumn.querySelector('.time-option.selected');
                const selectedPeriodEl = periodColumn.querySelector('.time-option.selected');
                
                if (!selectedHourEl || !selectedPeriodEl) {
                    let hour24 = currentHour24;
                    if (minute <= currentMinute) {
                        opt.style.pointerEvents = 'none';
                        opt.style.opacity = '0.3';
                        opt.style.cursor = 'not-allowed';
                    } else {
                        opt.style.pointerEvents = 'auto';
                        opt.style.opacity = '1';
                        opt.style.cursor = 'pointer';
                    }
                    return;
                }
                
                const selectedHour = parseInt(selectedHourEl.dataset.value);
                const period = selectedPeriodEl.dataset.value;
                
                let selectedHour24 = selectedHour;
                if (period === 'PM' && selectedHour !== 12) {
                    selectedHour24 = selectedHour + 12;
                } else if (period === 'AM' && selectedHour === 12) {
                    selectedHour24 = 0;
                }
                
                if (selectedHour24 < currentHour24) {
                    opt.style.pointerEvents = 'none';
                    opt.style.opacity = '0.3';
                    opt.style.cursor = 'not-allowed';
                } else if (selectedHour24 === currentHour24) {
                    if (minute <= currentMinute) {
                        opt.style.pointerEvents = 'none';
                        opt.style.opacity = '0.3';
                        opt.style.cursor = 'not-allowed';
                    } else {
                        opt.style.pointerEvents = 'auto';
                        opt.style.opacity = '1';
                        opt.style.cursor = 'pointer';
                    }
                } else {
                    opt.style.pointerEvents = 'auto';
                    opt.style.opacity = '1';
                    opt.style.cursor = 'pointer';
                }
            });
        }
        
        function updateSelection(type) {
            const column = type === 'hour' ? hourColumn : 
                          type === 'minute' ? minuteColumn : periodColumn;
            
            column.querySelectorAll('.time-option').forEach(opt => {
                const isSelected = (type === 'hour' && opt.dataset.value === selectedHour) ||
                                  (type === 'minute' && opt.dataset.value === selectedMinute) ||
                                  (type === 'period' && opt.dataset.value === selectedPeriod);
                opt.classList.toggle('selected', isSelected);
            });
        }
        
        function updateDisplay() {
            if (selectedHour && selectedMinute && selectedPeriod) {
                display.innerHTML = `<span class="time-value">${selectedHour}:${selectedMinute} ${selectedPeriod}</span><i class="fas fa-clock time-icon"></i>`;
            } else {
                display.innerHTML = `<span class="time-placeholder">Select time</span><i class="fas fa-clock time-icon"></i>`;
            }
        }
        
        function updateHiddenInput() {
            if (selectedHour && selectedMinute && selectedPeriod) {
                let hour24 = parseInt(selectedHour);
                if (selectedPeriod === 'PM' && hour24 !== 12) {
                    hour24 += 12;
                } else if (selectedPeriod === 'AM' && hour24 === 12) {
                    hour24 = 0;
                }
                hiddenInput.value = `${hour24.toString().padStart(2, '0')}:${selectedMinute}`;
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                hiddenInput.value = '';
            }
        }
        
        function openPicker() {
            picker.classList.add('open');
            updateDisabledTimes();
            document.addEventListener('click', handleOutsideClick);
        }
        
        function closePicker() {
            picker.classList.remove('open');
            document.removeEventListener('click', handleOutsideClick);
        }
        
        function handleOutsideClick(e) {
            if (!picker.contains(e.target)) {
                closePicker();
            }
        }
        
        display.addEventListener('click', function(e) {
            e.stopPropagation();
            
            document.querySelectorAll('.custom-time-picker.open').forEach(openPicker => {
                if (openPicker !== picker) {
                    openPicker.classList.remove('open');
                }
            });
            
            if (picker.classList.contains('open')) {
                closePicker();
            } else {
                openPicker();
            }
        });
        
        const dateInput = document.getElementById('pickupDate');
        if (dateInput) {
            dateInput.addEventListener('change', updateDisabledTimes);
        }
        
        populateOptions(hourColumn, hours, 'hour');
        populateOptions(minuteColumn, minutes, 'minute');
        populateOptions(periodColumn, periods, 'period');
        
        updateDisplay();
    });
}

function initCustomDatePickers() {
    const datePickers = document.querySelectorAll('.custom-date-picker');
    
    datePickers.forEach(picker => {
        const hiddenInput = picker.querySelector('input[type="hidden"]');
        const display = picker.querySelector('.custom-date-picker-display');
        const dropdown = picker.querySelector('.custom-date-picker-dropdown');
        const monthYearDisplay = picker.querySelector('.date-current-month-year');
        const daysContainer = picker.querySelector('.date-picker-days');
        const prevBtn = picker.querySelector('.prev-month');
        const nextBtn = picker.querySelector('.next-month');
        const todayBtn = picker.querySelector('.date-today-btn');
        const clearBtn = picker.querySelector('.date-clear-btn');
        
        if (!hiddenInput || !display || !dropdown) return;
        
        let currentDate = new Date();
        let selectedDate = null;
        let viewMonth = new Date().getMonth();
        let viewYear = new Date().getFullYear();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        function renderCalendar() {
            monthYearDisplay.textContent = `${monthNames[viewMonth]} ${viewYear}`;
            daysContainer.innerHTML = '';
            
            const firstDay = new Date(viewYear, viewMonth, 1).getDay();
            const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayEl = document.createElement('div');
                dayEl.classList.add('date-day', 'other-month');
                dayEl.textContent = daysInPrevMonth - i;
                daysContainer.appendChild(dayEl);
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.classList.add('date-day');
                dayEl.textContent = day;
                
                const date = new Date(viewYear, viewMonth, day);
                
                if (date.getTime() === today.getTime()) {
                    dayEl.classList.add('today');
                }
                
                if (date < today) {
                    dayEl.classList.add('disabled');
                    dayEl.style.pointerEvents = 'none';
                    dayEl.style.color = '#6b7280';
                    dayEl.style.cursor = 'not-allowed';
                }
                
                if (selectedDate && 
                    selectedDate.getDate() === day && 
                    selectedDate.getMonth() === viewMonth && 
                    selectedDate.getFullYear() === viewYear) {
                    dayEl.classList.add('selected');
                }
                
                if (date >= today) {
                    dayEl.addEventListener('click', function(e) {
                        e.stopPropagation();
                        selectDate(date);
                    });
                }
                
                daysContainer.appendChild(dayEl);
            }
            
            const totalCells = firstDay + daysInMonth;
            const remainingCells = (7 - (totalCells % 7)) % 7;
            
            for (let i = 1; i <= remainingCells; i++) {
                const dayEl = document.createElement('div');
                dayEl.classList.add('date-day', 'other-month');
                dayEl.textContent = i;
                daysContainer.appendChild(dayEl);
            }
        }
        
        function selectDate(date) {
            selectedDate = date;
            updateDisplay();
            updateHiddenInput();
            renderCalendar();
        }
        
        function updateDisplay() {
            if (selectedDate) {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                display.innerHTML = `<span class="date-value">${selectedDate.toLocaleDateString('en-US', options)}</span><i class="fas fa-calendar-alt date-icon"></i>`;
            } else {
                display.innerHTML = `<span class="date-placeholder">Select date</span><i class="fas fa-calendar-alt date-icon"></i>`;
            }
        }
        
        function updateHiddenInput() {
            if (selectedDate) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                hiddenInput.value = `${year}-${month}-${day}`;
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                hiddenInput.value = '';
            }
        }
        
        function openPicker() {
            picker.classList.add('open');
            renderCalendar();
            document.addEventListener('click', handleOutsideClick);
        }
        
        function closePicker() {
            picker.classList.remove('open');
            document.removeEventListener('click', handleOutsideClick);
        }
        
        function handleOutsideClick(e) {
            if (!picker.contains(e.target)) {
                closePicker();
            }
        }
        
        display.addEventListener('click', function(e) {
            e.stopPropagation();
            
            document.querySelectorAll('.custom-date-picker.open').forEach(openPicker => {
                if (openPicker !== picker) {
                    openPicker.classList.remove('open');
                }
            });
            
            if (picker.classList.contains('open')) {
                closePicker();
            } else {
                openPicker();
            }
        });
        
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            viewMonth--;
            if (viewMonth < 0) {
                viewMonth = 11;
                viewYear--;
            }
            renderCalendar();
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            viewMonth++;
            if (viewMonth > 11) {
                viewMonth = 0;
                viewYear++;
            }
            renderCalendar();
        });
        
        todayBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            selectedDate = new Date();
            viewMonth = selectedDate.getMonth();
            viewYear = selectedDate.getFullYear();
            updateDisplay();
            updateHiddenInput();
            renderCalendar();
        });
        
        clearBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            selectedDate = null;
            updateDisplay();
            updateHiddenInput();
            renderCalendar();
        });
        
        renderCalendar();
        updateDisplay();
    });
}
