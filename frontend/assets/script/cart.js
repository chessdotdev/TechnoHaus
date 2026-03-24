const BASE_URL = '';

// ---- Toast ----
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
  const el = document.createElement('div');
  el.className = `toast-item ${type}`;
  el.innerHTML = `<i class="bi ${icon}"></i> ${message}`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// ---- Format currency ----
const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n || 0);

// ---- Cart state ----
let cartData = { items: [] };

function updateCartCount() {
  document.getElementById('cart-count').textContent = cartData.items.length;
  document.getElementById('cart-count-mobile').textContent = cartData.items.length;
}

// ---- Get checked IDs ----
function getCheckedIds() {
  return [...document.querySelectorAll('.item-checkbox:checked')]
    .map(cb => cb.dataset.id);
}

// ---- Render summary (only checked items) ----
function renderSummary() {
  const lines   = document.getElementById('summary-lines');
  const totalEl = document.getElementById('summary-total');

  const checkedIds = getCheckedIds();

  const selectedItems = cartData.items.filter(item =>
    checkedIds.includes(String(item.product?._id || item.product))
  );

  // show only selected in summary lines
  lines.innerHTML = selectedItems.map(item => {
    const name  = item.product?.CPU || item.product?.name || 'Custom Build';
    const price = item.product?.price || 0;
    return `
      <div class="summary-row">
        <span>${name} ×${item.quantity}</span>
        <span>${fmt(price * item.quantity)}</span>
      </div>`;
  }).join('');

  // total only from selected
  const total = selectedItems.reduce((sum, item) =>
    sum + (item.product?.price || 0) * item.quantity, 0);

  totalEl.textContent = fmt(total);
}

