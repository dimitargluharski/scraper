const fs = require("fs");
const cheerio = require("cheerio");

// Load the previously scraped HTML data from the JSON file
const scrapedData = require("./scraped-data.json");
const htmlContent = scrapedData.html;

// Define the regular expression pattern to match the desired text
const pattern = /\d{2}:\d{2} : (?:Soccer : )?[^<]+/g;

// Load the HTML content into cheerio
const $ = cheerio.load(htmlContent);

// Extract the desired text using the regular expression pattern
const matches = $("body").html().match(pattern);

// Remove duplicates from the extracted text
const uniqueMatches = [...new Set(matches)];

// Join the matches into a single string, removing "Soccer"
const extractedText = uniqueMatches
  ? uniqueMatches.map((match) => match.replace("Soccer : ", "")).join("\n")
  : "";

// Save the extracted text to a file
fs.writeFileSync("./extracted-text.txt", extractedText);

console.log("Text successfully extracted!");
