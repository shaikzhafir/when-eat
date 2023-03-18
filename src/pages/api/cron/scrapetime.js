const cheerio = require('cheerio');
const axios = require('axios');
const initDBIfNotExists = require('@/db/sqlite').initDBIfNotExists;
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

        const db = initDBIfNotExists();
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(`INSERT INTO timings (subuh, maghrib) VALUES (?, ?)`, [subuhTime, maghribTime], (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    }
                    resolve();
                });
            });
        });

        const row = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM timings ORDER BY id DESC LIMIT 1`, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve(row);
            });
        });
        console.log(row);
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
