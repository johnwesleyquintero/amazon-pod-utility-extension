let monitoringActive = false;
let currentIndex = 0;

const pages = [
  { name: "Performance Dashboard", url: "/performance/dashboard" },
  { name: "Fix Your Products", url: "/fixyourproducts" },
  { name: "Stranded Inventory", url: "/inventoryplanning/stranded-inventory" },
  { name: "Buyer Messages", url: "/messaging/inbox" },
  { name: "Warnings", url: "/gp/homepage.html#warnings" }
];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startMonitoring" && !monitoringActive) {
    monitoringActive = true;
    currentIndex = 0;
    startMonitoring();
    sendResponse({ status: "started" });
  } 
  else if (message.action === "stopMonitoring") {
    monitoringActive = false;
    sendResponse({ status: "stopped" });
  }
  else if (message.action === "getStatus") {
    sendResponse({ isMonitoring: monitoringActive });
  }
  return true;
});

function startMonitoring() {
  if (!monitoringActive) return;

  if (currentIndex < pages.length) {
    chrome.tabs.create({
      url: `https://sellercentral.amazon.com${pages[currentIndex].url}`,
      active: false
    }, (tab) => {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: extractPageData,
          args: [pages[currentIndex].name]
        }).then(() => {
          chrome.tabs.remove(tab.id);
          currentIndex++;
          setTimeout(startMonitoring, 3000);
        });
      }, 5000);
    });
  } else {
    currentIndex = 0;
    setTimeout(startMonitoring, 300000); // Wait 5 minutes before starting over
  }
}

function extractPageData(pageName) {
  const data = {
    timestamp: new Date().toISOString(),
    page: pageName,
    title: document.title,
    warnings: document.body.innerText.match(/(warning|error|deactivation|risk|negative|unshipped|low stock)/gi) || []
  };

  sendToGoogleSheets(data);
}

function sendToGoogleSheets(data) {
  fetch("https://script.google.com/macros/s/AKfycbxeo81Gxh-dhsM1k_dcGQ1wcnJIrMNotRFZwZl4Sm4fp_75HCSxCGrI8k3qNPfEbVC10A/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(result => console.log("Data sent:", result))
  .catch(error => console.error("Error:", error));
}
}

// Start automation function that will visit Amazon pages
function startAutomation() {
  console.log("Automation started...");
  
  // Start navigating to the pages
  navigateToNextPage();
}

let currentIndex = 0;
const pages = [
  { name: "Performance Dashboard", url: "/performance/dashboard" },
  { name: "Fix Your Products", url: "/fixyourproducts" },
  { name: "Stranded Inventory", url: "/inventoryplanning/stranded-inventory" },
  { name: "Ad Campaigns", url: "https://advertising.amazon.com/cm/campaigns" },
  { name: "Buyer Messages", url: "/messaging/inbox" },
  { name: "Warnings", url: "/gp/homepage.html#warnings" },
  { name: "Buy Box %", url: "/gp/homepage.html#buybox" },
  { name: "Unshipped Orders", url: "/orders-v3/mfn/unshipped" },
  { name: "Performance Notifications", url: "/performance/notifications" },
  { name: "Feedback Manager", url: "/feedback-manager/index.html" },
  { name: "Customer Engagement", url: "/customer-engagement/campaigns" },
  { name: "Unfulfillable Inventory", url: "/myinventory/unfulfillable/index.html" }
];

// Function to visit the next page and extract data
function navigateToNextPage() {
  if (currentIndex < pages.length) {
    console.log(`Navigating to: ${pages[currentIndex].name}`);
    window.location.href = `https://sellercentral.amazon.com${pages[currentIndex].url}`;
    currentIndex++;
    setTimeout(extractData, 5000); // Wait 5s before extracting data
  }
}

// Extract data from the page after navigation
function extractData() {
  let pageTitle = document.title;
  let detectedWarning = document.body.innerText.match(/(warning|error|deactivation|risk|negative|unshipped|low stock)/i);
  let issueFound = detectedWarning ? detectedWarning[0] : "No Issues Detected";

  let extractedData = {
    date: new Date().toISOString().split("T")[0], // Today's Date
    page: pageTitle,
    status: issueFound
  };

  console.log("✅ Extracted Data:", extractedData);

  // Send extracted data to Google Sheets
  sendToGoogleSheets(extractedData);

  // Move to next page
  setTimeout(navigateToNextPage, 3000);
}
function sendToGoogleSheets(data) {
  fetch("https://script.google.com/macros/s/AKfycbzqbC5ldrPxN-2-icC5c7UHTMBIHs8C9Nl-ZkuP7VSSYfbI9IV5ZX0QkMY7FK3-l8HpAg/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)  // Make sure the data is stringified
  })
  .then(response => response.text())
  .then(result => console.log("✅ Google Sheets Response:", result))
  .catch(error => console.error("❌ Error:", error));
}


