/**
 * SportSphere Elite Performance Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("SportSphere Core System Online...");

    // 1. Hero Seamless Crossfade Slider
    const heroSlides = Array.from(document.querySelectorAll('.hero-bg'));
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideTimer;

    // Preload Logic (Critical for avoiding black screens)
    const preloadAll = () => {
        heroSlides.forEach(slide => {
            const url = slide.style.backgroundImage.slice(5, -2);
            const img = new Image();
            img.src = url;
        });
    };
    preloadAll();

    // Create Navigation Dots
    if (dotsContainer && heroSlides.length > 0) {
        dotsContainer.innerHTML = ''; // Clear existing
        heroSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.onclick = () => goToSlide(index);
            dotsContainer.appendChild(dot);
        });
    }

    function updateSlider(nextIndex) {
        const dots = document.querySelectorAll('.dot');

        // Remove active from previous
        heroSlides.forEach((s, i) => {
            s.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });

        // Set active to new
        heroSlides[nextIndex].classList.add('active');
        if (dots[nextIndex]) dots[nextIndex].classList.add('active');

        currentSlide = nextIndex;
    }

    function goToSlide(index) {
        if (index === currentSlide) return;
        updateSlider(index);
        resetTimer();
    }

    window.nextSlideManual = function () {
        let next = (currentSlide + 1) % heroSlides.length;
        goToSlide(next);
    };

    window.prevSlide = function () {
        let prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        goToSlide(prev);
    };

    function startTimer() {
        slideTimer = setInterval(() => {
            let next = (currentSlide + 1) % heroSlides.length;
            updateSlider(next);
        }, 5000);
    }

    function resetTimer() {
        clearInterval(slideTimer);
        startTimer();
    }

    if (heroSlides.length > 0) startTimer();

    // 2. Intersection Observer (Fade Animations)
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // 3. ROI Calculator (Institutional Tool)
    window.calculateROI = function () {
        const courts = document.getElementById('courts').value || 1;
        const price = document.getElementById('price').value || 1;
        const hours = document.getElementById('hours').value || 1;
        const yieldValue = (courts * price * hours * 365) / 1000000;
        const resultEl = document.getElementById('roi-result');
        if (resultEl) resultEl.innerText = `LKR ${yieldValue.toFixed(1)}M`;
    };

    // 4. Sport Filtering System
    const sportCards = document.querySelectorAll('.sport-card');
    const groundCards = document.querySelectorAll('.ground-card');
    const googleMap = document.getElementById('google-map');

    groundCards.forEach(card => {
        card.addEventListener('click', () => {
            const location = card.getAttribute('data-location');
            if (location && googleMap) {
                googleMap.src = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
                document.getElementById('arena-locator').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    sportCards.forEach(card => {
        card.addEventListener('click', () => {
            const sport = card.getAttribute('data-sport');
            
            // Toggle active state
            sportCards.forEach(c => c.classList.remove('active-filter'));
            card.classList.add('active-filter');

            if (sport === 'all') {
                resetFilters();
            } else {
                filterGrounds(sport);
            }
        });
    });

    function filterGrounds(sport) {
        groundCards.forEach(card => {
            const sportsSupported = card.getAttribute('data-sport').split(' ');
            if (sportsSupported.includes(sport)) {
                card.classList.remove('hide-ground');
            } else {
                card.classList.add('hide-ground');
            }
        });
        
        // Scroll to grounds section
        document.getElementById('grounds').scrollIntoView({ behavior: 'smooth' });
    }

    function resetFilters() {
        groundCards.forEach(card => {
            card.classList.remove('hide-ground');
        });
        document.getElementById('grounds').scrollIntoView({ behavior: 'smooth' });
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeIcon.classList.toggle('fa-moon', !isLight);
        themeIcon.classList.toggle('fa-sun', isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});
