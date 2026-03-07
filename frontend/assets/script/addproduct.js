const BASE_URL = '';
let allProducts = [];
let activeSort  = '';
let activeCat   = '';
let minPrice    = null;
let maxPrice    = null;

const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n || 0);

// ----------- Toast -----------
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const icons = { success: 'bi-check-circle-fill', error: 'bi-exclamation-triangle-fill', warning: 'bi-exclamation-circle-fill' };
  const el = document.createElement('div');
  el.className = `toast-item ${type}`;
  el.innerHTML = `<i class="bi ${icons[type] || icons.success}"></i> ${message}`;
  container.appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity 0.3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
}

// ----------- Category toggle (form) -----------
document.getElementById('category').addEventListener('change', function () {
  const isPCBuild = this.value === 'PC Build';
  document.getElementById('fields-pcbuild').classList.toggle('active', isPCBuild);
  document.getElementById('fields-other').classList.toggle('active', !isPCBuild);
});

// ----------- Image preview -----------
document.getElementById('product-image').addEventListener('input', function () {
  const preview = document.getElementById('img-preview');
  const url = this.value.trim();
  if (url) {
    preview.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<div class=\\'img-preview-placeholder\\'><i class=\\'bi bi-exclamation-triangle\\'></i><span>Invalid URL</span></div>'">`;
    preview.classList.add('has-image');
  } else {
    preview.classList.remove('has-image');
    preview.innerHTML = `<div class="img-preview-placeholder"><i class="bi bi-card-image"></i><span>Preview will appear here</span></div>`;
  }
});

// ----------- Add Product -----------
document.getElementById('addProducts-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errEl = document.getElementById('form-error');
  errEl.classList.remove('show');

  const category = document.getElementById('category').value;
  const price    = Number(document.getElementById('product-price').value);
  const image    = document.getElementById('product-image').value.trim();
  let body = { category, price, image };

  if (category === 'PC Build') {
    body.CPU = document.getElementById('CPU').value.trim();
    body.GPU = document.getElementById('GPU').value.trim();
    body.RAM = document.getElementById('RAM').value.trim();
    body.STORAGE = document.getElementById('STORAGE').value.trim();
    body.CASE = document.getElementById('CASE').value.trim();
    if (!body.CPU) { document.getElementById('form-error-text').textContent = 'CPU is required for PC Build'; errEl.classList.add('show'); return; }
  } else {
    body.name = document.getElementById('name').value.trim();
    body.brand = document.getElementById('brand').value.trim();
    body.description = document.getElementById('description').value.trim();
    if (!body.name) { document.getElementById('form-error-text').textContent = 'Product name is required'; errEl.classList.add('show'); return; }
  }

  if (!price) { document.getElementById('form-error-text').textContent = 'Price is required'; errEl.classList.add('show'); return; }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<span style="width:13px;height:13px;border:2px solid rgba(0,0,0,.25);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;display:inline-block"></span> ADDING...`;

  try {
    const res = await fetch(`${BASE_URL}/api/products/create`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) { document.getElementById('form-error-text').textContent = data.message || 'Failed to add product'; errEl.classList.add('show'); return; }
    showToast('Product added successfully!', 'success');
    document.getElementById('addProducts-form').reset();
    document.getElementById('fields-pcbuild').classList.add('active');
    document.getElementById('fields-other').classList.remove('active');
    const preview = document.getElementById('img-preview');
    preview.classList.remove('has-image');
    preview.innerHTML = `<div class="img-preview-placeholder"><i class="bi bi-card-image"></i><span>Preview will appear here</span></div>`;
    loadProducts();
  } catch (err) {
    showToast('Network error. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-plus-lg"></i> ADD PRODUCT`;
  }
});

