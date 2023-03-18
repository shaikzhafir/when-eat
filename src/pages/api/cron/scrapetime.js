const cheerio = require('cheerio');
const axios = require('axios');
const Redis = require('ioredis');

require("dotenv").config();

// just doing req and res to debug on localhost
// cron should just call this endpoint
export default async function handler(req, res) {
    // scrape using cheerio
    try {
        const response = await axios.get('https://www.muis.gov.sg/')
        const $ = cheerio.load(response.data);
        const scrapedSubuh = $('#PrayerTimeControl1_Subuh').text();
        const scrapedMaghrib = $('#PrayerTimeControl1_Maghrib').text();
        const subuhTime = convertToTime(scrapedSubuh, false)
        const maghribTime = convertToTime(scrapedMaghrib, true)
        console.log(subuhTime); // Output: the text content of the div with id "PrayerTimeControl1_Subuh"
        console.log(maghribTime); // Output: the text content of the div with id "PrayerTimeControl1_Maghrib"

        let client = new Redis(process.env.REDIS_URL);
        client.on("error", function (err) {
            throw err;
        });
        await client.set('maghrib', maghribTime, Redis.print);
        await client.set('subuh', subuhTime, Redis.print);
        res.status(200).json({ subuh: subuhTime, maghrib: maghribTime })

    } catch (error) {
        console.log(error);
        res.status(503).json({ error: error })
    }
}

function convertToTime(scrapedTime, add12hours) {
    // set the time to 30 seconds past "HH:MM"
    const [hour, minute] = scrapedTime.split(":");
    if (add12hours) {
        return `${parseInt(hour) + 12}:${minute}`;
    }
    // if subuh, dont add extra time
    return `${hour}:${minute}`;
}
