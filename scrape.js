const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeMatchDetails(page, url, retries = 3) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr.row');
      const rowData = Array.from(rows).map(row => {
        const columns = row.querySelectorAll('td');
        return {
          streamLink: columns[1]?.querySelector('a')?.href.trim(),
          language: columns[2]?.innerText.trim(),
          size: columns[3]?.innerText.trim(),
          ads: columns[4]?.innerText.trim(),
          quality: columns[5]?.innerText.trim()
        };
      });
      return rowData;
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

async function scrapeMatchLinks(page, url, retries = 3) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const matchLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a.mb-1.btn.btn-dark.col-12.text-start.text-primary'));
      return links.map(link => {
        const time = link.querySelector('span')?.innerText.trim();
        const teamsText = link.innerText.split('\n').slice(-1)[0].trim();
        const teams = teamsText.replace(time, '').trim().split(' - ');
        return {
          href: link.href,
          time: time,
          homeTeam: teams[0].trim(),
          awayTeam: teams[1].trim()
        };
      });
    });

    return matchLinks;
  } catch (error) {
    if (retries > 0) {
      console.error(`Error scraping ${url}. Retrying... (${retries} attempts left)`);
      return await scrapeMatchLinks(page, url, retries - 1);
    } else {
      console.error(`Failed to scrape ${url} after multiple attempts.`);
      return [];
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const initialUrl = 'https://buff-streams.net/schedule/soccer';

  // Scrape the match links from the initial schedule page
  const matchLinks = await scrapeMatchLinks(page, initialUrl);

  // Scrape data from each match link
  const results = [];
  for (const match of matchLinks) {
    const matchDetails = await scrapeMatchDetails(page, match.href);
    results.push({
      link: match.href,
      time: match.time,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      matchData: matchDetails
    });
  }

  // Save the scraped data to a JSON file
  fs.writeFileSync('match_data_with_details.json', JSON.stringify(results, null, 2));

  console.log('Data saved to match_data_with_details.json');

  await browser.close();
})();
