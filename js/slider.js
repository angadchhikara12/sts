document.addEventListener('DOMContentLoaded', function() {
    initSliders();
});

function initSliders() {
    initTestimonialsSlider();
    initHeroSlider();
    initGallerySlider();
}

function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-card');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    const totalSlides = slides.length;
    
    const prevBtn = slider.querySelector('.slider-prev') || document.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next') || document.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots') || document.querySelector('.slider-dots');
    
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
            slide.style.opacity = index === currentSlide ? '1' : '0';
            
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        updateSlides();
        resetAutoPlay();
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    updateSlides();
    startAutoPlay();
}

function initHeroSlider() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const bgImages = hero.getAttribute('data-images');
    if (!bgImages) return;
    
    const images = bgImages.split(',').map(img => img.trim());
    if (images.length <= 1) return;
    
    let currentImage = 0;
    const heroBg = hero.querySelector('.hero-bg');
    
    if (!heroBg) return;
    
    function changeImage() {
        currentImage = (currentImage + 1) % images.length;
        heroBg.style.opacity = '0';
        
        setTimeout(() => {
            heroBg.style.backgroundImage = `url(${images[currentImage]})`;
            heroBg.style.opacity = '1';
        }, 500);
    }
    
    setInterval(changeImage, 6000);
}

function initGallerySlider() {
    const galleries = document.querySelectorAll('.gallery-slider');
    
    galleries.forEach(gallery => {
        const slides = gallery.querySelectorAll('.gallery-slide');
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');
        
        function updateGallery() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateGallery();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateGallery();
        }
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        updateGallery();
    });
}

function createSlider(container, options = {}) {
    const defaults = {
        autoplay: true,
        interval: 5000,
        dots: true,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        responsive: []
    };
    
    const settings = { ...defaults, ...options };
    
    const slides = container.querySelectorAll('.slide');
    if (slides.length === 0) return null;
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    function goTo(index) {
        if (settings.infinite) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
        } else {
            if (index < 0 || index >= slides.length) return;
        }
        
        currentIndex = index;
        updateSlider();
    }
    
    function updateSlider() {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
            slide.classList.toggle('active', i === currentIndex);
        });
    }
    
    function next() {
        goTo(currentIndex + 1);
    }
    
    function prev() {
        goTo(currentIndex - 1);
    }
    
    function start() {
        if (settings.autoplay) {
            autoPlayInterval = setInterval(next, settings.interval);
        }
    }
    
    function stop() {
        clearInterval(autoPlayInterval);
    }
    
    if (settings.autoplay) {
        start();
        
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
    }
    
    return {
        next,
        prev,
        goTo,
        start,
        stop
    };
}
