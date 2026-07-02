/* ===== BREW & BEAN — DASHBOARD MODULE ===== */
'use strict';

// ===== SIDEBAR COLLAPSE =====
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const collapseBtn = document.querySelector('.sidebar-collapse-btn');
  const overlay = document.querySelector('.sidebar-overlay');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (!sidebar) return;

  if (collapseBtn) {
    const saved = localStorage.getItem('bb_sidebar_collapsed');
    if (saved === 'true') sidebar.classList.add('collapsed');
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('bb_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    });
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      if (overlay) {
        overlay.style.opacity = sidebar.classList.contains('mobile-open') ? '1' : '0';
        overlay.style.pointerEvents = sidebar.classList.contains('mobile-open') ? 'all' : 'none';
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    });
  }
}

// ===== THEME TOGGLE =====
function initDashTheme() {
  const saved = localStorage.getItem('bb_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateDashThemeIcon(saved);
  document.querySelectorAll('.dash-theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bb_theme', next);
      updateDashThemeIcon(next);
    });
  });
}

function updateDashThemeIcon(theme) {
  document.querySelectorAll('.dash-theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

// ===== DASH TOAST =====
function dashToast(title, msg, icon = '<i class="fas fa-mug-saucer"></i>', duration = 3500) {
  let container = document.querySelector('.dash-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'dash-toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'dash-toast';
  t.style.position = 'relative';
  t.innerHTML = `<span class="dash-toast-icon">${icon}</span><div class="dash-toast-body"><div class="dash-toast-title">${title}</div><div class="dash-toast-msg">${msg}</div></div><span class="dash-toast-close"><i class="fas fa-xmark"></i></span><div class="dash-toast-bar"></div>`;
  container.appendChild(t);
  t.querySelector('.dash-toast-close').addEventListener('click', () => t.remove());
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(110%)';
    t.style.transition = '0.3s';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

// ===== STATUS BADGE HELPER =====
function statusBadge(status) {
  const map = {
    completed: 'badge-success',
    confirmed: 'badge-success',
    preparing: 'badge-info',
    pending:   'badge-warning',
    cancelled: 'badge-danger',
    'on-duty': 'badge-success',
    'off-duty':'badge-muted',
  };
  return `<span class="badge ${map[status] || 'badge-muted'}">${status}</span>`;
}

// ===== RENDER ORDERS TABLE FROM DB =====
function renderOrdersTable(tableId, limit = 6) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;

  fetch('api/get_orders.php')
    .then(r => r.json())
    .then(data => {
      if (!data.success || !data.orders.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--dash-muted);padding:20px;">No orders yet</td></tr>';
        return;
      }
      tbody.innerHTML = data.orders.slice(0, limit).map(o => {
        const items = Array.isArray(o.items) ? o.items.map(i => i.name + ' ×' + i.qty).join(', ') : '';
        const date = new Date(o.created_at).toLocaleString('en-PK', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'});
        return `<tr>
          <td><span style="font-weight:600;color:var(--dash-accent)">${o.order_no}</span></td>
          <td><span style="font-weight:500">${o.customer_name || 'Guest'}</span></td>
          <td class="text-muted text-sm">${items}</td>
          <td style="font-weight:700;color:var(--dash-accent)">Rs. ${parseFloat(o.total).toLocaleString()}</td>
          <td>${statusBadge(o.status)}</td>
          <td class="text-muted text-xs">${date}</td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn-d btn-d-ghost btn-d-sm btn-d-icon" title="View"><i class="fas fa-eye"></i></button>
            </div>
          </td>
        </tr>`;
      }).join('');
    })
    .catch(() => {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--dash-muted);padding:20px;">Could not load orders</td></tr>';
    });
}

// ===== RENDER RESERVATIONS FROM DB =====
function renderReservationsTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  fetch('api/get_reservations.php')
    .then(r => r.json())
    .then(data => {
      if (!data.success || !data.reservations.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--dash-muted);padding:20px;">No reservations yet</td></tr>';
        return;
      }
      tbody.innerHTML = data.reservations.slice(0, 5).map(r => `
        <tr>
          <td><span style="font-weight:600;color:var(--dash-accent)">#RES-${String(r.id).padStart(3,'0')}</span></td>
          <td style="font-weight:500">${r.name}</td>
          <td>${r.guests} guests</td>
          <td>${r.date} · ${r.time}</td>
          <td><span class="badge badge-accent">—</span></td>
          <td>${statusBadge(r.status)}</td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn-d btn-d-ghost btn-d-sm btn-d-icon"><i class="fas fa-check"></i></button>
              <button class="btn-d btn-d-danger btn-d-sm btn-d-icon"><i class="fas fa-xmark"></i></button>
            </div>
          </td>
        </tr>`).join('');
    })
    .catch(() => {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--dash-muted);padding:20px;">Could not load reservations</td></tr>';
    });
}

// ===== RENDER STAFF TABLE FROM DB =====
function renderStaffTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  fetch('api/get_users.php')
    .then(r => r.json())
    .then(data => {
      if (!data.success) return;
      const staff = data.users.filter(u => u.role === 'staff' || u.role === 'admin');
      if (!staff.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--dash-muted);padding:20px;">No staff members yet</td></tr>';
        return;
      }
      tbody.innerHTML = staff.map(s => {
        const initials = s.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
        return `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c07c3a,#c4521a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8rem;">${initials}</div>
              <div>
                <div style="font-weight:600">${s.name}</div>
                <div class="text-xs text-muted">${s.role}</div>
              </div>
            </div>
          </td>
          <td>${statusBadge('on-duty')}</td>
          <td style="font-weight:600">—</td>
          <td><span style="color:var(--dash-warning)"><i class="fas fa-star"></i> —</span></td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn-d btn-d-ghost btn-d-sm">View</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    })
    .catch(() => {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--dash-muted);padding:20px;">Could not load staff</td></tr>';
    });
}

// ===== INIT DASHBOARD =====
function initDashboard() {
  initSidebar();
  initDashTheme();

  // Render real data
  renderOrdersTable('recentOrdersTbody');
  renderReservationsTable('reservationsTbody');
  renderStaffTable('staffTbody');
}

// ===== EXPORTS =====
window.dashToast  = dashToast;
window.statusBadge = statusBadge;
window.initDashboard = initDashboard;
window.initSidebar = initSidebar;
window.initDashTheme = initDashTheme;
window.renderOrdersTable = renderOrdersTable;
window.renderStaffTable = renderStaffTable;
window.renderReservationsTable = renderReservationsTable;