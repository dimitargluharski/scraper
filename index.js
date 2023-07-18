const axios = require("axios");
const fs = require("fs");

const url = "https://d.daddylivehd.sx/";
const filePath = "./scraped-data.json";

// Function to fetch the HTML content and update the file
const scrapeAndWriteData = () => {
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
    })
    .catch((error) => {
      console.log("An error occurred while scraping the web address:", error);
    });
};

// Initial scrape and write
scrapeAndWriteData();

// Schedule scraping and writing every hour
setInterval(scrapeAndWriteData, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds
