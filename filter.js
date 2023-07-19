// Import required modules
const fs = require("fs");
const cheerio = require("cheerio");

const filePath = "./scraped-data.json";
const domainAddress = "https://d.daddylivehd.sx";

// Load the scraped HTML data from the JSON file
const scrapedData = require(filePath);
const htmlContent = scrapedData.html;

// Define the regular expression pattern to match the desired data for matches
const gamePattern =
  /<hr>(\d{2}:\d{2})\s([^:]+)\s:\s([^v]+)\svs\s([^<]+)(?:\s<[^>]+>.*?(?:<span[^>]+>.*?<a[^>]+style="color:\s#ff0000;"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a><\/span>(?:\s\|\s<span[^>]+>.*?<a[^>]+style="color:\s#ff0000;"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a><\/span>)*)).*?(<br>)?/g;

// Extract the matches based on the game pattern from the HTML content
const extractedMatches = [];
let gameMatch;
let matchIndex = 1; // Initialize match index variable
while ((gameMatch = gamePattern.exec(htmlContent)) !== null) {
  const time = gameMatch[1];
  const event = gameMatch[2].trim();
  const homeTeam = gameMatch[3].trim();
  const awayTeam = gameMatch[4].trim();
  const channels = [];

  // Extract the channel links and labels using Cheerio within the current <hr> block
  const $ = cheerio.load(gameMatch[0]);
  const channelElements = $("span > a[style='color: #ff0000;']");
  if (channelElements.length > 0) {
    channelElements.each((index, element) => {
      const link = domainAddress + $(element).attr("href");
      const id = index + 1;
      const label = `Stream ${id}`;
      channels.push({ id, link, label });
    });
  }

  extractedMatches.push({
    id: matchIndex, // Add the match id
    time,
    event,
    homeTeam,
    awayTeam,
    channels,
  });

  matchIndex++; // Increment match index for the next match
}

// Save the extracted matches to a JSON file
fs.writeFileSync(
  "./extracted-matches.json",
  JSON.stringify(extractedMatches, null, 2)
);

console.log("Data successfully extracted and saved to extracted-matches.json!");
