const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to scrape match details from a given URL
async function scrapeMatchDetails(page, url, retries = 3) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract data from the page
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return Array.from(rows).map(row => {
        const columns = row.querySelectorAll('td');
        return {
          streamLink: columns[0]?.querySelector('a')?.href.trim(),
          channel: columns[0]?.innerText.trim(),
          language: columns[2]?.innerText.trim(),
          size: columns[3]?.innerText.trim(),
          ads: columns[4]?.innerText.trim(),
          quality: columns[5]?.innerText.trim()
        };
      });
    });

    return data;
  } catch (error) {
    if (retries > 0) {
      console.error(`Error scraping ${url}. Retrying... (${retries} attempts left)`);
      return await scrapeMatchDetails(page, url, retries - 1);
    } else {
      console.error(`Failed to scrape ${url} after multiple attempts.`);
      return [];
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Read the match data from JSON file
  const matches = JSON.parse(fs.readFileSync('match_data.json', 'utf-8'));

  // Loop through each match and scrape details
  for (const match of matches) {
    console.log(`Scraping details for match: ${match.link}`);
    const matchDetails = await scrapeMatchDetails(page, match.link);
    match.matchData = matchDetails;
  }

  // Save the updated match data with details to a new JSON file
  fs.writeFileSync('match_data_with_details.json', JSON.stringify(matches, null, 2));

  console.log('Data saved to match_data_with_details.json');

  await browser.close();
})();
