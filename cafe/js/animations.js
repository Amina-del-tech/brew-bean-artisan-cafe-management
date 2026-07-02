/* ===== BREW & BEAN — ANIMATIONS MODULE ===== */
'use strict';

// ===== PAGE LOADER =====
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => loader.remove(), 500);
    }, 600);
  });
}

// ===== HERO CAROUSEL =====
function initHeroCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const slides = container.querySelectorAll('.carousel-slide');
  const dots   = container.querySelectorAll('.carousel-dot');
  const prev   = container.querySelector('.carousel-prev');
  const next   = container.querySelector('.carousel-next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Touch swipe
  let touchX = 0;
  container.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

  goTo(0);
  startAuto();
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
}

// ===== FLOATING ELEMENTS =====
function initFloatingElements() {
  document.querySelectorAll('.float-anim').forEach((el, i) => {
    el.style.animation = `floatBob ${3 + i * 0.5}s ease-in-out infinite alternate`;
    el.style.animationDelay = `${i * 0.3}s`;
  });
}

// ===== PARALLAX =====
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

// ===== NUMBER COUNTER =====
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target || el.dataset.counter || 0);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const isFloat = String(target).includes('.');
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = target * ease;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-target], [data-counter]').forEach(el => observer.observe(el));
}

// ===== STAGGER ANIMATION =====
function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const delay = parseFloat(parent.dataset.stagger) || 0.1;
    parent.children && Array.from(parent.children).forEach((child, i) => {
      child.style.animationDelay = `${i * delay}s`;
      child.classList.add('stagger-child');
    });
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

// ===== TYPING ANIMATION =====
function initTyping(el, texts, speed = 80, pause = 2000) {
  if (!el) return;
  let textIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = texts[textIdx];
    el.textContent = current.slice(0, charIdx);
    if (!deleting && charIdx < current.length) { charIdx++; setTimeout(type, speed); }
    else if (!deleting && charIdx === current.length) { deleting = true; setTimeout(type, pause); }
    else if (deleting && charIdx > 0) { charIdx--; setTimeout(type, speed / 2); }
    else { deleting = false; textIdx = (textIdx + 1) % texts.length; setTimeout(type, 300); }
  }
  type();
}

// ===== CSS ANIMATIONS INJECT =====
function injectAnimationStyles() {
  if (document.getElementById('anim-styles')) return;
  const style = document.createElement('style');
  style.id = 'anim-styles';
  style.textContent = `
    .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.7s ease, transform 0.7s ease; }
    .reveal.visible { opacity:1; transform:translateY(0); }
    .reveal-left { opacity:0; transform:translateX(-30px); transition:opacity 0.7s ease, transform 0.7s ease; }
    .reveal-left.visible { opacity:1; transform:translateX(0); }
    .reveal-right { opacity:0; transform:translateX(30px); transition:opacity 0.7s ease, transform 0.7s ease; }
    .reveal-right.visible { opacity:1; transform:translateX(0); }
    .reveal-scale { opacity:0; transform:scale(0.9); transition:opacity 0.6s ease, transform 0.6s ease; }
    .reveal-scale.visible { opacity:1; transform:scale(1); }
    .delay-1 { transition-delay:0.1s!important; }
    .delay-2 { transition-delay:0.2s!important; }
    .delay-3 { transition-delay:0.3s!important; }
    .delay-4 { transition-delay:0.4s!important; }
    .delay-5 { transition-delay:0.5s!important; }
    @keyframes floatBob { from { transform:translateY(0); } to { transform:translateY(-12px); } }
    @keyframes spinSlow { from { transform:rotate(0); } to { transform:rotate(360deg); } }
    @keyframes pulseSoft { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    .spin-slow { animation:spinSlow 8s linear infinite; }
    .pulse-soft { animation:pulseSoft 2s ease-in-out infinite; }
    /* Page loader */
    #pageLoader { position:fixed;inset:0;background:var(--espresso,#1a0a00);z-index:10000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:opacity 0.5s,visibility 0.5s; }
    #pageLoader.loaded { opacity:0;visibility:hidden; }
    .loader-cup { font-size:3rem;animation:floatBob 1s ease-in-out infinite alternate; }
    .loader-bar { width:160px;height:3px;background:rgba(192,124,58,0.2);border-radius:2px;overflow:hidden; }
    .loader-fill { height:100%;background:var(--caramel,#c07c3a);border-radius:2px;animation:loadFill 0.8s ease forwards; }
    @keyframes loadFill { from{width:0} to{width:100%} }
    .loader-text { font-family:'Playfair Display',serif;color:rgba(245,234,214,0.6);font-size:0.85rem;letter-spacing:0.15em; }
    /* Hero carousel */
    .carousel-slide { position:absolute;inset:0;opacity:0;transition:opacity 0.8s ease; }
    .carousel-slide.active { opacity:1; }
    .carousel-dot { width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.3);cursor:pointer;transition:all 0.3s; }
    .carousel-dot.active { background:white;width:24px;border-radius:4px; }
    /* Stagger */
    .stagger-child { opacity:0;transform:translateY(20px);animation:staggerIn 0.6s ease forwards; }
    @keyframes staggerIn { to{opacity:1;transform:translateY(0)} }
  `;
  document.head.appendChild(style);
}

