# Nebula Suite Chrome Extension

Amazon POD Utility is a powerful Chrome Extension designed to automate monitoring and reporting for Amazon Seller Central accounts. Whether you’re an Amazon seller or managing multiple accounts, this tool will help you track key metrics like Buy Box percentage, late shipments, account health, and more—directly from your browser.

## 📜 Features

*   **Automated Monitoring:** Automatically checks critical Amazon Seller Central pages for key performance metrics.
*   **Real-Time Alerts:** Receive email alerts for urgent issues like account deactivation, policy violations, or performance risks.
*   **Data Storage:** Logs all critical issues and key metrics in Google Sheets for easy tracking and reporting.
*   **Customizable:** Fully customizable with a list of URLs to monitor based on your specific Amazon account needs.

## 🚀 Installation

### Manual Installation via Chrome

1.  **Download the Extension Files**

    Clone or download the ZIP of this repository.
2.  **Enable Developer Mode in Chrome**

    Open Chrome and go to `chrome://extensions/`.
    Toggle the **Developer Mode** switch on (top-right).
3.  **Load the Extension**

    Click on the "Load unpacked" button.
    Select the folder where you’ve saved the extension files.
4.  **Start Using It**

    You should see the extension icon appear in the Chrome toolbar.
    Click the icon to start tracking your Amazon Seller Central account!

## 🛠️ How It Works

The Amazon POD Utility extension automatically visits the following critical Seller Central pages:

*   Performance Dashboard
*   Account Health
*   Suppressed Listings
*   Stranded Inventory
*   Ad Campaigns
*   Buyer Messages
*   Homepage Warnings
*   Buy Box Percentage
*   Late Shipments
*   Performance Notifications
*   Feedback Removal
*   Unfulfillable Inventory

Once the extension detects potential issues (such as a low Buy Box %, or account warnings), it:

1.  Extracts the relevant data.
2.  Logs it into Google Sheets for easy tracking.
3.  Sends email alerts if any critical issues (e.g., account deactivation, policy violation) are detected.

## 📊 Google Sheets Integration

All the data extracted from the Amazon Seller Central pages is logged in Google Sheets for detailed tracking. You’ll have a historical log of all metrics, including Buy Box percentage, account health status, feedback removal requests, and more.

### Google Sheets Format

| Date       | Page                      | Status                  |
| :--------- | :------------------------ | :---------------------- |
| 2025-02-18 | Account Health            | ✅ No Issues Detected   |
| 2025-02-18 | Suppressed Listings       | ❌ 2 Suppressed Listings Found |
| 2025-02-18 | Buy Box %                 | ⚠️ Buy Box Dropped to 85% |
| 2025-02-18 | Performance Notifications | ❌ Immediate Action Required |

## 🔔 Email Alerts

The extension monitors critical issues like:

*   Account Health risks (e.g., deactivation warnings)
*   Negative Feedback
*   Buy Box Percentage drops
*   Late Shipments
*   Unresolved Performance Notifications

When one of these critical issues is found, you’ll receive an instant email alert to notify you that action is required.

## ⚙️ Customizing the Extension

You can modify the extension’s behavior by adjusting the list of monitored URLs and adding custom Google Sheet configurations. All configurations are stored in the `Config.gs` file for easy customization.

## 📝 How to Contribute

We welcome contributions! Here’s how you can help improve the extension:

1.  Fork the repository and create your own branch.
2.  Make changes and commit them.
3.  Open a pull request with a detailed explanation of what you’ve changed.

## 📬 Contact & Support

If you have any issues or feature requests, feel free to open an issue in the GitHub repository or email us at: `support@example.com`.

## 🚧 Roadmap

### Upcoming Features:

*   PPC Campaign Performance Monitoring – Track your PPC campaigns alongside organic sales.
*   Multi-Account Support – Ability to manage multiple Amazon Seller accounts in one extension.

### Planned Integrations:

*   Google Data Studio for live dashboards.
*   Slack/WhatsApp Alerts for real-time updates.

## 🔒 Privacy & Security

*   **No login credentials required:** The extension does not require access to your Amazon credentials.
*   **Data storage:** All monitoring data is stored locally in Google Sheets. We never store your sensitive information.
*   **Permissions:** The extension only requests permissions to read data from Seller Central pages and store it in Google Sheets.

## 🎉 Credits

*   Chrome Extension: Built with love by [Your Name/Company].
*   Google Apps Script: All server-side functionality powered by Google Apps Script.

## 📢 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

Ready to start tracking your Amazon account like a pro? 🚀
Download and Install the extension now, and let’s make Amazon Seller Central monitoring super easy!