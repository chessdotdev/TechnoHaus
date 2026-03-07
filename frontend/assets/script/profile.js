const BASE_URL = '';

function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
  const el = document.createElement('div');
  el.className = `toast-item ${type}`;
  el.innerHTML = `<i class="bi ${icon}"></i> ${msg}`;
  c.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

function val(v, fallback = 'Not provided') {
  return v || `<span class="info-empty">${fallback}</span>`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadProfile() {
  document.getElementById('loading-state').style.display = 'block';
  document.getElementById('profile-content').style.display = 'none';
  document.getElementById('error-state').style.display = 'none';

  try {
    // Cart count
    const cartRes = await fetch('/api/cart/get', { credentials: 'include' });
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      const count = (cartData.cart?.items || []).length;
      document.getElementById('cart-count').textContent = count;
      document.getElementById('cart-count-mobile').textContent = count;
    }

    // Profile
    const res = await fetch('/api/profile/get', { credentials: 'include' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const u = data.user || data;

    // Avatar initial
    const name = u.fullName || u.username || '?';
    document.getElementById('avatar-initials').textContent = name.charAt(0).toUpperCase();

    // Fill fields
    document.getElementById('profile-fullname').textContent  = u.fullName || u.username || '—';
    document.getElementById('profile-username').textContent  = '@' + (u.username || '—');
    document.getElementById('profile-role').textContent      = (u.role || 'customer').toUpperCase();
    document.getElementById('profile-email').innerHTML       = val(u.email);
    document.getElementById('profile-phone').innerHTML       = val(u.phone);
    document.getElementById('profile-street').innerHTML      = val(u.address?.street);
    document.getElementById('profile-city').innerHTML        = val(u.address?.city);
    document.getElementById('profile-province').innerHTML    = val(u.address?.province);
    document.getElementById('profile-zipcode').innerHTML     = val(u.address?.zipCode);
    document.getElementById('profile-country').textContent   = u.address?.country || 'Philippines';
    document.getElementById('profile-joined').textContent    = fmtDate(u.createdAt);
    document.getElementById('profile-updated').textContent   = fmtDate(u.updatedAt);

    document.getElementById('loading-state').style.display  = 'none';
    document.getElementById('profile-content').style.display = 'block';

  } catch (e) {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display   = 'block';
  }
}

async function logout() {
  await fetch('/api/user/logout', { method: 'POST', credentials: 'include' });
  location.href = '/';
}

document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('logoutBtnTop').addEventListener('click', logout);

loadProfile();