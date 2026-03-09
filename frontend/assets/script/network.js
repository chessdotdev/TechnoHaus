// ---------- Network status monitor --------------------
async function checkNetwork() {
    // for browser/webview without Capacitor
    if (!window.Capacitor) {
      window.addEventListener('online',  () => hideOfflineBanner());
      window.addEventListener('offline', () => showOfflineBanner());
      if (!navigator.onLine) showOfflineBanner();
      return;
    }
  
    // for Capacitor native
    const { Network } = Capacitor.Plugins;
  
    const status = await Network.getStatus();
    if (!status.connected) showOfflineBanner();
  
    Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        showOfflineBanner();
      } else {
        hideOfflineBanner();
        window.location.reload();
      }
    });
  }
  
  function showOfflineBanner() {
    if (document.getElementById('offline-banner')) return;
  
    const banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; right: 0;
        background: #ff4444;
        color: #fff;
        font-family: 'Orbitron', monospace;
        font-size: 0.62rem; letter-spacing: 1.5px;
        padding: 0.75rem 1rem;
        text-align: center;
        z-index: 9999;
        display: flex; align-items: center;
        justify-content: center; gap: 0.5rem;
      ">
        <i class="bi bi-wifi-off"></i> NO INTERNET CONNECTION
      </div>
    `;
    document.body.prepend(banner);
  }
  
  function hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.remove();
  }
  
  checkNetwork();