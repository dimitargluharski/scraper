const fs = require("fs");
const cheerio = require("cheerio");

const filePath = "./scraped-data.json";
const domainAddress = "https://d.daddylivehd.sx";

// Function to convert UK GMT+1 time to local time in 24-hour format
function convertToLocaleTime(ukTime) {
  const ukOffsetMinutes = 60; // UK is GMT+1, which is 60 minutes ahead of GMT
  const localOffsetMinutes = new Date().getTimezoneOffset(); // Get local timezone offset in minutes (positive for GMT- and negative for GMT+)

  // Convert the time string to Date object
  const [hours, minutes] = ukTime.split(":");
  const ukDate = new Date();
  ukDate.setHours(parseInt(hours));
  ukDate.setMinutes(parseInt(minutes));

  // Convert to local time
  ukDate.setMinutes(ukDate.getMinutes() - ukOffsetMinutes + localOffsetMinutes);

  return ukDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Load the scraped HTML data from the JSON file
const scrapedData = require(filePath);
const htmlContent = scrapedData.html;

// Define the regular expression pattern to match the desired data for matches
const gamePattern =
  /<hr>(\d{2}:\d{2})\s([^:]+)\s:\s([^v]+)\svs\s([^<]+)((?:(?:\s<(?:strong|b)>.*?(?:<a[^>]+style="color:\s#ff0000;"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a><\/(?:strong|b)>)<\/span>)|(?:\s<[^>]+>.*?(?:<a[^>]+style="color:\s#ff0000;"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a><\/span>)))+).*?(<br>)?/g;

// Extract the matches based on the game pattern from the HTML content
const extractedMatches = [];
let matchIndex = 1; // Initialize match index variable
let gameMatch;

while ((gameMatch = gamePattern.exec(htmlContent)) !== null) {
  const time = convertToLocaleTime(gameMatch[1].trim());
  const event = gameMatch[2].trim();
  const homeTeam = gameMatch[3].trim();
  const awayTeam = gameMatch[4].trim();
  const channels = [];

  // Extract the channel links and labels using Cheerio within the current <hr> block
  const links = gameMatch[0].match(
    /<a[^>]+style="color:\s#ff0000;"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/g
  );

  if (links && links.length > 0) {
    links.forEach((link, index) => {
      const channelMatch = /href="([^"]+)".*?>(.*?)<\/a>/.exec(link);
      if (channelMatch) {
        const link = domainAddress + channelMatch[1];
        const label = `Stream ${index + 1}`;
        channels.push({ link, label });
      }
    });
  }

  extractedMatches.push({
    id: matchIndex,
    time,
    event,
    homeTeam,
    awayTeam,
    channels,
  });

  matchIndex++;
}

// Save the extracted matches to a JSON file
fs.writeFileSync(
  "./extracted-matches.json",
  JSON.stringify(extractedMatches, null, 2)
);

console.log("Data successfully extracted and saved to extracted-matches.json!");
