// Import required modules
const fs = require("fs");
const cheerio = require("cheerio");

const filePath = "./scraped-data.json";
const domainName = "https://d.daddylivehd.sx";

// Load the scraped HTML data from the JSON file
const scrapedData = require(filePath);
const htmlContent = scrapedData.html;

// Define the regular expression patterns
const gamePattern = /<hr>(\d{2}:\d{2})\s([^:]+)\s:\s([^v]+)\svs\s([^<]+)/g;
const linkPattern =
  /<span[^>]+>\s*([^<|]+)\s*<\/span>\s*<a[^>]+href="([^"]+)"[^>]*>/g;

// Extract the matches based on the game pattern from the HTML content
const extractedMatches = [];
let gameMatch;
while ((gameMatch = gamePattern.exec(htmlContent)) !== null) {
  const time = gameMatch[1];
  const event = gameMatch[2].trim();
  const homeTeam = gameMatch[3].trim();
  const awayTeam = gameMatch[4].trim();
  const channels = [];

  // Extract the channel links using the link pattern
  let linkMatch;
  let channelIndex = 1;
  while ((linkMatch = linkPattern.exec(gameMatch[0])) !== null) {
    const label = `Stream ${channelIndex}`;
    const link = domainName + linkMatch[2];
    channels.push({ id: channelIndex, link, label });
    channelIndex++;
  }

  extractedMatches.push({
    time,
    event,
    homeTeam,
    awayTeam,
    channels,
  });
}

// Save the extracted matches to a JSON file
fs.writeFileSync(
  "./extracted-matches.json",
  JSON.stringify(extractedMatches, null, 2)
);

console.log("Data successfully extracted and saved to extracted-matches.json!");
