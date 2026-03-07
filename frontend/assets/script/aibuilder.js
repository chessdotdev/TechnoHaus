const BASE_URL = '';

// ----- Override generateBuild to use styled output -----
async function generateBuild() {
  const budget = document.getElementById('budget').value;
  const description = document.getElementById('description').value;
  const output = document.getElementById('output');
  const btn = document.getElementById('generateBtn');

  if (!budget || !description.trim()) {
    output.innerHTML = `
      <div class="error-state">
        <i class="bi bi-exclamation-triangle-fill"></i>
        Please enter both a budget and a build description.
      </div>`;
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:0.5rem"><span style="width:16px;height:16px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block"></span> GENERATING...</span>`;

  output.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div class="loading-title">ANALYZING REQUIREMENTS</div>
      <div class="loading-sub">Crafting your optimal build...</div>
    </div>`;

  try {
    const response = await fetch(`${BASE_URL}/api/products/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ budget, description })
    });

    const data = await response.json();
    // console.log(data);

    if (!response.ok) {
      output.innerHTML = `
        <div class="error-state">
          <i class="bi bi-exclamation-triangle-fill"></i>
          ${data.message || 'Failed to generate build.'}
        </div>`;
      return;
    }

    const d = data.data;
    const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n || 0);

    output.innerHTML = `
      <div class="result-card">

        ${d.image
        ? `<img class="result-img" src="${d.image}" alt="PC Build">`
        : `<div class="result-img-fallback"><i class="bi bi-pc-display"></i></div>`
      }

        <div class="result-body">

          <div class="result-header">
            <div class="result-title"><i class="bi bi-cpu-fill" style="margin-right:0.5rem"></i>RECOMMENDED BUILD</div>
            <div class="result-badge"><i class="bi bi-check-circle-fill" style="margin-right:0.3rem"></i> AI GENERATED</div>
          </div>

          <div class="specs-grid">
            <div class="spec-item">
              <div class="spec-label">CPU</div>
              <div class="spec-value">${d.CPU || '—'}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">GPU</div>
              <div class="spec-value">${d.GPU || '—'}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">RAM</div>
              <div class="spec-value">${d.RAM || '—'}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Storage</div>
              <div class="spec-value">${d.STORAGE || '—'}</div>
            </div>
            <div class="spec-item" style="grid-column: span 2">
              <div class="spec-label">Case</div>
              <div class="spec-value">${d.CASE || '—'}</div>
            </div>
          </div>

          <div class="price-row">
            <span class="price-label">TOTAL PRICE</span>
            <span class="price-value">${fmt(d.price)}</span>
          </div>
          
          <div class="qty-row">
            <div class="qty-control">
              <button class="qty-btn" id="qtyDec">−</button>
              <span class="qty-value" id="qtyVal">1</span>
              <button class="qty-btn" id="qtyInc">+</button>
            </div>
            <button class="btn-add-to-cart" id="addToCartBtn">
              <i class="bi bi-cart-plus"></i> ADD TO CART
            </button>
          </div>

        </div>
      </div>`;
    // ── Qty controls ──
    document.getElementById('qtyDec').onclick = () => {
      const el = document.getElementById('qtyVal');
      const current = parseInt(el.textContent);
      if (current > 1) el.textContent = current - 1;
    };

    document.getElementById('qtyInc').onclick = () => {
      const el = document.getElementById('qtyVal');
      el.textContent = parseInt(el.textContent) + 1;
    };

    // ----- Add to Cart -----
    document.getElementById('addToCartBtn').onclick = async () => {
      const addBtn = document.getElementById('addToCartBtn');
      const qty = parseInt(document.getElementById('qtyVal').textContent);
      const productId = d._id;

      if (!productId) {
        alert('This build has no product ID. Save it first.');
        return;
      }

       // addBtn.disabled = true;
      addBtn.innerHTML = `<span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block"></span> ADDING...`;

      try {
        const res = await fetch(`${BASE_URL}/api/cart/add`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: qty })
        });

        const cartData = await res.json();

        if (!res.ok) {
          addBtn.disabled = false;
          addBtn.innerHTML = `<i class="bi bi-cart-plus"></i> ADD TO CART`;
          alert(cartData.message || 'Failed to add to cart');
          return;
        }

        addBtn.innerHTML = `<i class="bi bi-check-circle-fill"></i> ADDED ×${qty}`;
        addBtn.style.background = 'linear-gradient(135deg, #005fa3, #00d4ff)';

      } catch (err) {
        console.error(err);
        addBtn.disabled = false;
        addBtn.innerHTML = `<i class="bi bi-cart-plus"></i> ADD TO CART`;
        alert('Network error. Please try again.');
      }
    };
  } catch (err) {
    console.error(err);
    output.innerHTML = `
      <div class="error-state">
        <i class="bi bi-wifi-off"></i>
        Failed to connect. Make sure your backend is running.
      </div>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-lightning-fill" style="margin-right:0.5rem"></i> GENERATE MY BUILD`;
  }
}