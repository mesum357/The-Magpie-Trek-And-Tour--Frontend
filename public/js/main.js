// Main JavaScript file for The Magpie Treks & Tours website

// Global variables
let currentLanguage = 'en';
let translations = {};

// Initialize the website
document.addEventListener('DOMContentLoaded', function () {
  console.log('The Magpie Treks & Tours website loaded successfully!');

  // Initialize language system
  initializeLanguageSystem();

  // Initialize other components
  initializeComponents();
});

// Language System Functions
// Handled by language-script.ejs natively.
function initializeLanguageSystem() {
  // Do nothing
}

// Component Initialization
function initializeComponents() {
  // Initialize smooth scrolling for anchor links
  initializeSmoothScrolling();

  // Initialize scroll effects
  initializeScrollEffects();

  // Initialize form validations
  initializeFormValidations();
}

// Smooth Scrolling
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Scroll Effects
function initializeScrollEffects() {
  // Fade in elements on scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// Form Validations
function initializeFormValidations() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      showFieldError(field, 'This field is required');
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });

  return isValid;
}

function showFieldError(field, message) {
  clearFieldError(field);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.color = '#ff4757';
  errorDiv.style.fontSize = '12px';
  errorDiv.style.marginTop = '5px';

  field.parentNode.appendChild(errorDiv);
  field.style.borderColor = '#ff4757';
}

function clearFieldError(field) {
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  field.style.borderColor = '';
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for global use
window.MagpieWebsite = {
  getCurrentLanguage: () => currentLanguage
};


// CARDS SECTION 1
// Intersection observer for cards & stats
(function () {
  const cardOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const cards = document.querySelectorAll('.service-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delayMap = { left: 0, up: 120, right: 240 };
        const animType = el.dataset.anim || el.classList.contains('anim-left') ? 'left' : (el.classList.contains('anim-up') ? 'up' : 'right');
        setTimeout(() => {
          el.classList.add('in-view');
        }, delayMap[animType] || 0);
        cardObserver.unobserve(el);
      }
    });
  }, cardOptions);

  cards.forEach(c => cardObserver.observe(c));
})();

/* ===================================================
   TESTIMONIAL STORIES — Instagram Story Slider (2 at a time)
   Uses window.__TESTIMONIALS__ injected from server
   =================================================== */
