/* ===== BREW & BEAN CAFE — MAIN SCRIPT ===== */

// ==================== CART HELPERS (delegates to Cart module in cart.js) ====================
// addToCart is the global called by menu.html inline onclick handlers.
// It wraps Cart.add() so the menu page only needs script.js loaded.
function addToCart(id, name, price, category, image) {
  Cart.add({ id, name, price, category, image });
  const added = Cart.getAll().find(i => i.id === id);
  if (added && added.qty > 1) {
    showToast(`Added another ${name}!`, 'success', '<i class="fas fa-mug-saucer"></i>');
  } else {
    showToast(`${name} added to cart!`, 'success', '<i class="fas fa-cart-shopping"></i>');
  }

  // Button bounce effect
  const btn = document.querySelector(`[data-id="${id}"]`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<span>+</span> Add to Cart';
    }, 1200);
  }
}

function updateCartUI() {
  const count = Cart.getCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ==================== NAVBAR ====================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  // Scroll effect
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  updateCartUI();
}

// ==================== DARK MODE ====================
function initTheme() {
  const saved = localStorage.getItem('bb_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bb_theme', next);
      updateThemeIcon(next);
    });
  });
}

function updateThemeIcon(theme) {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    btn.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
  });
}

// ==================== TOAST ====================
function showToast(message, type = 'info', icon = '<i class="fas fa-circle-info"></i>', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${message}</span>
    <span class="toast-close"><i class="fas fa-xmark"></i></span>
  `;

  container.appendChild(toast);

  const close = () => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', close);
  setTimeout(close, duration);
}

// ==================== SCROLL REVEAL ====================
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==================== FORM VALIDATION ====================
function validateField(input) {
  const value = input.value.trim();
  const type = input.dataset.validate;
  const errorEl = input.parentElement.querySelector('.form-error') ||
                  input.closest('.form-group')?.querySelector('.form-error');
  let error = '';

  switch (type) {
    case 'name':
      if (!value) error = 'Name is required';
      else if (value.length < 2) error = 'Name must be at least 2 characters';
      break;
    case 'email':
      if (!value) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address';
      break;
    case 'password':
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
      break;
    case 'confirm-password': {
      const pw = document.querySelector('[data-validate="password"]')?.value;
      if (!value) error = 'Please confirm your password';
      else if (value !== pw) error = 'Passwords do not match';
      break;
    }
    case 'message':
      if (!value) error = 'Message is required';
      else if (value.length < 10) error = 'Message is too short (min 10 characters)';
      break;
  }

  if (errorEl) {
    errorEl.textContent = error;
    errorEl.classList.toggle('show', !!error);
  }
  input.classList.toggle('error', !!error);
  return !error;
}

function initFormValidation(formId, onSuccess) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('[data-validate]');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    inputs.forEach(input => {
      if (!validateField(input)) valid = false;
    });
    if (valid && typeof onSuccess === 'function') onSuccess();
  });
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ==================== PAGE TRANSITION ====================
function initPageTransition() {
  document.body.classList.add('page-transition');
  document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('javascript') || href === '') return;
      // Page transitions are handled by browser naturally
    });
  });
}

// ==================== INPUT FOCUS EFFECTS ====================
function initFocusEffects() {
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--caramel)';
      input.style.boxShadow = '0 0 0 3px rgba(192,124,58,0.18)';
      input.style.transform = 'scale(1.01)';
      input.style.transition = 'all 0.25s ease';
    });
    input.addEventListener('blur', () => {
      if (!input.classList.contains('error')) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        input.style.transform = '';
      }
    });
  });
}

// ==================== CHARACTER COUNTER ====================
function initCharCounter() {
  document.querySelectorAll('[data-maxlength]').forEach(input => {
    const max = parseInt(input.dataset.maxlength);
    if (isNaN(max)) return;
    if (input.type === 'password' || input.type === 'email') return;
    const counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.style.cssText = 'display:block;font-size:0.75rem;color:var(--text-muted,#888);text-align:right;margin-top:4px;transition:color 0.2s;';
    counter.textContent = `0 / ${max} characters`;
    input.parentElement.appendChild(counter);

    input.addEventListener('input', () => {
      const len = input.value.length;
      counter.textContent = `${len} / ${max} characters`;
      if (len > max * 0.9) {
        counter.style.color = '#e74c3c';
      } else if (len > max * 0.7) {
        counter.style.color = '#f39c12';
      } else {
        counter.style.color = 'var(--text-muted,#888)';
      }
    });
  });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initReveal();
  initSmoothScroll();
  initCounters();
  initPageTransition();
  initFocusEffects();
  initCharCounter();
});