// ----------- Bottom sheet -----------
function openSheet(id) {
  document.getElementById('sheet-overlay').classList.add('show');
  document.getElementById(id).classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSheet() {
  document.getElementById('sheet-overlay').classList.remove('show');
  document.querySelectorAll('.bottom-sheet').forEach(s => s.classList.remove('show'));
  document.body.style.overflow = '';
}

// ----------- Sort (mobile) -----------
function selectSort(btn, value) {
  document.querySelectorAll('.sort-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeSort = value;
  const labels = { '': 'SORT', 'price-asc': 'LOW→HIGH', 'price-desc': 'HIGH→LOW', 'newest': 'NEWEST' };
  const sortBtn = document.getElementById('btn-sort');
  sortBtn.innerHTML = `<i class="bi bi-arrow-down-up"></i> ${labels[value]}`;
  sortBtn.classList.toggle('active', value !== '');
  closeSheet();
  applyFilters();
}

// ----------- Category (mobile filter sheet) -----------
function selectCat(btn, value) {
  document.querySelectorAll('.cat-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCat = value;
}

// ----------- Apply sheet filters -----------
function applySheetFilters() {
  minPrice = document.getElementById('min-price').value ? Number(document.getElementById('min-price').value) : null;
  maxPrice = document.getElementById('max-price').value ? Number(document.getElementById('max-price').value) : null;
  const count = (minPrice !== null || maxPrice !== null || activeCat !== '') ? 1 : 0;
  const badge = document.getElementById('filter-badge');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
  document.getElementById('btn-filter').classList.toggle('active', count > 0);
  closeSheet();
  applyFilters();
}

// ----------- Reset -----------
function resetFilters() {
  minPrice = null; maxPrice = null; activeCat = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  document.querySelectorAll('.cat-option').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-option[data-cat=""]').classList.add('active');
  document.getElementById('filter-badge').classList.remove('show');
  document.getElementById('btn-filter').classList.remove('active');
  closeSheet();
  applyFilters();
}

// ----------- Desktop listeners -----------
document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('filter-category').addEventListener('change', applyFilters);
document.getElementById('filter-sort').addEventListener('change', function () {
  activeSort = this.value; applyFilters();
});

// ----------- Apply all filters -----------
function applyFilters() {
  const search    = document.getElementById('search-input').value.toLowerCase().trim();
  const isMobile  = window.innerWidth <= 768;
  const catFilter = isMobile ? activeCat : document.getElementById('filter-category').value;
  const sortVal   = isMobile ? activeSort : document.getElementById('filter-sort').value;

  let filtered = [...allProducts];

  if (catFilter) filtered = filtered.filter(p => p.category === catFilter);

  if (search) {
    filtered = filtered.filter(p =>
      (p.CPU         || '').toLowerCase().includes(search) ||
      (p.GPU         || '').toLowerCase().includes(search) ||
      (p.RAM         || '').toLowerCase().includes(search) ||
      (p.name        || '').toLowerCase().includes(search) ||
      (p.brand       || '').toLowerCase().includes(search) ||
      (p.description || '').toLowerCase().includes(search) ||
      (p.category    || '').toLowerCase().includes(search)
    );
  }

  if (minPrice !== null) filtered = filtered.filter(p => p.price >= minPrice);
  if (maxPrice !== null) filtered = filtered.filter(p => p.price <= maxPrice);

  if (sortVal === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortVal === 'newest')     filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  renderProducts(filtered);
}

// ----------- Load Products -----------
async function loadProducts() {
  try {
    const res = await fetch(`${BASE_URL}/api/products/get`, { credentials: 'include' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    allProducts = data.allProducts || [];
    applyFilters();
  } catch (err) {
    document.getElementById('product-grid').innerHTML = `
      <div class="state-wrap">
        <i class="bi bi-exclamation-triangle state-icon" style="color:var(--danger)"></i>
        <div class="state-title" style="color:var(--danger)">FAILED TO LOAD</div>
      </div>`;
  }
}

// ----------- Render Products -----------
function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  document.getElementById('product-count').textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

  if (!products.length) {
    grid.innerHTML = `<div class="state-wrap"><i class="bi bi-inbox state-icon"></i><div class="state-title">NO PRODUCTS FOUND</div></div>`;
    return;
  }

  grid.innerHTML = '';

  products.forEach((product, index) => {
    const cat       = product.category || 'PC Build';
    const catClass  = cat.toLowerCase().replace(' ', '-');
    const isPCBuild = cat === 'PC Build';
    const title     = isPCBuild ? (product.CPU || 'CUSTOM BUILD') : (product.name || product.brand || 'PRODUCT');

    let specsHTML = '';
    if (isPCBuild) {
      specsHTML = `
        <li><span class="spec-key">CPU</span>    <span class="spec-val cpu-text">${product.CPU || '—'}</span></li>
        <li><span class="spec-key">GPU</span>    <span class="spec-val gpu-text">${product.GPU || '—'}</span></li>
        <li><span class="spec-key">RAM</span>    <span class="spec-val ram-text">${product.RAM || '—'}</span></li>
        <li><span class="spec-key">Storage</span><span class="spec-val storage-text">${product.STORAGE || '—'}</span></li>
        <li><span class="spec-key">Case</span>   <span class="spec-val case-text">${product.CASE || '—'}</span></li>`;
    } else {
      specsHTML = `
        <li><span class="spec-key">Name</span>  <span class="spec-val name-text">${product.name || '—'}</span></li>
        <li><span class="spec-key">Brand</span> <span class="spec-val brand-text">${product.brand || '—'}</span></li>
        <li><span class="spec-key">Info</span>  <span class="spec-val desc-text">${product.description || '—'}</span></li>`;
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product._id);
    card.style.animationDelay = `${index * 50}ms`;

    card.innerHTML = `
      <span class="category-tag ${catClass}">${cat.toUpperCase()}</span>
      ${product.image
        ? `<img class="card-img" src="${product.image}" alt="${title}">`
        : `<div class="card-img-placeholder"><i class="bi bi-pc-display"></i></div>`}
      <div class="card-body">
        <div class="card-title">${title}</div>
        <ul class="specs-list">${specsHTML}</ul>
        <div class="card-price price-text">${fmt(product.price)}</div>
        <div class="card-actions">
          <button class="btn-edit"><i class="bi bi-pencil"></i> EDIT</button>
          <button class="btn-save"><i class="bi bi-check-lg"></i> SAVE</button>
          <button class="btn-delete" data-id="${product._id}"><i class="bi bi-trash"></i></button>
        </div>
      </div>`;

    grid.appendChild(card);

    const editBtn   = card.querySelector('.btn-edit');
    const saveBtn   = card.querySelector('.btn-save');
    const deleteBtn = card.querySelector('.btn-delete');

    editBtn.addEventListener('click', () => {
      card.classList.add('editing');
      if (isPCBuild) {
        ['CPU','GPU','RAM','STORAGE','CASE'].forEach(f => {
          const el = card.querySelector(`.${f.toLowerCase()}-text`);
          el.innerHTML = `<input value="${product[f] || ''}">`;
        });
      } else {
        ['name','brand','desc'].forEach(f => {
          const el = card.querySelector(`.${f}-text`);
          const key = f === 'desc' ? 'description' : f;
          el.innerHTML = `<input value="${product[key] || ''}">`;
        });
      }
      card.querySelector('.price-text').innerHTML = `<input type="number" value="${product.price || 0}">`;
      editBtn.style.display = 'none';
      saveBtn.classList.add('visible');
      deleteBtn.style.display = 'none';
    });

    saveBtn.addEventListener('click', async () => {
      let updateData = { price: Number(card.querySelector('.price-text input').value) };
      if (isPCBuild) {
        updateData.CPU     = card.querySelector('.cpu-text input').value.trim();
        updateData.GPU     = card.querySelector('.gpu-text input').value.trim();
        updateData.RAM     = card.querySelector('.ram-text input').value.trim();
        updateData.STORAGE = card.querySelector('.storage-text input').value.trim();
        updateData.CASE    = card.querySelector('.case-text input').value.trim();
      } else {
        updateData.name        = card.querySelector('.name-text input').value.trim();
        updateData.brand       = card.querySelector('.brand-text input').value.trim();
        updateData.description = card.querySelector('.desc-text input').value.trim();
      }
      saveBtn.innerHTML = `<span style="width:11px;height:11px;border:2px solid rgba(0,0,0,.25);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;display:inline-block"></span>`;
      saveBtn.disabled = true;
      try {
        const res = await fetch(`${BASE_URL}/api/products/updateProduct/${product._id}`, {
          method: 'PATCH', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        const data = await res.json();
        if (!res.ok) { showToast(data.message || 'Update failed', 'error'); return; }
        showToast('Product updated!', 'success');
        loadProducts();
      } catch (err) {
        showToast('Network error.', 'error');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="bi bi-check-lg"></i> SAVE`;
      }
    });

    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Delete this product?')) return;
      deleteBtn.disabled = true;
      deleteBtn.innerHTML = `<span style="width:11px;height:11px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block"></span>`;
      try {
        const res = await fetch(`${BASE_URL}/api/products/deleteProduct/${product._id}`, {
          method: 'DELETE', credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) { showToast(data.message || 'Delete failed', 'error'); return; }
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = '0'; card.style.transform = 'scale(0.95)';
        setTimeout(() => { loadProducts(); showToast('Product deleted.', 'warning'); }, 300);
      } catch (err) {
        showToast('Network error.', 'error');
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;
      }
    });
  });
}

loadProducts();