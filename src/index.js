const axios = require('axios');
const fs = require('fs');

async function fetchHTML() {
  try {
    const response = await axios.get('https://www.pirlotv.fr/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
      }
    });
    const html = response.data;
    fs.writeFileSync('website.html', html, 'utf8');
    console.log('HTML fetched and saved.');
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

fetchHTML();
