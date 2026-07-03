document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header Scroll Transition ---
  const header = document.querySelector('header');
  const toggleHeaderState = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', toggleHeaderState);
  toggleHeaderState(); // Run once in case page starts scrolled

  // --- Mobile Navigation Menu Drawer ---
  const navToggle = document.querySelector('.nav-toggle');
  const navClose = document.querySelector('.nav-close');
  const mobileMenu = document.querySelector('.nav-menu-mobile');
  const mobileLinks = document.querySelectorAll('.nav-menu-mobile .nav-link');

  const openMobileMenu = () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scroll
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable background scroll
  };

  if (navToggle) navToggle.addEventListener('click', openMobileMenu);
  if (navClose) navClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, no need to track again
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Trigger when 12% is visible
      rootMargin: '0px 0px -50px 0px' // Slightly offset trigger point
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }


  // --- Testimonials Slideshow Slider ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let activeIndex = 0;
  let autoPlayTimer;

  if (slides.length > 0) {
    // Create indicator dots dynamically
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const updateSliderUI = () => {
      slides.forEach((slide, idx) => {
        if (idx === activeIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      activeIndex = (activeIndex + 1) % slides.length;
      updateSliderUI();
      resetAutoplay();
    };

    const prevSlide = () => {
      activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      updateSliderUI();
      resetAutoplay();
    };

    const goToSlide = (idx) => {
      activeIndex = idx;
      updateSliderUI();
      resetAutoplay();
    };

    const startAutoplay = () => {
      autoPlayTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      clearInterval(autoPlayTimer);
      startAutoplay();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    startAutoplay();
    updateSliderUI(); // initial run
  }


  // --- Cinematic Gallery Lightbox Modal ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
        const category = item.querySelector('span') ? item.querySelector('span').textContent : '';
        
        if (lightboxImg && img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
        }
        if (lightboxCaption) {
          lightboxCaption.textContent = `${category} — ${title}`;
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking backdrop overlay
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  // --- Booking Interaction Concept ---
  const bookingForms = document.querySelectorAll('.booking-form-trigger');
  
  // Set minimum date fields to today's date for quality assurance
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const checkin = form.querySelector('.checkin-date') ? form.querySelector('.checkin-date').value : '';
      const checkout = form.querySelector('.checkout-date') ? form.querySelector('.checkout-date').value : '';
      const guests = form.querySelector('.guest-count') ? form.querySelector('.guest-count').value : '2 Guests';
      const category = form.querySelector('.room-category') ? form.querySelector('.room-category').value : '';

      // Validate dates
      if (!checkin || !checkout) {
        alert('Please select both Check-In and Check-Out dates.');
        return;
      }

      if (new Date(checkin) >= new Date(checkout)) {
        alert('Check-Out date must be after your Check-In date.');
        return;
      }

      // Format Date for User Display
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedCheckin = new Date(checkin).toLocaleDateString('en-US', options);
      const formattedCheckout = new Date(checkout).toLocaleDateString('en-US', options);

      // Construct interactive notification
      const successOverlay = document.createElement('div');
      successOverlay.style.position = 'fixed';
      successOverlay.style.top = '0';
      successOverlay.style.left = '0';
      successOverlay.style.width = '100%';
      successOverlay.style.height = '100%';
      successOverlay.style.backgroundColor = 'rgba(23, 58, 47, 0.96)';
      successOverlay.style.zIndex = '3000';
      successOverlay.style.display = 'flex';
      successOverlay.style.alignItems = 'center';
      successOverlay.style.justifyContent = 'center';
      successOverlay.style.color = '#FCFBF8';
      successOverlay.style.fontFamily = "'Playfair Display', Georgia, serif";
      successOverlay.style.textAlign = 'center';
      successOverlay.style.padding = '2rem';
      successOverlay.style.opacity = '0';
      successOverlay.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

      successOverlay.innerHTML = `
        <div style="max-width: 600px; border: 1px solid rgba(200, 169, 106, 0.3); padding: 4rem 2rem; border-radius: 4px; background: rgba(23, 58, 47, 0.85); backdrop-filter: blur(10px);">
          <div style="font-size: 4rem; color: #C8A96A; margin-bottom: 1.5rem; line-height: 1;">✧</div>
          <h2 style="font-size: 2.5rem; font-weight: 400; margin-bottom: 1rem; color: #C8A96A;">Reservation Requested</h2>
          <p style="font-family: 'Manrope', sans-serif; font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; line-height: 1.8;">
            A sanctuary suite is waiting for you.<br>
            Checking availability for <strong style="color: #FCFBF8">${category || 'Our Finest Cottage'}</strong> from <strong>${formattedCheckin}</strong> to <strong>${formattedCheckout}</strong> for <strong>${guests}</strong>.
          </p>
          <button class="close-overlay" style="border: 1px solid #C8A96A; color: #C8A96A; font-family: 'Manrope', sans-serif; padding: 0.9rem 2.2rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all 0.3s;">
            Return to Sanctuary
          </button>
        </div>
      `;

      document.body.appendChild(successOverlay);
      document.body.style.overflow = 'hidden';

      // Fade in trigger
      setTimeout(() => {
        successOverlay.style.opacity = '1';
      }, 50);

      // Button interaction
      const closeBtn = successOverlay.querySelector('.close-overlay');
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.backgroundColor = '#C8A96A';
        closeBtn.style.color = '#173A2F';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.color = '#C8A96A';
      });
      closeBtn.addEventListener('click', () => {
        successOverlay.style.opacity = '0';
        setTimeout(() => {
          successOverlay.remove();
          document.body.style.overflow = 'auto';
        }, 600);
      });
    });
  });

});
