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
  { name: "Unfulfillable Inventory", url: "/myinventory/unfulfillable/index.html" },
  { name: "Business Reports", url: "/business/reports" } // Placeholder URL
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

    if (url.includes('/performance/dashboard')) {
      const dashboardContent = tempDiv.querySelector('#dashboard-content');
      if (dashboardContent) {
        const warningElements = dashboardContent.querySelectorAll('.a-alert-content');
        if (warningElements.length > 0) {
          issueFound = Array.from(warningElements).map(el => el.innerText).join('; ');
        }
      }
    } else if (url.includes('/fixyourproducts')) {
      const pageContent = tempDiv.querySelector('#a-page');
      if (pageContent) {
        const issueCards = pageContent.querySelectorAll('.issue-card');
        if (issueCards.length > 0) {
          issueFound = Array.from(issueCards).map(card => {
            const title = card.querySelector('h4.issue-title')?.innerText || '';
            const description = card.querySelector('p.issue-description')?.innerText || '';
            return `${title}: ${description}`;
          }).join('; ');
        }
      }
    } else if (url.includes('/inventoryplanning/stranded-inventory')) {
      const pageContent = tempDiv.querySelector('#ihp-body-center');
      if (pageContent) {
        const tableContainer = pageContent.querySelector('.mt-table-container');
        if (tableContainer) {
          const issueElements = tableContainer.querySelectorAll('.mt-table tr');
          if (issueElements.length > 0) {
            issueFound = Array.from(issueElements).map(el => {
              const reason = el.querySelector('.mt-header-count')?.innerText || '';
              return `Stranded Reason: ${reason}`;
            }).join('; ');
          }
        }
      }
    } else if (url.includes('/business/reports')) {
      // Extract data from the Business Reports page
      const table = tempDiv.querySelector('#report-table'); // Placeholder selector
      if (table) {
        const rows = table.querySelectorAll('tbody tr'); // Placeholder selector
        const reportData = [];
        rows.forEach(row => {
          const asin = row.querySelector('.asin-column')?.innerText || ''; // Placeholder selector
          const title = row.querySelector('.title-column')?.innerText || ''; // Placeholder selector
          const sku = row.querySelector('.sku-column')?.innerText || ''; // Placeholder selector
          const sessions = row.querySelector('.sessions-column')?.innerText || ''; // Placeholder selector
          reportData.push({ asin, title, sku, sessions });
        });
        issueFound = JSON.stringify(reportData);
      } else {
        issueFound = "No report table found";
      }
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
          // Send data to Google Apps Script
          fetch("https://script.google.com/macros/s/AKfycbxeo81Gxh-dhsM1k_dcGQ1wcnJIrMNotRFZwZl4Sm4fp_75HCSxCGrI8k3qNPfEbVC10A/exec", {
            method: "POST",
            mode: 'cors',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ postData: { contents: JSON.stringify(data) } })
          })
          .then(response => {
            console.log("Data sent to Google Apps Script:", response);
            return response.text();
          })
          .then(result => {
            console.log("Google Apps Script response:", result);
          })
          .catch(error => {
            console.error("Error sending data to Google Apps Script:", error);
          });

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