(function () {
  // Read testimonials from server-injected data
  var serverData = window.__TESTIMONIALS__ || [];

  // Map server data to story card format
  var DATA = serverData.map(function (t) {
    return {
      name: t.name || 'Guest',
      loc: t.country || '',
      avatar: t.avatarUrl || '',
      storyImg: t.storyImgUrl || ''
    };
  });

  // If no testimonials, hide the section and exit
  if (DATA.length === 0) {
    var section = document.getElementById('testimonials-section');
    if (section) section.style.display = 'none';
    return;
  }

  var storiesWrap = document.getElementById('tsStories');
  var progressWrap = document.getElementById('tsProgressBars');
  var dotsWrap = document.getElementById('tsStoryDots');

  if (!storiesWrap || !progressWrap || !dotsWrap) return;

  var PAIR_SIZE = 2; // Show 2 stories at a time
  var totalPairs = Math.ceil(DATA.length / PAIR_SIZE);

  /* -- Render Story Cards -- */
  DATA.forEach(function (t, i) {
    var story = document.createElement('article');
    story.className = 'ts-story';
    story.setAttribute('role', 'group');
    story.setAttribute('aria-roledescription', 'story');
    story.setAttribute('aria-label', t.name + ', ' + t.loc);
    story.dataset.index = i;

    var imgSrc = t.storyImg || '';
    story.innerHTML =
      '<img class="ts-story-img" src="' + imgSrc + '" alt="Testimonial from ' + t.name + '" loading="lazy">' +
      '<div class="ts-story-overlay">' +
      '<div class="ts-story-author">' +
      (t.avatar ? '<img class="ts-story-avatar" src="' + t.avatar + '" alt="' + t.name + '">' : '') +
      '<div>' +
      '<span class="ts-story-name">' + t.name + '</span>' +
      '<span class="ts-story-loc">' + t.loc + '</span>' +
      '</div>' +
      '</div>' +
      '</div>';
    story.addEventListener('click', function () {
      var pairIndex = Math.floor(i / PAIR_SIZE);
      goTo(pairIndex);
    });
    storiesWrap.appendChild(story);
  });

  /* -- Render Progress Bars (one per pair) -- */
  for (var p = 0; p < totalPairs; p++) {
    var bar = document.createElement('div');
    bar.className = 'ts-progress-bar';
    bar.innerHTML = '<div class="ts-progress-fill"></div>';
    (function (idx) {
      bar.addEventListener('click', function () { goTo(idx); });
    })(p);
    progressWrap.appendChild(bar);
  }

  /* -- Render Dots (one per pair) -- */
  for (var d = 0; d < totalPairs; d++) {
    var dot = document.createElement('button');
    dot.className = 'ts-story-dot';
    dot.setAttribute('aria-label', 'Go to stories ' + (d * PAIR_SIZE + 1) + '-' + Math.min((d + 1) * PAIR_SIZE, DATA.length));
    dot.setAttribute('aria-pressed', 'false');
    (function (idx) {
      dot.addEventListener('click', function () { goTo(idx); });
    })(d);
    dotsWrap.appendChild(dot);
  }

  var stories = Array.from(storiesWrap.querySelectorAll('.ts-story'));
  var bars = Array.from(progressWrap.querySelectorAll('.ts-progress-bar'));
  var dots = Array.from(dotsWrap.querySelectorAll('.ts-story-dot'));
  var currentPair = 0;
  var autoTimer = null;
  var AUTO_INTERVAL = 5000;

  /* -- Render / Update -- */
  function render() {
    var startIdx = currentPair * PAIR_SIZE;
    var endIdx = startIdx + PAIR_SIZE;

    stories.forEach(function (s, i) {
      s.classList.toggle('active', i >= startIdx && i < endIdx);
    });

    bars.forEach(function (b, i) {
      b.classList.remove('active', 'completed');
      if (i < currentPair) b.classList.add('completed');
      else if (i === currentPair) b.classList.add('active');
    });

    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentPair);
      d.setAttribute('aria-pressed', i === currentPair ? 'true' : 'false');
    });
  }

  function goTo(pairIdx) {
    currentPair = ((pairIdx % totalPairs) + totalPairs) % totalPairs;
    render();
    resetAutoAdvance();
  }

  function next() {
    goTo(currentPair + 1);
  }

  function resetAutoAdvance() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(next, AUTO_INTERVAL);
  }

  /* -- Keyboard nav -- */
  var root = document.getElementById('testimonials-section');
  if (root) {
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(currentPair - 1); }
      if (e.key === 'ArrowRight') { goTo(currentPair + 1); }
    });
  }

  /* -- Touch / Swipe -- */
  var startX = 0, startY = 0, isMoving = false;
  var threshold = 40;
  var stage = document.querySelector('#testimonials-section .ts-stage');

  if (stage) {
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isMoving = true;
      }
    }, { passive: true });

    stage.addEventListener('touchmove', function (e) {
      if (!isMoving || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;
      if (Math.abs(dy) > Math.abs(dx)) {
        isMoving = false;
        return;
      }
      if (Math.abs(dx) > 8) e.preventDefault();
    }, { passive: false });

    stage.addEventListener('touchend', function (e) {
      if (!isMoving) return;
      var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
      var dx = endX - startX;
      if (Math.abs(dx) > threshold) {
        if (dx > 0) goTo(currentPair - 1);
        else goTo(currentPair + 1);
      }
      isMoving = false;
    });

    /* -- Pause auto-advance on hover -- */
    stage.addEventListener('mouseenter', function () {
      if (autoTimer) clearInterval(autoTimer);
    });
    stage.addEventListener('mouseleave', function () {
      resetAutoAdvance();
    });
  }

  /* -- Init -- */
  render();
  resetAutoAdvance();
})();