// ---- Render cart ----
function renderCart() {
  const list      = document.getElementById('cart-items-list');
  const content   = document.getElementById('cart-content');
  const emptyEl   = document.getElementById('empty-state');
  const loadingEl = document.getElementById('loading-state');

  loadingEl.style.display = 'none';

  if (!cartData.items || cartData.items.length === 0) {
    content.style.display = 'none';
    emptyEl.style.display = 'block';
    updateCartCount();
    return;
  }

  content.style.display = 'block';
  emptyEl.style.display = 'none';
  list.innerHTML = '';

  // ── Select all bar ──
  const selectAllBar = document.createElement('div');
  selectAllBar.className = 'select-all-bar';
  selectAllBar.innerHTML = `
    <input type="checkbox" id="select-all" checked>
    <label for="select-all">SELECT ALL</label>
  `;
  list.appendChild(selectAllBar);

  // ── Cards ──
  cartData.items.forEach((item, index) => {
    const p      = item.product || {};
    const price  = p.price || 0;
    const itemId = String(p._id || item.product);

    const card = document.createElement('div');
    card.className = 'cart-card';
    card.setAttribute('data-card-id', itemId);
    card.style.animationDelay = `${index * 80}ms`;

    card.innerHTML = `
      <div class="cart-select">
        <input type="checkbox" class="item-checkbox" data-id="${itemId}" checked>
      </div>
      ${p.image
        ? `<img src="${p.image}" alt="${p.CPU || 'Build'}">`
        : `<div class="no-img-placeholder"><i class="bi bi-pc-display"></i></div>`
      }
      <div class="cart-item-body">
        <div class="item-title">${p.CPU || p.name || 'CUSTOM BUILD'}</div>
        <div class="specs-mini">
          ${p.GPU     ? `<span>GPU: ${p.GPU}</span>` : ''}
          ${p.RAM     ? `<span>RAM: ${p.RAM}</span>` : ''}
          ${p.STORAGE ? `<span>${p.STORAGE}</span>`  : ''}
          ${p.brand   ? `<span>${p.brand}</span>`    : ''}
        </div>
        <div class="cart-item-footer">
          <div class="qty-control">
            <button class="qty-btn" data-action="decrease" data-id="${itemId}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${itemId}">+</button>
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <span class="item-price">${fmt(price * item.quantity)}</span>
            <button class="btn-remove" data-id="${itemId}">
              <i class="bi bi-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  // ── Attach listeners AFTER all cards are in DOM ──

  // qty buttons
  list.querySelectorAll('.qty-btn').forEach(btn => {
    btn.onclick = () => handleQuantity(btn.dataset.id, btn.dataset.action, btn);
  });

  // remove buttons
  list.querySelectorAll('.btn-remove').forEach(btn => {
    btn.onclick = () => handleRemove(btn.dataset.id, btn);
  });

  // individual checkboxes
  list.querySelectorAll('.item-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const allChecked = [...document.querySelectorAll('.item-checkbox')].every(c => c.checked);
      document.getElementById('select-all').checked = allChecked;
      renderSummary();
    });
  });

  // select all
  document.getElementById('select-all').addEventListener('change', function () {
    document.querySelectorAll('.item-checkbox').forEach(cb => {
      cb.checked = this.checked;
    });
    renderSummary();
  });

  renderSummary();
  updateCartCount();
}

// ---- Handle quantity ----
async function handleQuantity(productId, action, btn) {
  const item = cartData.items.find(i => String(i.product?._id || i.product) === String(productId));
  if (!item) return;

  const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;

  if (newQty < 1) {
    handleRemove(productId, btn);
    return;
  }

  const card = document.querySelector(`[data-card-id="${productId}"]`);
  card.querySelectorAll('.qty-btn').forEach(b => b.disabled = true);

  try {
    const res = await fetch(`${BASE_URL}/api/cart/update`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: newQty })
    });

    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Failed to update quantity', 'error'); return; }

    cartData = data.cart;
    renderCart();
  } catch (err) {
    console.error(err);
    showToast('Network error. Please try again.', 'error');
  } finally {
    const freshCard = document.querySelector(`[data-card-id="${productId}"]`);
    if (freshCard) freshCard.querySelectorAll('.qty-btn').forEach(b => b.disabled = false);
  }
}

// ---- Handle remove ----
async function handleRemove(productId, btn) {
  const card = btn.closest('.cart-card');
  btn.disabled = true;
  btn.innerHTML = `<span style="width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block"></span>`;

  try {
    const res = await fetch(`${BASE_URL}/api/cart/remove`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || 'Failed to remove item', 'error');
      btn.disabled = false;
      btn.innerHTML = `<i class="bi bi-trash"></i> Remove`;
      return;
    }

    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(30px)';

    setTimeout(() => {
      cartData = data.cart;
      renderCart();
      showToast('Item removed from cart.', 'success');
    }, 300);

  } catch (err) {
    console.error(err);
    showToast('Network error. Please try again.', 'error');
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-trash"></i> Remove`;
  }
}

// ---- Load cart ----
async function loadCart() {
  try {
    const res = await fetch(`${BASE_URL}/api/cart/get`, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load cart');

    const data = await res.json();
    cartData = data.cart || { items: [] };
    renderCart();

  } catch (err) {
    console.error(err);
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('cart-items-list').innerHTML = `
      <div style="text-align:center;padding:4rem 1rem">
        <i class="bi bi-exclamation-triangle" style="font-size:3rem;color:var(--danger);display:block;margin-bottom:1rem"></i>
        <div style="font-family:'Orbitron',monospace;font-size:0.8rem;letter-spacing:2px;color:var(--danger);margin-bottom:0.5rem">FAILED TO LOAD</div>
        <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1.5rem">Please check your connection and try again.</p>
        <button onclick="loadCart()" style="background:transparent;border:1px solid var(--accent);color:var(--accent);padding:0.5rem 1.5rem;border-radius:8px;font-family:'Orbitron',monospace;font-size:0.7rem;letter-spacing:1.5px;cursor:pointer">RETRY</button>
      </div>`;
    document.getElementById('cart-content').style.display = 'block';
  }
}

// ---- Checkout ----
document.getElementById('checkoutBtn').onclick = () => {
  const checked = getCheckedIds();
  if (checked.length === 0) {
    showToast('Please select at least one item!', 'error');
    return;
  }

  const selectedItems = cartData.items.filter(item =>
    checked.includes(String(item.product?._id || item.product))
  );

  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: 'CONFIRMED',
    items: selectedItems.map(item => ({
      name: item.product?.CPU || item.product?.name || 'Custom Build',
      qty: item.quantity,
      price: item.product?.price || 0
    }))
  };

  const existing = JSON.parse(localStorage.getItem('th_orders') || '[]');
  existing.unshift(order);
  localStorage.setItem('th_orders', JSON.stringify(existing));

  const overlay = document.getElementById('checkout-overlay');
  const spinner = document.getElementById('checkout-spinner');
  const msg     = document.getElementById('checkout-msg');

  overlay.style.display = 'flex';

  setTimeout(() => {
    spinner.style.display = 'none';
    msg.style.display     = 'block';
    setTimeout(() => { window.location.href = '/orders'; }, 1500);
  }, 5000);
};

loadCart();