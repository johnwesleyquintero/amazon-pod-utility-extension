let isMonitoring = false; // Track if monitoring is on or off

document.getElementById("toggleButton").addEventListener("click", function () {
  if (isMonitoring) {
    stopMonitoring();
  } else {
    startMonitoring();
  }
});

function startMonitoring() {
  // Change button to "Stop Monitoring"
  document.getElementById("toggleButton").textContent = "Stop Monitoring";
  document.getElementById("toggleButton").classList.remove("off");

  // Enable the monitoring functionality in the background
  chrome.runtime.sendMessage({ action: "startMonitoring" });
  
  // Update status
  document.getElementById("status").textContent = "Monitoring is ON";
  isMonitoring = true;
}

// Initialize button states
stopButton.disabled = true;

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  statusDiv.textContent = 'Monitoring Started...';
  statusDiv.style.backgroundColor = '#e8f5e9';
  
  chrome.runtime.sendMessage({ action: "startMonitoring" });
});

stopButton.addEventListener('click', async () => {
  startButton.disabled = false;
  stopButton.disabled = true;
  statusDiv.textContent = 'Monitoring Stopped';
  statusDiv.style.backgroundColor = '#ffebee';
  
  chrome.runtime.sendMessage({ action: "stopMonitoring" });
});

// Check current monitoring status when popup opens
chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
  if (response && response.isMonitoring) {
    startButton.disabled = true;
    stopButton.disabled = false;
    statusDiv.textContent = 'Monitoring Active';
    statusDiv.style.backgroundColor = '#e8f5e9';
  }
});
