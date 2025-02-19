console.log("📌 Amazon Seller Central Auto-Monitoring Active!");

// List of critical pages to check
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

let currentIndex = 0;

function navigateToNextPage() {
  if (currentIndex < pages.length) {
    console.log(`Navigating to: ${pages[currentIndex].name}`);
    window.location.href = `https://sellercentral.amazon.com${pages[currentIndex].url}`;
    currentIndex++;
    setTimeout(extractData, 5000); // Wait 5s before extracting data
  }
}

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

  // Store data in localStorage temporarily
  chrome.storage.local.set({ latestCheck: extractedData });

  // Move to next page
  setTimeout(navigateToNextPage, 3000);
}

function startAutomation() {
  console.log("✅ User is logged in! Starting auto-checks...");
  setTimeout(navigateToNextPage, 2000);
}