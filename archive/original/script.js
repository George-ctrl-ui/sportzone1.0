/**
 * Sports Zone - Main Script (script.js)
 * Clean, modern vanilla JavaScript for:
 * 1. Sports Picture Slider (Basketball, Badminton, Volleyball, Pickleball)
 * 2. Mobile Hamburger Navigation
 * 3. Smooth Scrolling & Scrollspy
 * 4. Interactive Sport Selection & Specs Viewer
 * 5. Functional Court Reservation Inquiry Form with Receipt & Local History
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SPORTS PICTURE SLIDER
     Automatically cycles through sports pictures and supports manual controls.
     ========================================================================== */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const sliderContainer = document.getElementById('hero-slider');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = null;

  function showSlide(index) {
    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoSlide();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(slideIndex);
      restartAutoSlide();
    });
  });

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4500);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();


  /* ==========================================================================
     2. MOBILE NAVIGATION MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link on mobile
    const allNavLinks = navMenu.querySelectorAll('a');
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ==========================================================================
     3. SMOOTH SCROLLING FOR ANCHOR LINKS
     ========================================================================== */
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('header');
  const topBar = document.getElementById('top-bar');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          event.preventDefault();

          // Calculate offset dynamically
          const headerHeight = header ? header.offsetHeight : 70;
          const topBarHeight = topBar ? topBar.offsetHeight : 0;
          const totalOffset = headerHeight + 10;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - totalOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          history.pushState(null, '', targetId);
        }
      }
    });
  });


  /* ==========================================================================
     4. ACTIVE NAVIGATION LINK ON SCROLL (SCROLLSPY)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollPosition = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 70;

    sections.forEach((section) => {
      const top = section.offsetTop - headerHeight - 60;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        menuLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  highlightNavOnScroll();


  /* ==========================================================================
     5. INTERACTIVE SPORT SELECTION & SPECS VIEWER
     Allows users to click "Inquire Sport" to pre-select it in the booking form.
     ========================================================================== */
  const sportSelectButtons = document.querySelectorAll('.select-sport-btn');
  const sportDropdown = document.getElementById('contact-sport');
  const contactSection = document.getElementById('contact');

  sportSelectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sportName = btn.getAttribute('data-sport');
      if (sportDropdown && sportName) {
        sportDropdown.value = sportName;
      }

      if (contactSection) {
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        
        // Highlight dropdown briefly
        if (sportDropdown) {
          sportDropdown.focus();
        }
      }
    });
  });

  // Gallery interactive info box
  const galleryItems = document.querySelectorAll('.gallery-item');
  const infoBox = document.getElementById('sport-info-box');
  const infoBoxTitle = document.getElementById('info-box-title');
  const infoBoxDesc = document.getElementById('info-box-desc');
  const infoBoxRate = document.getElementById('info-box-rate');
  const infoBoxClose = document.getElementById('info-box-close');
  const infoBoxBookBtn = document.getElementById('info-box-book-btn');

  const sportSpecs = {
    Basketball: {
      icon: '🏀',
      title: 'Basketball Court Specifications',
      desc: 'FIBA standard full court and half court layout. Hardwood patterned shock-absorbing floor, breakaway spring rims, fiberglass backboards, and 12-head LED arena illumination for night games in Talibon.',
      rate: 'Rate: ₱250 – ₱400 / hour (Day & Night with lights)'
    },
    Badminton: {
      icon: '🏸',
      title: 'Badminton Court Specifications',
      desc: '2 regulation vinyl courts with professional anti-glare overhead lighting and Yonex standard net posts. Equipment rental available (rackets, shuttles, grip tapes).',
      rate: 'Rate: ₱180 – ₱300 / hour'
    },
    Volleyball: {
      icon: '🏐',
      title: 'Volleyball Court Specifications',
      desc: 'Regulation indoor court with adjustable net heights for men, women, and mixed tournaments. Padded antennas, referee elevated stand, and safety boundary margins.',
      rate: 'Rate: ₱200 – ₱350 / hour'
    },
    Pickleball: {
      icon: '🏓',
      title: 'Pickleball Court Specifications',
      desc: 'Dedicated non-skid surface with 7-foot non-volley kitchen zone marking and official regulation pickleball nets. Rental paddles and Dura balls available.',
      rate: 'Rate: ₱150 – ₱250 / hour'
    }
  };

  let selectedSportKey = 'Basketball';

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const sportKey = item.getAttribute('data-sport');
      if (sportKey && sportSpecs[sportKey]) {
        selectedSportKey = sportKey;
        const data = sportSpecs[sportKey];

        galleryItems.forEach((gi) => gi.classList.remove('selected'));
        item.classList.add('selected');

        if (infoBox && infoBoxTitle && infoBoxDesc && infoBoxRate) {
          infoBoxTitle.textContent = `${data.icon} ${data.title}`;
          infoBoxDesc.textContent = data.desc;
          infoBoxRate.textContent = data.rate;
          infoBox.style.display = 'block';
        }
      }
    });
  });

  if (infoBoxClose) {
    infoBoxClose.addEventListener('click', () => {
      if (infoBox) infoBox.style.display = 'none';
      galleryItems.forEach((gi) => gi.classList.remove('selected'));
    });
  }

  if (infoBoxBookBtn) {
    infoBoxBookBtn.addEventListener('click', () => {
      if (sportDropdown && selectedSportKey) {
        sportDropdown.value = selectedSportKey;
      }
      if (contactSection) {
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        if (sportDropdown) sportDropdown.focus();
      }
    });
  }


  /* ==========================================================================
     6. FUNCTIONAL RESERVATION INQUIRY FORM & RECENT HISTORY
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const recentInquiriesContainer = document.getElementById('recent-inquiries-container');
  const recentInquiriesList = document.getElementById('recent-inquiries-list');
  const clearInquiriesBtn = document.getElementById('clear-inquiries-btn');

  // Load saved inquiries from localStorage
  function loadRecentInquiries() {
    try {
      const saved = localStorage.getItem('sportszone_inquiries');
      if (!saved) {
        if (recentInquiriesContainer) recentInquiriesContainer.style.display = 'none';
        return;
      }

      const inquiries = JSON.parse(saved);
      if (Array.isArray(inquiries) && inquiries.length > 0) {
        if (recentInquiriesList && recentInquiriesContainer) {
          recentInquiriesList.innerHTML = '';
          inquiries.slice(0, 4).forEach((item) => {
            const row = document.createElement('div');
            row.className = 'inquiry-item';
            row.innerHTML = `
              <div>
                <span class="inquiry-sport">${escapeHtml(item.sport || 'General')}</span>
                <span style="color: #64748b; font-size: 0.8rem;"> — ${escapeHtml(item.name)}</span>
              </div>
              <div class="inquiry-date">Ref: #${escapeHtml(item.ref)} • ${escapeHtml(item.date || 'Soon')}</div>
            `;
            recentInquiriesList.appendChild(row);
          });
          recentInquiriesContainer.style.display = 'block';
        }
      } else {
        if (recentInquiriesContainer) recentInquiriesContainer.style.display = 'none';
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Escape helper for safe HTML rendering
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const phoneInput = document.getElementById('contact-phone');
      const emailInput = document.getElementById('contact-email');
      const sportInput = document.getElementById('contact-sport');
      const dateInput = document.getElementById('contact-date');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const sport = sportInput ? sportInput.value : 'General Inquiry';
      const date = dateInput && dateInput.value ? dateInput.value : 'Anytime';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple validation
      if (!name || !phone) {
        alert('Please provide your name and contact phone number.');
        return;
      }

      // Generate simulated reservation reference ID
      const refId = 'SZ-' + Math.floor(100000 + Math.random() * 900000);

      // Render functional receipt confirmation
      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>✅ Inquiry Received, ${escapeHtml(name)}!</strong>
          <p style="margin-top: 0.25rem;">Our center desk at <strong>Purok 2, San Francisco, Talibon, Bohol</strong> will contact you at <strong>${escapeHtml(phone)}</strong> to confirm court availability.</p>
          <div class="feedback-receipt">
            <strong>Reservation Reference:</strong> #${refId}<br />
            <strong>Sport / Facility:</strong> ${escapeHtml(sport)}<br />
            <strong>Requested Date:</strong> ${escapeHtml(date)}<br />
            <strong>Location:</strong> Sports Zone, Purok 2, San Francisco, Talibon, Bohol
          </div>
        `;
        formFeedback.style.display = 'block';
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Save inquiry to localStorage
      try {
        const saved = localStorage.getItem('sportszone_inquiries');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          ref: refId,
          name,
          sport,
          date,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('sportszone_inquiries', JSON.stringify(list.slice(0, 10)));
        loadRecentInquiries();
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      // Reset form
      contactForm.reset();
    });
  }

  // Clear inquiries button
  if (clearInquiriesBtn) {
    clearInquiriesBtn.addEventListener('click', () => {
      localStorage.removeItem('sportszone_inquiries');
      if (recentInquiriesContainer) recentInquiriesContainer.style.display = 'none';
      if (recentInquiriesList) recentInquiriesList.innerHTML = '';
    });
  }

  // Initial load of inquiries
  loadRecentInquiries();

});
