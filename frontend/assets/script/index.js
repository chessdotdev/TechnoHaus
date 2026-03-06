const BASE_URL = '';

// ---- Tab switching ----
function switchTab(tab) {
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

// ---- Show error ----
function showError(formType, message) {
  const el = document.getElementById(`${formType}-error`);
  document.getElementById(`${formType}-error-text`).textContent = message;
  el.classList.add('show');
}

function hideError(formType) {
  document.getElementById(`${formType}-error`).classList.remove('show');
}

// ---- Login ----
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('login');

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const btn = document.getElementById('login-btn');

  btn.disabled = true;
  btn.innerHTML = `<span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.25);border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block"></span> LOGGING IN...`;


  try {
    
    if(!username || !password){
        return showError('login', "All field are required")
     }
   
    const res = await fetch(`${BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json();

    if (!res.ok) {
      showError('login', result.message ? 'Invalid username or password' : null);
      return;
    }

    const role = result.user.role;
    if (role === 'admin') location.assign('/addproduct');
    else if (role === 'customer') location.assign('/product');

  } catch (err) {
    showError('login', 'Network error. Please try again.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-box-arrow-in-right"></i> LOGIN`;
  }
});

// ---- Register ----
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('register');
  document.getElementById('register-success').classList.remove('show');

  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  const fullName = document.getElementById('register-fullname').value.trim();
  const email    = document.getElementById('register-email').value.trim();
  const phone    = document.getElementById('register-phone').value.trim();
  const street   = document.getElementById('register-street').value.trim();
  const city     = document.getElementById('register-city').value.trim();
  const province = document.getElementById('register-province').value.trim();
  const zipCode  = document.getElementById('register-zipcode').value.trim();

  if (!username || !password || !phone) {
    showError('register', 'Username, password and phone are required.');
    return;
  }

  const btn = document.getElementById('register-btn');
  btn.disabled = true;
  btn.innerHTML = `<span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.25);border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block"></span> CREATING...`;

  try {
    const res = await fetch(`${BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username, password, fullName,
        email: email || undefined,
        phone,
        address: { street, city, province, zipCode }
      })
    });

    const result = await res.json();

    if (!res.ok) {
      showError('register', result.message || 'Registration failed');
      return;
    }

    document.getElementById('register-form').reset();
    document.getElementById('register-success').classList.add('show');

    // Auto switch to login after 1.5s
    setTimeout(() => switchTab('login'), 1500);

  } catch (err) {
    showError('register', 'Network error. Please try again.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-person-check"></i> CREATE ACCOUNT`;
  }
});