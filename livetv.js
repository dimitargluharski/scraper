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
  });
};

// Initial scrape and write
scrapeAndWriteData().then(() => {
  runFilterScript();
});

// Schedule scraping and writing every hour
setInterval(() => {
  scrapeAndWriteData().then(() => {
    runFilterScript();
  });
}, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds
