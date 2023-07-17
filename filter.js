const fs = require("fs");

// Load the previously scraped HTML data from the JSON file
const scrapedData = require("./scraped-data.json");
const htmlContent = scrapedData.html;

// Define the local schedule date string
const localScheduleDate = "Monday 17th July 2023";

// Define the regular expression patterns to match the desired text
const datePattern = /<\/span>(\w+ \d{1,2}\w{2} \w+ \d{4})/;
const matchPattern =
  /<hr>(\d{2}:\d{2}) : Soccer : ([^<]+)<span[^>]+><a[^>]+href="\/([^"]+)"/g;

// Extract the schedule date
const scheduleMatch = datePattern.exec(htmlContent);
const scheduleDate = scheduleMatch ? scheduleMatch[1] : "";

// Compare the extracted schedule date with the local schedule date string
if (scheduleDate === localScheduleDate) {
  console.log("The extracted schedule date matches the local schedule date.");
} else {
  console.log(
    "The extracted schedule date does not match the local schedule date."
  );
}

// Filter the HTML content based on the regular expression pattern
const filteredMatches = [];
let match;
while ((match = matchPattern.exec(htmlContent)) !== null) {
  const time = match[1];
  const homeTeam = match[2].trim();
  const link = `https://d.daddylivehd.sx/stream/${match[3]}`;

  filteredMatches.push({
    time,
    homeTeam,
    link,
  });
}

// Remove duplicate matches based on home team combination
const uniqueMatches = [];
const uniqueHomeTeams = new Set();
for (const match of filteredMatches) {
  if (!uniqueHomeTeams.has(match.homeTeam)) {
    uniqueMatches.push(match);
    uniqueHomeTeams.add(match.homeTeam);
  }
}

// Save the filtered matches to a JSON file
fs.writeFileSync(
  "./filtered-matches.json",
  JSON.stringify(uniqueMatches, null, 2)
);

console.log("Data successfully filtered and saved to filtered-matches.json!");
