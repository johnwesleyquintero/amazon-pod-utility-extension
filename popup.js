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
document.getElementById('startButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "startMonitoring" }, (response) => {
    if (response.status === "started") {
      document.getElementById('startButton').disabled = true;
      document.getElementById('stopButton').disabled = false;
    }
  });
});

document.getElementById('stopButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "stopMonitoring" }, (response) => {
    if (response.status === "stopped") {
      document.getElementById('startButton').disabled = false;
      document.getElementById('stopButton').disabled = true;
    }
  });
});

// Initialize button states
document.getElementById('stopButton').disabled = true;
  
  // Disable the monitoring functionality in the background
  chrome.runtime.sendMessage({ action: "stopMonitoring" });
  
  // Update status
  document.getElementById("status").textContent = "Monitoring is OFF";
  isMonitoring = false;
}
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const statusDiv = document.getElementById('status');

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