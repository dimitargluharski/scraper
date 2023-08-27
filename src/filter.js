const fs = require('fs');
const cheerio = require('cheerio');

// Function to add 2 hours to a given time string
function addTwoHours(timeString) {
  const [hour, minute] = timeString.split(':').map(Number);
  let newHour = hour + 8;

  if (newHour >= 24) {
    newHour = newHour - 24;
  }

  return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// Read HTML content from local file
fs.readFile('../website.html', 'utf8', (err, html) => {
  if (err) {
    console.error(`Error reading the file: ${err}`);
    return;
  }

  const $ = cheerio.load(html);
  let events = [];
  const uniqueEvents = new Set(); // To keep track of unique events

  $('tr').each((index, element) => {
    let time = $(element).find('span.t').text().trim();
    time = addTwoHours(time); // Add 2 hours to the event time
    const text = $(element).find('td').last().text().trim();
    const link = $(element).find('a').attr('href'); // Extracting the link

    // Use regex to exclude unwanted events
    if (/(Boxeo Internacional:|Formula 1:|UFC Fight Night:|Copa Mundial de la FIBA:)/.test(text)) {
      return;
    }

    const regex = /(.+?):\s+(.+)/;
    const match = text.match(regex);

    if (match) {
      const league = match[1];
      let teams = match[2];
      let [homeTeam, awayTeam] = teams.split(' vs ');

      // Remove '(HD)' from team names
      homeTeam = homeTeam.replace(/\(HD\)/, '').trim();
      awayTeam = awayTeam.replace(/\(HD\)/, '').trim();

      // Create a unique string representing the event
      const uniqueEventString = `${time}-${league}-${homeTeam}-${awayTeam}`;

      // Check if the event is unique before adding
      if (!uniqueEvents.has(uniqueEventString)) {
        uniqueEvents.add(uniqueEventString);
        events.push({
          time,
          league,
          homeTeam,
          awayTeam,
          link // Including the link
        });
      }
    }
  });

  // Save to JSON
  fs.writeFileSync('events.json', JSON.stringify(events, null, 2));
  console.log('Unique events saved to events.json');
});
