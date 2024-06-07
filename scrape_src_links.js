const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to scrape src links
async function scrapeSrcLinks(page, url, retries = 3) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const scriptSrc = Array.from(document.querySelectorAll('script[src]')).map(script => script.src);
      const videoSrc = Array.from(document.querySelectorAll('video[src]')).map(video => video.src);
      const iframeSrc = Array.from(document.querySelectorAll('iframe[src]')).map(iframe => iframe.src);

      return { scriptSrc, videoSrc, iframeSrc };
    });

    return data;
  } catch (error) {
    if (retries > 0) {
      console.error(`Error scraping ${url}. Retrying... (${retries} attempts left)`);
      return await scrapeSrcLinks(page, url, retries - 1);
    } else {
      console.error(`Failed to scrape ${url} after multiple attempts.`);
      return { scriptSrc: [], videoSrc: [], iframeSrc: [] };
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const matches = JSON.parse(fs.readFileSync('match_data.json', 'utf-8'));

  for (const match of matches) {
    const srcLinks = await scrapeSrcLinks(page, match.link);
    match.scriptSrc = srcLinks.scriptSrc;
    match.videoSrc = srcLinks.videoSrc;
    match.iframeSrc = srcLinks.iframeSrc;
  }

  fs.writeFileSync('match_data_with_details.json', JSON.stringify(matches, null, 2));

  console.log('Data saved to match_src_links.json');

  await browser.close();
})();
