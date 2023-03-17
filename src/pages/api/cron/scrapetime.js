const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// just doing req and res to debug on localhost
// cron should just call this endpoint
export default async function handler(req, res) {
    // scrape using cheerio
    axios.get('https://www.muis.gov.sg/')
        .then(response => {
            const $ = cheerio.load(response.data);
            const scrapedSubuh = $('#PrayerTimeControl1_Subuh').text();
            const scrapedMaghrib = $('#PrayerTimeControl1_Maghrib').text();
            const subuhTime = convertToTime(scrapedSubuh, false)
            const maghribTime = convertToTime(scrapedMaghrib, true)
            console.log(subuhTime); // Output: the text content of the div with id "PrayerTimeControl1_Subuh"
            console.log(maghribTime); // Output: the text content of the div with id "PrayerTimeControl1_Maghrib"

            // update json file
            const filePath = path.join(process.cwd(), 'src', 'data.json');
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContents);
            data.subuh = subuhTime
            data.maghrib = maghribTime
            fs.writeFileSync(filePath, JSON.stringify(data));
            res.status(200).json({ maghribTime: maghribTime, subuhTime: subuhTime })
        })
        .catch(error => {
            console.log(error);
            res.status(503).json({ error: error })
        });

}

function convertToTime(scrapedTime, add12hours) {
    // set the time to 30 seconds past "HH:MM"
    const [hour, minute] = scrapedTime.split(":");
    const date = new Date();
    date.setHours(parseInt(hour) + (add12hours ? 12 : 0), parseInt(minute), 30, 0);
    return date;
}
