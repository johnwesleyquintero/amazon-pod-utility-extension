const GOOGLE_SHEET_ID = "1xFxIjbXQnQ-kJtS2Sc030DYmTIDUkfuy0j9oBnNEjbY";
const SHEET_NAME = "AmazonMonitoring";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No POST data received or data is empty.");
    }

    const postContents = e.postData.contents;
    Logger.log("Received data: " + postContents);

    const data = JSON.parse(postContents);

    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([new Date(), data.page, data.status]);

    return ContentService.createTextOutput(JSON.stringify({ result: "Success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.stack);
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function checkForAlerts() {
  try {
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    const lastIssue = sheet.getRange(lastRow, 3).getValue();

    if (lastIssue.includes("risk") || lastIssue.includes("deactivation")) {
      MailApp.sendEmail({
        to: "john.quintero@myamazonguy.com",
        subject: "⚠️ URGENT: Amazon Account Issue Detected",
        body: `An issue was detected on Seller Central: ${lastIssue}. Please review immediately!`
      });
    }
  } catch (error) {
    Logger.log("Error in checkForAlerts: " + error.stack);
  }
}

function setupTriggers() {
  // Delete any pre-existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "checkForAlerts") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  ScriptApp.newTrigger("checkForAlerts")
    .timeBased()
    .everyHours(6)
    .create();
}

function logTestData() {
  const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(SHEET_NAME);
  const testData = {
    page: "Test Page",
    status: "No Issues Detected"
  };

  sheet.appendRow([new Date(), testData.page, testData.status]);
  Logger.log("Test data added: " + JSON.stringify(testData));
}
