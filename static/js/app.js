// =============================================
// === Enhanced Mobile Navigation =============
// =============================================
let menuButton = null;
let navLinks = null;

function setupMobileNav() {
  if (window.innerWidth <= 768) {
    const header = document.querySelector('.header');
    if (!header) return;

    // Create menu button if not exists
    if (!document.querySelector('.mobile-menu-button')) {
      menuButton = document.createElement('button');
      menuButton.className = 'mobile-menu-button';
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
      menuButton.setAttribute('aria-label', 'Открыть меню');
      menuButton.setAttribute('aria-expanded', 'false');
      header.prepend(menuButton);

      // Add click handler for new button
      menuButton.addEventListener('click', toggleMobileMenu);
    }

    // Initialize nav links reference
    navLinks = document.querySelector('.nav-links');

    // Add click-away listener
    document.addEventListener('click', handleClickOutside);
  }
}

function toggleMobileMenu() {
  const isExpanded = navLinks.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', isExpanded.toString());

  // Toggle body scroll lock
  document.body.style.overflow = isExpanded ? 'hidden' : '';
}

function handleClickOutside(event) {
  if (window.innerWidth > 768) return;

  const isMenuButton = event.target.closest('.mobile-menu-button');
  const isNavLink = event.target.closest('.nav-links a');
  const isInMenu = event.target.closest('.nav-links');

  if (isNavLink) {
    toggleMobileMenu();
    return;
  }

  if (!isInMenu && !isMenuButton && navLinks.classList.contains('active')) {
    toggleMobileMenu();
  }
}

function handleWindowResize() {
  if (window.innerWidth > 768) {
    // Cleanup mobile elements
    if (menuButton) {
      menuButton.removeEventListener('click', toggleMobileMenu);
      menuButton.remove();
      menuButton = null;
    }
    if (navLinks) {
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
    document.removeEventListener('click', handleClickOutside);
  } else {
    setupMobileNav();
  }
}

function getHeaderHeight() {
  const header = document.querySelector('.header');
  return header ? header.offsetHeight : (window.innerWidth <= 768 ? 80 : 150);
}

// =============================================
// === Smooth Scrolling ========================
// =============================================
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.href.includes('http') ||
      anchor.href.startsWith('mailto:') ||
      anchor.href.startsWith('tel:')) return;

    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const header = document.querySelector('.header');
        const headerHeight = getHeaderHeight();
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) history.pushState(null, null, targetId);

        // Close mobile menu
        if (window.innerWidth <= 768) {
          const navLinks = document.querySelector('.nav-links');
          const menuButton = document.querySelector('.mobile-menu-button');
          if (navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuButton?.setAttribute('aria-expanded', 'false');
          }
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
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {rootMargin: '200px 0px'});

  lazyImages.forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else observer.observe(img);
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
  }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

  elementsToAnimate.forEach(el => observer.observe(el));
}

// =============================================
// === Cookie Consent ==========================
// =============================================
function setupCookieConsent() {
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptButton = document.querySelector('.cookie-button');

  if (!cookieConsent || !acceptButton) return;

  const consentAccepted = localStorage.getItem('cookiesAccepted');

  // If no consent or expired, show the banner after delay
  if (!consentAccepted || isConsentExpired(consentAccepted)) {
    setTimeout(() => cookieConsent.classList.add('visible'), 2000);
  }

  acceptButton.addEventListener('click', () => {
    // Save current timestamp in localStorage
    localStorage.setItem('cookiesAccepted', Date.now().toString());
    cookieConsent.classList.remove('visible');
  });
}

// Checks if consent is older than 30 days
function isConsentExpired(timestamp) {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - parseInt(timestamp, 10) > sevenDaysInMs;
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

  images.forEach(img => img.addEventListener('click', () => openModal(img.src, img.alt)));
  closeBtn?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
}

// =============================================
// === Promotions Countdown Timers =============
// =============================================
function updatePromoTimers() {
  // Timer for cleaning promo (July 30)
  const cleaningEndDate = new Date('July 30, 2025 23:59:59').getTime();
  // Timer for implant promo (July 31)
  const implantEndDate = new Date('July 31, 2025 23:59:59').getTime();
  const now = new Date().getTime();

  // Cleaning promo timer
  const cleaningTimeLeft = cleaningEndDate - now;
  if (cleaningTimeLeft <= 0) {
    const cleaningTimer = document.querySelector('#cleaning-promo .timer');
    if (cleaningTimer) {
      cleaningTimer.innerHTML = 'Акция завершена!';
    }
  } else {
    const cleaningDays = Math.floor(cleaningTimeLeft / (1000 * 60 * 60 * 24));
    const cleaningHours = Math.floor((cleaningTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const cleaningMinutes = Math.floor((cleaningTimeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (document.getElementById('cleaning-days')) {
      document.getElementById('cleaning-days').textContent = cleaningDays;
      document.getElementById('cleaning-hours').textContent = cleaningHours;
      document.getElementById('cleaning-minutes').textContent = cleaningMinutes;
    }
  }

  // Implant promo timer
  const implantTimeLeft = implantEndDate - now;
  if (implantTimeLeft <= 0) {
    const implantTimer = document.querySelector('#implant-promo .timer');
    if (implantTimer) {
      implantTimer.innerHTML = 'Акция завершена!';
    }
    const implantHeading = document.getElementById('implant-promo-heading');
    if (implantHeading) {
      implantHeading.textContent = 'Акция завершена';
    }
  } else {
    const implantDays = Math.floor(implantTimeLeft / (1000 * 60 * 60 * 24));
    const implantHours = Math.floor((implantTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const implantMinutes = Math.floor((implantTimeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (document.getElementById('implant-days')) {
      document.getElementById('implant-days').textContent = implantDays;
      document.getElementById('implant-hours').textContent = implantHours;
      document.getElementById('implant-minutes').textContent = implantMinutes;
    }
  }
}

// =============================================
// === Initialization ==========================
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  window.addEventListener('resize', handleWindowResize);
  setupSmoothScrolling();
  setupLazyLoading();
  animateOnScroll();
  setupCookieConsent();
  initModal();

  // Initialize and update promo timers every second
  updatePromoTimers();
  setInterval(updatePromoTimers, 1000);
});

window.addEventListener('load', () => {
  // Final adjustments after full page load
});
