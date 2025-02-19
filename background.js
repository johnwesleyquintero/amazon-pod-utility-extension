let monitoringActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startMonitoring" && !monitoringActive) {
    monitoringActive = true;
    startMonitoring();
    sendResponse({ status: "started" });
  } else if (message.action === "stopMonitoring") {
    monitoringActive = false;
    sendResponse({ status: "stopped" });
  } else if (message.action === "getStatus") {
    sendResponse({ isMonitoring: monitoringActive });
  }
  return true;
});

function startMonitoring() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }).then(() => {
      console.log("Content script injected.");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          startAutomation();
        }
      });
    }).catch(error => console.error("Error injecting content script:", error));
  });
}
