const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const htmlToText = require("html-to-text");

const url = "https://d.daddylivehd.sx/";

// Fetch the HTML content of the website
axios
  .get(url)
  .then((response) => {
    const htmlContent = response.data;

    // Load the HTML content into cheerio
    const $ = cheerio.load(htmlContent);

    // Extract the relevant text using cheerio
    const relevantText = $("body").text();

    // Filter the relevant text based on soccer-related keywords
    const soccerKeywords = ["Soccer"];
    const filteredText = relevantText
      .toLowerCase()
      .split(" ")
      .filter((word) => soccerKeywords.includes(word))
      .join(" ");

    // Save the filtered text to a JSON file
    fs.writeFileSync(
      "./filtered-data.json",
      JSON.stringify({ text: filteredText }, null, 2)
    );

    console.log("Website successfully scraped and filtered!");
  })
  .catch((error) => {
    console.log("An error occurred while fetching the website:", error);
  });
