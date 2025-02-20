let isMonitoring = false; // Track if monitoring is on or off

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusDiv = document.getElementById("status");
const dataDisplay = document.getElementById("data-display");
const mainContent = document.getElementById("main-content");
const toolList = document.querySelector(".sidebar ul");

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

// Function to display stored data
function displayData() {
  if (dataDisplay) {
    chrome.storage.local.get({ issues: [] }, function (result) {
      const issues = result.issues;
      dataDisplay.innerHTML = ''; // Clear previous content
      if (issues.length > 0) {
        const dataList = document.createElement('ul');
        issues.forEach(issue => {
          const listItem = document.createElement('li');
          listItem.textContent = `Date: ${issue.date}, Page: ${issue.page}, Status: ${issue.status}`;
          dataList.appendChild(listItem);
        });
        dataDisplay.appendChild(dataList);
      } else {
        dataDisplay.textContent = "No issues detected.";
      }
    });
  }
}

function loadReportFetcher() {
  mainContent.innerHTML = `
    <h2>Report Fetcher</h2>
    <div id="status"></div>
    <div id="data-display"></div>
  `;
  statusDiv = document.getElementById("status");
  dataDisplay = document.getElementById("data-display");
  displayData();
}

// Add event listeners to tool list items
toolList.addEventListener("click", function (event) {
  const tool = event.target.dataset.tool;
  // Remove active class from all list items
  document.querySelectorAll('.sidebar li').forEach(item => item.classList.remove('active'));
  // Add active class to the clicked list item
  event.target.classList.add('active');

  if (tool === "report-fetcher") {
    loadReportFetcher();
  }
});

// Initially load the Report Fetcher
loadReportFetcher();

// Add active class to Report Fetcher on load
document.querySelector('[data-tool="report-fetcher"]').classList.add('active');
