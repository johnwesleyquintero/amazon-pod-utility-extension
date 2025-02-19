// Send extracted data from Chrome Extension to GAS
function sendToGoogleSheets(data) {
    fetch("https://script.google.com/macros/s/AKfycbxQIj7IZFg4TW5VuCjjtSxEJtmf7b-TjIIRgbZEpEGMnPclX6XXw2TBLxtsPlS1ZDb7FA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => console.log("✅ Google Sheets Response:", result))
    .catch(error => console.error("❌ Error:", error));
  }
  