import { Network } from '@capacitor/network';

// Function to check network status
async function checkNetworkStatus() {
  const status = await Network.getStatus();

  if (!status.connected) {
    // Offline, redirect to offline page
    window.location.href = '/offline.html';
  }

  // Listen for changes in network status
  Network.addListener('networkStatusChange', (status) => {
    if (!status.connected) {
      // Offline, show offline page
      window.location.href = '/offline.html';
    } else {
      // Optional: Handle when the network is back online (reload page or something else)
      window.location.reload();
    }
  });
}

// Call the function when the app starts
checkNetworkStatus();