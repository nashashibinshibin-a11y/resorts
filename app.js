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
      const hoverables = 'a, button, input, select, textarea, .gallery-item, .slider-control, .slider-dot';
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
  const scrollContainer = document.getElementById('heroScrollContainer');

  const toggleHeaderState = () => {
    const scrollPos = window.scrollY;
    const maxScroll = scrollContainer ? (scrollContainer.clientHeight - window.innerHeight) : 0;
    
    // Transform to floating pill after scrolling past the sticky hero sequence
    if (scrollPos > maxScroll + 50) {
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


  // --- Scroll-Driven Cinematic Canvas Sequence Player ---
  const canvas = document.getElementById('heroCanvas');
  const loaderBar = document.getElementById('loaderBar');
  const introLoader = document.getElementById('introLoader');
  const heroContent = document.querySelector('.hero-content');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const frameCount = 125;
    const frames = [];
    let loadedCount = 0;
    
    // LERP smoothing variables
    let targetFrame = 0;
    let currentFrame = 0;
    const ease = 0.15; // Smooth interpolation speed factor

    // Helper: Draw image with object-fit: cover sizing
    const drawImageCover = (img) => {
      const w = canvas.width;
      const h = canvas.height;
      const iw = img.width;
      const ih = img.height;
      const r = Math.min(w / iw, h / ih);
      let nw = iw * r;
      let nh = ih * r;
      let cx, cy, cw, ch, ar = 1;

      if (nw < w) ar = w / nw;
      if (Math.abs(nh - h) < 0.0001 && nw < w) ar = w / nw;
      if (nh < h) ar = h / nh;
      nw *= ar;
      nh *= ar;

      cw = iw / (nw / w);
      ch = ih / (nh / h);

      cx = (iw - cw) * 0.5;
      cy = (ih - ch) * 0.5;

      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
    };

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      if (frames[Math.round(currentFrame)]) {
        drawImageCover(frames[Math.round(currentFrame)]);
      }
    };
    window.addEventListener('resize', resizeCanvas);
    
    // Initial size setup
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const checkRevealTriggers = (frameIndex) => {
      // Dynamic reveal transitions that adapt in BOTH scroll directions
      if (frameIndex >= 75) {
        header.classList.add('logo-visible');
      } else {
        header.classList.remove('logo-visible');
      }

      if (frameIndex >= 90) {
        header.classList.add('menu-visible');
      } else {
        header.classList.remove('menu-visible');
      }

      if (frameIndex >= 100) {
        if (heroContent) heroContent.classList.add('heading-visible');
      } else {
        if (heroContent) heroContent.classList.remove('heading-visible');
      }

      if (frameIndex >= 110) {
        if (heroContent) heroContent.classList.add('text-visible');
      } else {
        if (heroContent) heroContent.classList.remove('text-visible');
      }

      if (frameIndex >= 120) {
        if (heroContent) heroContent.classList.add('cta-visible');
      } else {
        if (heroContent) heroContent.classList.remove('cta-visible');
      }
    };

    // Calculate target frame on scroll
    const updateTargetFrameOnScroll = () => {
      if (scrollContainer) {
        const containerHeight = scrollContainer.clientHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = containerHeight - windowHeight;
        const scrollPos = window.scrollY;

        let progress = scrollPos / maxScroll;
        progress = Math.min(1, Math.max(0, progress));

        targetFrame = progress * (frameCount - 1);
      }
    };
    window.addEventListener('scroll', updateTargetFrameOnScroll);

    // Continuous LERP update loop
    const updateFrameLoop = () => {
      const diff = targetFrame - currentFrame;
      
      // Update canvas only when a change is detected to conserve computing power
      if (Math.abs(diff) > 0.01) {
        currentFrame += diff * ease;
        const idx = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrame)));
        
        if (frames[idx]) {
          drawImageCover(frames[idx]);
        }
        
        checkRevealTriggers(currentFrame);
      }
      
      requestAnimationFrame(updateFrameLoop);
    };

    const startIntro = () => {
      // 1. Draw initial cover frames
      updateTargetFrameOnScroll();
      currentFrame = targetFrame;
      const startIdx = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrame)));
      if (frames[startIdx]) {
        drawImageCover(frames[startIdx]);
      }
      checkRevealTriggers(currentFrame);
      
      // 2. Hide loader screen
      if (introLoader) {
        introLoader.classList.add('fade-out');
        setTimeout(() => {
          introLoader.style.display = 'none';
        }, 1200);
      }

      // 3. Enable normal scrolling (unlock body viewport scroll)
      document.body.classList.remove('intro-running');

      // 4. Start LERP follow loop
      requestAnimationFrame(updateFrameLoop);
    };

    // Get frame filename path
    const getFramePath = (index) => {
      const pad = String(index).padStart(3, '0');
      return `images/hero section/frame_${pad}.png`;
    };

    // Preload image files
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        const progress = (loadedCount / frameCount) * 100;
        if (loaderBar) {
          loaderBar.style.width = `${progress}%`;
        }
        
        if (loadedCount === frameCount) {
          startIntro();
        }
      };
      
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          startIntro();
        }
      };
      
      frames.push(img);
    }
  }


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
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let activeIndex = 0;
  let autoPlayTimer;

  if (slides.length > 0) {
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
    updateSliderUI();
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
