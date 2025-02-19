let isMonitoring = false; // Track if monitoring is on or off

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusDiv = document.getElementById("status");

function updateUI(monitoring) {
  isMonitoring = monitoring;
  startButton.disabled = monitoring;
  stopButton.disabled = !monitoring;
  if (monitoring) {
    statusDiv.textContent = 'Monitoring Active';
    statusDiv.style.backgroundColor = '#e8f5e9';
  } else {
    statusDiv.textContent = 'Monitoring Stopped';
    statusDiv.style.backgroundColor = '#ffebee';
  }
}

startButton.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ action: "startMonitoring" });
  updateUI(true);
});

stopButton.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ action: "stopMonitoring" });
  updateUI(false);
});

// Check current monitoring status when popup opens
chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
  if (response && response.isMonitoring) {
    updateUI(response.isMonitoring);
  } else {
    updateUI(false);
  }
});
