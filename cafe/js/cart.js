/* ===== BREW & BEAN — CART MODULE ===== */
'use strict';

const Cart = (() => {
  const STORAGE_KEY = 'bb_cart';

  let _cart = [];

  function load() {
    try { _cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { _cart = []; }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_cart));
    _updateAllCounters();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: _cart } }));
  }

  function getAll()      { return [..._cart]; }
  function getCount()    { return _cart.reduce((s, i) => s + i.qty, 0); }
  function getSubtotal() { return _cart.reduce((s, i) => s + i.price * i.qty, 0); }

  function add(item) {
    load();
    const ex = _cart.find(i => i.id === item.id);
    if (ex) { ex.qty = Math.min(ex.qty + 1, 20); }
    else { _cart.push({ ...item, qty: 1 }); }
    save();
  }

  function remove(id) {
    load();
    _cart = _cart.filter(i => i.id !== id);
    save();
  }

  function updateQty(id, qty) {
    load();
    const item = _cart.find(i => i.id === id);
    if (!item) return;
    if (qty <= 0) { remove(id); return; }
    item.qty = Math.min(qty, 20);
    save();
  }

  function clear() {
    _cart = [];
    save();
  }

  function _updateAllCounters() {
    const count = getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Init
  load();
  document.addEventListener('DOMContentLoaded', () => {
    _updateAllCounters();
  });

  return { add, remove, updateQty, clear, getAll, getCount, getSubtotal, load };
})();

// ===== CART PAGE RENDERER =====
function renderCartPage() {
  const items = Cart.getAll();
  const container = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmpty');
  const cartFull = document.getElementById('cartFull');
  if (!container) return;

  if (!items.length) {
    if (emptyState) emptyState.style.display = 'flex';
    if (cartFull) cartFull.style.display = 'none';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (cartFull) cartFull.style.display = 'grid';

  container.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-category">${item.category}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-unit-price">Rs. ${item.price.toLocaleString()} / item</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <div class="item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
        <button class="remove-item-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i> Remove</button>
      </div>
    </div>
  `).join('');

  updateSummary();
}

function changeQty(id, delta) {
  Cart.load();
  const items = Cart.getAll();
  const item = items.find(i => i.id === id);
  if (item) {
    Cart.updateQty(id, item.qty + delta);
    renderCartPage();
    if (item.qty + delta <= 0) showCartToast(`${item.name} removed`, 'info');
  }
}

function removeItem(id) {
  Cart.load();
  const items = Cart.getAll();
  const item = items.find(i => i.id === id);
  Cart.remove(id);
  renderCartPage();
  if (item) showCartToast(`${item.name} removed from cart`, 'info');
}

function updateSummary() {
  const subtotal = Cart.getSubtotal();
  const delivery = subtotal > 2000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;
  const discount = parseInt(sessionStorage.getItem('bb_promo_discount') || '0');
  const finalTotal = Math.max(total - discount, 0);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summarySubtotal', `Rs. ${subtotal.toLocaleString()}`);
  set('summaryDelivery', delivery === 0 ? 'Free' : `Rs. ${delivery}`);
  set('summaryTax', `Rs. ${tax.toLocaleString()}`);
  set('summaryDiscount', discount > 0 ? `-Rs. ${discount}` : '—');
  set('summaryTotal', `Rs. ${finalTotal.toLocaleString()}`);
  set('cartItemCount', Cart.getCount() + ' items');
}

function applyPromo(code) {
  const codes = { 'BREW20': 200, 'FIRST50': 500, 'LOYAL': 150, 'SAVE10': 100 };
  const discount = codes[code.toUpperCase()];
  if (discount) {
    sessionStorage.setItem('bb_promo_discount', discount);
    updateSummary();
    showCartToast(`Promo applied! Rs. ${discount} off <i class="fas fa-champagne-glasses"></i>`, 'success');
    return true;
  }
  showCartToast('Invalid promo code', 'error');
  return false;
}

function showCartToast(msg, type = 'info') {
  if (typeof showToast === 'function') {
    const icons = { success: '<i class="fas fa-circle-check"></i>', error: '<i class="fas fa-circle-xmark"></i>', info: '<i class="fas fa-circle-info"></i>' };
    showToast(msg, type, icons[type]);
  }
}

// Expose globals
window.changeQty  = changeQty;
window.removeItem = removeItem;
window.applyPromo = applyPromo;
window.Cart       = Cart;