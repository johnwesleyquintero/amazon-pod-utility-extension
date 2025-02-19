let monitoringActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startMonitoring" && !monitoringActive) {
    monitoringActive = true;
    // Instead of injecting the script, send a message to the existing content script
    chrome.tabs.query({ active: true, currentWindow: true, url: "https://sellercentral.amazon.com/*" }, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startMonitoring" });
      }
    });
    sendResponse({ status: "started" });
  } else if (message.action === "stopMonitoring") {
    monitoringActive = false;
    sendResponse({ status: "stopped" });
  } else if (message.action === "getStatus") {
    sendResponse({ isMonitoring: monitoringActive });
  } else if (message.action === "monitoringComplete") {
      // Handle completion (e.g., update UI, show notification)
      console.log("Monitoring complete!");
      monitoringActive = false; // Reset monitoringActive
  }
  return true;
});

// Inject content script on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ url: "https://sellercentral.amazon.com/*" }, (tabs) => {
    tabs.forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ["content.js"]
      }).catch(err => console.error('Failed to inject content script', err));
    });
  });
});
