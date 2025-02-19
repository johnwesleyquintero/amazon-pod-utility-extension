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

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const htmlContent = await response.text();
    // Initially, log the entire HTML content for inspection
    console.log("Fetched HTML:", htmlContent);

    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Use more specific selectors to find warnings/errors
    let issueFound = "No Issues Detected";
    const warningElements = tempDiv.querySelectorAll('.warning, .error, .alert'); // Example selectors
    if (warningElements.length > 0) {
      // Extract text from warning elements
      issueFound = Array.from(warningElements).map(el => el.innerText).join('; ');
    }

    return {
      page: url, // Use URL as page identifier for now
      status: issueFound
    };

  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      page: url,
      status: `Error: ${error.message}`
    };
  }
}

async function processNextPage() {
    if (currentIndex < pages.length) {
        const fullUrl = `https://sellercentral.amazon.com${pages[currentIndex].url}`;
        console.log(`Fetching data from: ${pages[currentIndex].name}`);
        const data = await fetchData(fullUrl);
        currentIndex++;

        console.log("✅ Extracted Data:", data);

        // Store data in localStorage *only if* an issue is detected
        if (data.status !== "No Issues Detected") {
            chrome.storage.local.get({ issues: [] }, function(result) {
                const issues = result.issues;
                issues.push({date: new Date().toISOString().split("T")[0], ...data});
                chrome.storage.local.set({ issues: issues });
            });
        }

        processNextPage(); // Process next page immediately (no setTimeout)
    } else {
        // All pages processed, send message to background script
        chrome.runtime.sendMessage({ action: "monitoringComplete" });
    }
}

function startAutomation() {
  console.log("✅ User is logged in! Starting auto-checks...");
  currentIndex = 0; // Reset index
  processNextPage();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startMonitoring") {
    startAutomation();
  }
});
