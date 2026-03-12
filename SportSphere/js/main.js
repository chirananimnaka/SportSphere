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
});
