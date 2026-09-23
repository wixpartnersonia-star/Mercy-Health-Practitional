/**
 * MercyHealthCare - Revolution Slider Engine
 * Handles layered transitions, interactive timeline progress,
 * touch gestures, and mouse parallax depth.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.getElementById('revSliderTrack');
  if (!sliderTrack) return;

  const slides = Array.from(sliderTrack.querySelectorAll('.rev-slide'));
  const prevBtn = document.getElementById('revPrevBtn');
  const nextBtn = document.getElementById('revNextBtn');
  const dotsContainer = document.getElementById('revDots');
  const numCurrent = document.getElementById('revCurrentNum');
  const progressBar = document.getElementById('revProgressFill');
  const heroSection = document.getElementById('heroSlider');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 6500; // 6.5s per slide
  let slideTimer = null;
  let progressInterval = null;
  let progressPercent = 0;
  let isPaused = false;

  // Initialize dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `rev-dot ${idx === 0 ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlideUI() {
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('is-active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('is-active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    if (numCurrent) {
      numCurrent.textContent = `0${currentIndex + 1}`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.rev-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    progressPercent = 0;
    if (progressBar) progressBar.style.width = '0%';
    updateSlideUI();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Progress Bar Animation Loop
  function startProgress() {
    clearInterval(progressInterval);
    const intervalStep = 50; // update every 50ms
    const stepIncrement = (intervalStep / slideDuration) * 100;

    progressInterval = setInterval(() => {
      if (!isPaused) {
        progressPercent += stepIncrement;
        if (progressBar) {
          progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
        }
        if (progressPercent >= 100) {
          nextSlide();
        }
      }
    }, intervalStep);
  }

  function restartTimer() {
    progressPercent = 0;
    if (progressBar) progressBar.style.width = '0%';
    startProgress();
  }

  // Navigation Button Handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartTimer();
    });
  }

  // Pause on hover
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // 3D Parallax Movement with Mouse
    heroSection.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 992) return;
      const rect = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      const activeSlide = slides[currentIndex];
      if (!activeSlide) return;

      const nurseImg = activeSlide.querySelector('.rev-nurse-img');
      const floatCards = activeSlide.querySelectorAll('.rev-float-card');
      const backdrop = activeSlide.querySelector('.rev-portrait-backdrop');

      if (nurseImg) {
        nurseImg.style.transform = `translate3d(${mouseX * 0.02}px, ${mouseY * 0.015}px, 0)`;
      }

      if (backdrop) {
        backdrop.style.transform = `translate3d(${-mouseX * 0.01}px, ${-mouseY * 0.01}px, 0)`;
      }

      floatCards.forEach((card, i) => {
        const factor = (i + 1) * 0.025;
        card.style.transform = `translate3d(${mouseX * factor}px, ${mouseY * factor}px, 0)`;
      });
    });

    // Reset parallax on leave
    heroSection.addEventListener('mouseleave', () => {
      const activeSlide = slides[currentIndex];
      if (!activeSlide) return;
      const nurseImg = activeSlide.querySelector('.rev-nurse-img');
      const floatCards = activeSlide.querySelectorAll('.rev-float-card');
      const backdrop = activeSlide.querySelector('.rev-portrait-backdrop');

      if (nurseImg) nurseImg.style.transform = '';
      if (backdrop) backdrop.style.transform = '';
      floatCards.forEach(card => (card.style.transform = ''));
    });
  }

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  sliderTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 45;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      restartTimer();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      restartTimer();
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') {
      nextSlide();
      restartTimer();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      restartTimer();
    }
  });

  // Initial Launch
  updateSlideUI();
  startProgress();
});
