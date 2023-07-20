const { spawn } = require("child_process");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const url = "https://d.daddylivehd.sx/";
const filePath = "./scraped-data.json";

// Function to fetch the HTML content and update the file
const scrapeAndWriteData = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        const htmlContent = response.data;

        // Write the HTML content to the JSON file
        fs.writeFileSync(
          filePath,
          JSON.stringify({ html: htmlContent }, null, 2)
        );

        console.log("Web address scraped and data updated successfully!");
        resolve();
      })
      .catch((error) => {
        console.log("An error occurred while scraping the web address:", error);
        reject(error);
      });
  });
};

// Function to run the filter.js script
const runFilterScript = () => {
  const filterScript = spawn("node", [path.join(__dirname, "filter.js")]);

  filterScript.stdout.on("data", (data) => {
    console.log(`filter.js stdout: ${data}`);
  });

  filterScript.stderr.on("data", (data) => {
    console.error(`filter.js stderr: ${data}`);
  });

  filterScript.on("close", (code) => {
    console.log(`filter.js process exited with code ${code}`);
    // Send a Telegram message only when the filter.js script completes
    sendTelegramMessage(`filter.js process exited with code ${code}`);
  });
};

// Function to send a notification message to Telegram
function sendTelegramMessage(message) {
  const telegramScript = spawn("node", [
    path.join(__dirname, "telegram.js"),
    message,
  ]);

  telegramScript.stdout.on("data", (data) => {
    console.log(`telegram.js stdout: ${data}`);
  });

  telegramScript.stderr.on("data", (data) => {
    console.error(`telegram.js stderr: ${data}`);
  });

  telegramScript.on("close", (code) => {
    console.log(`telegram.js process exited with code ${code}`);
    // You can choose not to log anything here since it's just a notification script
  });
}

// Initial scrape and write
scrapeAndWriteData()
  .then(() => {
    runFilterScript();
    sendTelegramMessage("Scrape.js script started.");
  })
  .finally(() => {
    sendTelegramMessage("Scrape.js script completed.");
  });
