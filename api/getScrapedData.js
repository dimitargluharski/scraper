const fs = require('fs');

module.exports = async (req, res) => {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync('../extracted-matches.json');
    const scrapedData = JSON.parse(rawData);

    // Respond with the scraped data
    res.status(200).json(scrapedData);
  } catch (error) {
    console.error('Error reading scraped data:', error);
    res.status(500).send('Internal Server Error');
  }
};
