// =============================================
// === Mobile Navigation =======================
// =============================================
function setupMobileNav() {
  // Check if we're on mobile view
  if (window.innerWidth <= 768) {
    const header = document.querySelector('.header');
    if (!header) return;

    // Check if button already exists
    if (document.querySelector('.mobile-menu-button')) return;

    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.setAttribute('aria-label', 'Открыть меню');
    menuButton.setAttribute('aria-expanded', 'false');

    header.prepend(menuButton);

    menuButton.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        const isExpanded = navLinks.classList.toggle('active');
        menuButton.setAttribute('aria-expanded', isExpanded.toString());
      }
    });
  }
}

function handleWindowResize() {
  const mobileBtn = document.querySelector('.mobile-menu-button');
  const navLinks = document.querySelector('.nav-links');

  if (window.innerWidth > 768) {
    // Remove mobile button if exists
    if (mobileBtn) {
      mobileBtn.remove();
    }
    // Ensure nav is visible on desktop
    if (navLinks) {
      navLinks.classList.remove('active');
    }
  } else if (window.innerWidth <= 768 && !mobileBtn) {
    // Create mobile button if needed
    setupMobileNav();
  }
}

// =============================================
// === Smooth Scrolling ========================
// =============================================
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip for external links or mailto/tel
    if (anchor.href.includes('http') ||
        anchor.href.startsWith('mailto:') ||
        anchor.href.startsWith('tel:')) {
      return;
    }

    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

// =============================================
// === Lazy Loading Images =====================
// =============================================
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px' // Start loading before in viewport
  });

  lazyImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      observer.observe(img);
    }
  });
}

// =============================================
// === Animate on Scroll =======================
// =============================================
function animateOnScroll() {
  const elementsToAnimate = document.querySelectorAll('.service-card, .case-card, .pricing-table, .about-grid > div');
  if (!elementsToAnimate.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
}

// =============================================
// === Contact Options Toggle ==================
// =============================================
function setupContactButtons() {
  const contactFixed = document.querySelector('.contact-fixed');
  const contactButton = document.querySelector('.contact-button');
  if (!contactFixed || !contactButton) return;

  // Toggle visibility
  contactButton.addEventListener('click', (e) => {
    e.stopPropagation();
    contactFixed.classList.toggle('active');
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    contactFixed.classList.remove('active');
  });

  // Prevent closing when clicking inside
  contactFixed.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// =============================================
// === Appointment Button ======================
// =============================================
function setupAppointmentButton() {
  const appointmentButton = document.querySelector('.appointment-button');
  if (!appointmentButton) return;

  appointmentButton.addEventListener('click', () => {
    // Optional: Track button click for analytics
    console.log('Appointment button clicked');
  });
}

// =============================================
// === Cookie Consent ==========================
// =============================================
function setupCookieConsent() {
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptButton = document.querySelector('.cookie-button');
  if (!cookieConsent || !acceptButton) return;

  // Only show if not already accepted
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      cookieConsent.classList.add('visible');
    }, 2000);
  }

  // Handle accept button click
  acceptButton.addEventListener('click', acceptCookies);
}

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  const cookieConsent = document.getElementById('cookieConsent');
  if (cookieConsent) {
    cookieConsent.classList.remove('visible');
  }

  // Optional: Initialize analytics or tracking scripts here
  // initAnalytics();
}

// =============================================
// === Image Modal =============================
// =============================================
function initModal() {
  const images = document.querySelectorAll('[data-modal-image]');
  const modalOverlay = document.getElementById('modalOverlay');
  if (!images.length || !modalOverlay) return;

  const modalImage = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.close-btn');

  const openModal = (src, alt) => {
    if (modalImage) {
      modalImage.src = src;
      modalImage.alt = alt;
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  images.forEach(img => {
    img.addEventListener('click', () => openModal(img.src, img.alt));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// =============================================
// === Initialize All Functions ================
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  setupMobileNav();
  window.addEventListener('resize', handleWindowResize);

  // Other initializations
  setupSmoothScrolling();
  setupLazyLoading();
  animateOnScroll();
  setupContactButtons();
  setupAppointmentButton();
  setupCookieConsent();
  initModal();

  // Floating contact button
  const contactButton = document.querySelector('.contact-button');
  if (contactButton) {
    contactButton.addEventListener('click', () => {
      const contactOptions = document.querySelector('.contact-options');
      if (contactOptions) {
        contactOptions.classList.toggle('visible');
      }
    });
  }
});

window.addEventListener('load', () => {
  // Any load-time animations or final adjustments
});
