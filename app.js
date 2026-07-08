document.addEventListener('DOMContentLoaded', () => {

  // --- Custom Luxury Mouse Cursor ---
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');
  
  if (cursorDot && cursorRing) {
    // Only activate cursor tracking on desktop hoverable devices
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isDesktop) {
      cursorDot.style.display = 'block';
      cursorRing.style.display = 'block';

      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate movement for dot
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      });

      // Smooth lag-follow loop for the outer ring using requestAnimationFrame
      const updateRingPosition = () => {
        const ease = 0.15; // Delay factor
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(updateRingPosition);
      };
      updateRingPosition();

      // Show/Hide cursor when entering/leaving window
      document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      });
      document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });

      // Expand ring when hovering interactive elements
      const hoverables = 'a, button, input, select, textarea, .gallery-item, .slider-control, .slider-dot, .hero-card, .control-arrow';
      document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverables)) {
          cursorRing.classList.add('active');
        }
      });
      document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverables)) {
          cursorRing.classList.remove('active');
        }
      });
    }
  }


  // --- Sticky Header Scroll Transition ---
  const header = document.querySelector('header');

  const toggleHeaderState = () => {
    // Transition header styling when scrolling down from the top of the page
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', toggleHeaderState);
  toggleHeaderState();


  // --- Mobile Navigation Menu Drawer ---
  const navToggle = document.querySelector('.nav-toggle');
  const navClose = document.querySelector('.nav-close');
  const mobileMenu = document.querySelector('.nav-menu-mobile');
  const mobileLinks = document.querySelectorAll('.nav-menu-mobile .nav-link');

  const openMobileMenu = () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (navToggle) navToggle.addEventListener('click', openMobileMenu);
  if (navClose) navClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  // --- Scroll-Based Parallax Background ---
  const natureBg = document.querySelector('.nature-bg');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Translate backgrounds slowly based on scroll positions
    if (natureBg) {
      const parentRect = natureBg.parentElement.getBoundingClientRect();
      const parentTop = parentRect.top + scrollPos;
      const offset = scrollPos - parentTop;
      natureBg.style.transform = `translate3d(0, ${offset * 0.15}px, 0)`;
    }
  });


  // --- Interactive Hero Section Slider ---
  const slides = document.querySelectorAll('.hero-slide');
  const cards = document.querySelectorAll('.hero-card');
  const mobileSelectorItems = document.querySelectorAll('.mobile-selector-item');
  const contentWrapper = document.querySelector('.hero-content-wrapper');
  
  const slideTagline = document.querySelector('.slide-tagline');
  const slideTitle = document.querySelector('.slide-title');
  const slideDesc = document.querySelector('.slide-desc');
  const slideBtnMain = document.querySelector('.slide-btn-main');

  const slideData = [
    {
      tagline: "Wellness Experience",
      title: "Luxury Wellness That Changes Your Life",
      desc: "Reconnect with yourself through immersive wellness retreats surrounded by the untouched beauty of Wayanad.",
      btnMain: "Explore Retreat",
      linkMain: "#booking"
    },
    {
      tagline: "Culinary Experience",
      title: "Dining Above the Forest Canopy",
      desc: "Experience unforgettable evenings with curated cuisine served among the treetops and breathtaking landscapes.",
      btnMain: "Explore Retreat",
      linkMain: "#booking"
    },
    {
      tagline: "Sanctuary Experience",
      title: "A Sanctuary Hidden Within Nature",
      desc: "Wake up to misty mountains, tranquil infinity pools, and luxurious suites designed for complete relaxation.",
      btnMain: "Explore Retreat",
      linkMain: "#booking"
    }
  ];

  let currentIdx = 0;
  let isTransitioning = false;

  const changeSlide = (targetIdx) => {
    if (isTransitioning || targetIdx === currentIdx) return;
    isTransitioning = true;

    // 1. Add transition class to content wrapper to trigger staggered fade-out
    if (contentWrapper) {
      contentWrapper.classList.add('slide-changing');
    }

    // 2. Update active slide layer
    slides[currentIdx].classList.remove('active');
    slides[targetIdx].classList.add('active');

    // 3. Update active card preview (desktop layout tabs)
    if (cards.length > 0) {
      cards[currentIdx].classList.remove('active');
      cards[targetIdx].classList.add('active');
    }

    // 4. Update active mobile selector items (mobile layout tabs)
    if (mobileSelectorItems.length > 0) {
      mobileSelectorItems[currentIdx].classList.remove('active');
      mobileSelectorItems[targetIdx].classList.add('active');
    }

    // Reset slide scroll translation instantly for both slides to avoid parallax jumps
    slides[currentIdx].style.transform = 'translate3d(0, 0, 0)';
    const scrollPos = window.scrollY;
    if (scrollPos < window.innerHeight) {
      slides[targetIdx].style.transform = `translate3d(0, ${scrollPos * 0.15}px, 0)`;
    } else {
      slides[targetIdx].style.transform = 'translate3d(0, 0, 0)';
    }

    // 5. Update texts and fade content back in after fade-out transition finishes (350ms)
    setTimeout(() => {
      // Update text fields
      if (slideTagline) slideTagline.textContent = slideData[targetIdx].tagline;
      if (slideTitle) slideTitle.innerHTML = slideData[targetIdx].title;
      if (slideDesc) slideDesc.textContent = slideData[targetIdx].desc;
      if (slideBtnMain) {
        slideBtnMain.textContent = slideData[targetIdx].btnMain;
        slideBtnMain.setAttribute('href', slideData[targetIdx].linkMain);
      }

      // Fade content back in with staggered CSS delay
      if (contentWrapper) {
        contentWrapper.classList.remove('slide-changing');
      }
      
      currentIdx = targetIdx;
      isTransitioning = false;
    }, 380);
  };

  // Click card previews to change slide (Desktop)
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const targetIdx = parseInt(card.getAttribute('data-index'), 10);
      changeSlide(targetIdx);
    });
  });

  // Tap mobile selector items to change slide (Mobile)
  mobileSelectorItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetIdx = parseInt(item.getAttribute('data-index'), 10);
      changeSlide(targetIdx);
    });
  });

  // --- Mobile Touch Swiping Gestures ---
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 55; // Min distance to trigger swipe
      if (touchEndX < touchStartX - threshold) {
        // Swipe Left -> Next Slide
        let targetIdx = currentIdx + 1;
        if (targetIdx >= slideData.length) targetIdx = 0;
        changeSlide(targetIdx);
        resetAutoPlay();
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe Right -> Prev Slide
        let targetIdx = currentIdx - 1;
        if (targetIdx < 0) targetIdx = slideData.length - 1;
        changeSlide(targetIdx);
        resetAutoPlay();
      }
    };
  }

  // Auto-play slides every 8 seconds for dynamic feel
  let autoPlayTimer = setInterval(() => {
    let targetIdx = currentIdx + 1;
    if (targetIdx >= slideData.length) targetIdx = 0;
    changeSlide(targetIdx);
  }, 8000);

  // Reset autoplay timer on user interaction
  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      let targetIdx = currentIdx + 1;
      if (targetIdx >= slideData.length) targetIdx = 0;
      changeSlide(targetIdx);
    }, 10000); // give user slightly more time on manual override
  };

  cards.forEach(card => card.addEventListener('click', resetAutoPlay));
  mobileSelectorItems.forEach(item => item.addEventListener('click', resetAutoPlay));
  if (prevBtn) prevBtn.addEventListener('click', resetAutoPlay);
  if (nextBtn) nextBtn.addEventListener('click', resetAutoPlay);

  // --- Background Image Scroll Parallax ---
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const activeSlide = document.querySelector('.hero-slide.active');
    if (activeSlide && scrollPos < window.innerHeight) {
      // Translate parent slide container for parallax scroll, allowing child slide-img to run CSS zoom scale animation
      activeSlide.style.transform = `translate3d(0, ${scrollPos * 0.15}px, 0)`;
    }
  });


  // --- Staggered Reveal Index Injector ---
  const revealGroups = document.querySelectorAll('.reveal-group');
  revealGroups.forEach(group => {
    const children = group.querySelectorAll('.reveal');
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-delay', index + 1);
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }


  // --- Active Nav Menu Section Link Tracker ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      threshold: 0.35, // Trigger active when 35% of the section is visible
      rootMargin: '-10% 0px -45% 0px'
    });

    sections.forEach(sec => navObserver.observe(sec));
  }


  // --- Testimonials Slideshow Slider ---
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDotsContainer = document.querySelector('.slider-dots');
  const testimonialPrev = document.querySelector('.slider-prev');
  const testimonialNext = document.querySelector('.slider-next');
  let testimonialActiveIndex = 0;
  let testimonialAutoPlayTimer;

  if (testimonialSlides.length > 0) {
    testimonialSlides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTestimonialSlide(index));
      if (testimonialDotsContainer) {
        testimonialDotsContainer.appendChild(dot);
      }
    });

    const testimonialDots = document.querySelectorAll('.slider-dot');

    const updateTestimonialSliderUI = () => {
      testimonialSlides.forEach((slide, idx) => {
        if (idx === testimonialActiveIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      testimonialDots.forEach((dot, idx) => {
        if (idx === testimonialActiveIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextTestimonialSlide = () => {
      testimonialActiveIndex = (testimonialActiveIndex + 1) % testimonialSlides.length;
      updateTestimonialSliderUI();
      resetTestimonialAutoplay();
    };

    const prevTestimonialSlide = () => {
      testimonialActiveIndex = (testimonialActiveIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
      updateTestimonialSliderUI();
      resetTestimonialAutoplay();
    };

    const goToTestimonialSlide = (idx) => {
      testimonialActiveIndex = idx;
      updateTestimonialSliderUI();
      resetTestimonialAutoplay();
    };

    const startTestimonialAutoplay = () => {
      testimonialAutoPlayTimer = setInterval(nextTestimonialSlide, 6000);
    };

    const resetTestimonialAutoplay = () => {
      clearInterval(testimonialAutoPlayTimer);
      startTestimonialAutoplay();
    };

    if (testimonialNext) testimonialNext.addEventListener('click', nextTestimonialSlide);
    if (testimonialPrev) testimonialPrev.addEventListener('click', prevTestimonialSlide);

    startTestimonialAutoplay();
    updateTestimonialSliderUI();
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
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  // --- Booking Interaction Concept ---
  const bookingForms = document.querySelectorAll('.booking-form-trigger');
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

      if (!checkin || !checkout) {
        alert('Please select both Check-In and Check-Out dates.');
        return;
      }

      if (new Date(checkin) >= new Date(checkout)) {
        alert('Check-Out date must be after your Check-In date.');
        return;
      }

      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedCheckin = new Date(checkin).toLocaleDateString('en-US', options);
      const formattedCheckout = new Date(checkout).toLocaleDateString('en-US', options);

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
        <div style="max-width: 600px; border: 1px solid rgba(200, 169, 106, 0.3); padding: 4rem 2rem; border-radius: 2px; background: rgba(23, 58, 47, 0.85); backdrop-filter: blur(15px);">
          <div style="font-size: 4rem; color: #C8A96A; margin-bottom: 1.5rem; line-height: 1;">✧</div>
          <h2 style="font-size: 2.5rem; font-weight: 300; margin-bottom: 1rem; color: #C8A96A; letter-spacing: -0.01em;">Sanctuary Requested</h2>
          <p style="font-family: 'Manrope', sans-serif; font-size: 1.05rem; opacity: 0.85; margin-bottom: 2.5rem; line-height: 1.8; font-weight: 300;">
            Checking availability for <strong style="color: #FCFBF8; font-weight: 600;">${category || 'Our Finest Cottage'}</strong><br>
            from <strong>${formattedCheckin}</strong> to <strong>${formattedCheckout}</strong> for <strong>${guests}</strong>.
          </p>
          <button class="close-overlay" style="border: 1px solid #C8A96A; color: #C8A96A; font-family: 'Manrope', sans-serif; padding: 1rem 2.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600; cursor: pointer; border-radius: 2px; transition: all 0.3s; background: transparent;">
            Return to Sanctuary
          </button>
        </div>
      `;

      document.body.appendChild(successOverlay);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        successOverlay.style.opacity = '1';
      }, 50);

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
