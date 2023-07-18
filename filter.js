const fs = require("fs");

const filePath = "./scraped-data.json";

// Load the scraped HTML data from the JSON file
const scrapedData = require(filePath);
const htmlContent = scrapedData.html;

// Define the regular expression pattern to match the desired data
const pattern = /(\d{2}:\d{2})\s(.+?)\s:\s(.+?)\svs\s(.+?)\b/g;

// Extract the matches based on the pattern from the HTML content
const extractedMatches = [];
let match;
while ((match = pattern.exec(htmlContent)) !== null) {
  const time = match[1];
  const event = match[2];
  const homeTeam = match[3];
  const awayTeam = match[4];

  extractedMatches.push({
    time,
    event,
    homeTeam,
    awayTeam,
  });
}

// Save the extracted matches to a JSON file
fs.writeFileSync(
  "./extracted-matches.json",
  JSON.stringify(extractedMatches, null, 2)
);

console.log("Data successfully extracted and saved to extracted-matches.json!");