// ===== ORDER SUCCESS POPUP =====
function showOrderSuccess(orderNum, total) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fadeIn 0.3s ease;';
  overlay.innerHTML = `
    <div style="background:var(--card-bg,#fdf8f0);border-radius:24px;padding:48px 40px;text-align:center;max-width:420px;width:90%;box-shadow:0 30px 80px rgba(0,0,0,0.3);animation:floatBob 0s,popIn 0.5s cubic-bezier(0.34,1.56,0.64,1);">
      <div style="font-size:4rem;margin-bottom:16px;color:#2ecc71;animation:spinSlow 0s,bounceIn 0.6s ease;"><i class="fas fa-circle-check"></i></div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--espresso,#1a0a00);margin-bottom:8px;">Order Placed!</h2>
      <p style="font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:var(--cocoa,#6b3a1f);margin-bottom:20px;">Your order <strong style="color:#c07c3a">${orderNum}</strong> has been received. Preparing your items with love <i class="fas fa-mug-saucer"></i></p>
      <div style="background:var(--latte-soft,#f5ead6);border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="font-size:0.8rem;color:var(--muted,#8a6a50);margin-bottom:4px;">Total Charged</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#c07c3a;">${total}</div>
      </div>
      <p style="font-size:0.82rem;color:var(--muted,#8a6a50);margin-bottom:24px;">Estimated delivery: 25–35 minutes</p>
      <div style="display:flex;gap:10px;justify-content:center;">
        <a href="orders.html" style="padding:12px 24px;background:#c07c3a;color:white;border-radius:50px;font-weight:600;font-size:0.88rem;text-decoration:none;">Track Order</a>
        <a href="index.html" style="padding:12px 24px;border:2px solid rgba(192,124,58,0.3);color:var(--cocoa,#6b3a1f);border-radius:50px;font-weight:600;font-size:0.88rem;text-decoration:none;">Back to Home</a>
      </div>
    </div>`;
  const style = document.createElement('style');
  style.textContent = '@keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ===== LOADING SKELETON =====
function showSkeletons(containerId, count = 3) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array(count).fill(`
    <div style="background:var(--dash-card,#fff);border-radius:16px;padding:20px;border:1px solid var(--dash-border,rgba(192,124,58,0.12));">
      <div style="height:120px;background:linear-gradient(90deg,#f0e8d8 25%,#e8d8c0 50%,#f0e8d8 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:10px;margin-bottom:14px;"></div>
      <div style="height:14px;background:linear-gradient(90deg,#f0e8d8 25%,#e8d8c0 50%,#f0e8d8 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:4px;margin-bottom:8px;"></div>
      <div style="height:10px;width:60%;background:linear-gradient(90deg,#f0e8d8 25%,#e8d8c0 50%,#f0e8d8 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:4px;"></div>
    </div>`).join('');
  const s = document.createElement('style');
  s.textContent = '@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}';
  if (!document.getElementById('shimmer-style')) { s.id = 'shimmer-style'; document.head.appendChild(s); }
}

// ===== INIT ALL =====
function initAnimations() {
  injectAnimationStyles();
  initPageLoader();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initStagger();
}

document.addEventListener('DOMContentLoaded', initAnimations);

// ===== EXPORTS =====
window.initHeroCarousel = initHeroCarousel;
window.showOrderSuccess = showOrderSuccess;
window.initTyping       = initTyping;
window.showSkeletons    = showSkeletons;
window.initParallax     = initParallax;