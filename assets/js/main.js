/**
 * MercyHealthCare - Global Website Script
 * Sticky header, mobile drawer, modal, animated counters,
 * interactive services filtering, and appointment booking handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header Effect on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Drawer Navigation Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer-link');

  if (mobileToggle && mobileDrawer) {
    const toggleDrawer = () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleDrawer);

    // Close on overlay click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleDrawer();
      }
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('is-open')) {
          toggleDrawer();
        }
      });
    });
  }

  // 3. Scroll Reveal Animation via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-val');
  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const duration = 1800; // ms
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // 5. Global Appointment Modal Management
  const appointmentModal = document.getElementById('appointmentModal');
  const openModalBtns = document.querySelectorAll('.open-appointment-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalForm = document.getElementById('appointmentModalForm');
  const modalSuccess = document.getElementById('modalSuccessBox');

  const openModal = (defaultService = '') => {
    if (!appointmentModal) return;
    appointmentModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (defaultService) {
      const serviceSelect = document.getElementById('modalServiceSelect');
      if (serviceSelect) {
        serviceSelect.value = defaultService;
      }
    }
  };

  const closeModal = () => {
    if (!appointmentModal) return;
    appointmentModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (appointmentModal) {
    appointmentModal.addEventListener('click', (e) => {
      if (e.target === appointmentModal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appointmentModal && appointmentModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Handle Form Submission (Modal and Embedded Contact Forms)
  const setupBookingForm = (formEl, successBoxEl) => {
    if (!formEl) return;
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(formEl);
      const fullName = formData.get('fullName') || 'Patient';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const date = formData.get('date') || 'Flexible';
      const time = formData.get('time') || 'Morning';
      const type = formData.get('consultationType') || 'In-Person';
      const reason = formData.get('reason') || 'General Healthcare Consultation';
      const message = formData.get('message') || '';

      // Construct formatted WhatsApp message
      const waText = encodeURIComponent(
        `Hello MercyHealthCare (Mercy Medical Hospital, Osogbo),\n\n` +
        `I would like to request an appointment:\n` +
        `• Name: ${fullName}\n` +
        `• Phone: ${phone}\n` +
        `• Email: ${email}\n` +
        `• Service / Reason: ${reason}\n` +
        `• Consultation: ${type}\n` +
        `• Preferred Date: ${date} (${time})\n` +
        (message ? `• Notes: ${message}\n` : '') +
        `\nThank you!`
      );

      const waLink = `https://wa.me/2349073732756?text=${waText}`;

      // Update success card with personalized confirmation and WhatsApp button
      if (successBoxEl) {
        formEl.style.display = 'none';
        successBoxEl.classList.add('is-visible');
        successBoxEl.innerHTML = `
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #E8F5EE; color: #2E7D5B; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: #1D2128; margin-bottom: 8px;">Appointment Request Received</h4>
          <p style="color: #505868; font-size: 0.9375rem; margin-bottom: 20px; line-height: 1.6;">
            Thank you, <strong>${fullName}</strong>. Our clinical team at Mercy Medical Hospital will confirm your <strong>${type}</strong> consultation for <strong>${date}</strong> shortly via phone or email.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-primary" style="background: #25D366; border-color: #25D366;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Fast Confirm on WhatsApp
            </a>
            <button type="button" class="btn btn-secondary" onclick="location.reload()">Book Another</button>
          </div>
        `;
      }
    });
  };

  setupBookingForm(modalForm, modalSuccess);

  const contactPageForm = document.getElementById('contactAppointmentForm');
  const contactSuccess = document.getElementById('contactSuccessBox');
  setupBookingForm(contactPageForm, contactSuccess);

  // 6. Interactive Category Filter (Services Page)
  const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  if (filterTabBtns.length > 0 && serviceCards.length > 0) {
    filterTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        serviceCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat.includes(category)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 7. Active Navigation State helper
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
