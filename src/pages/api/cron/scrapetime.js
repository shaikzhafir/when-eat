const cheerio = require('cheerio');
const axios = require('axios');
const mysql = require("mysql2");
require("dotenv").config();

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

            const connection = mysql.createConnection(process.env.DATABASE_URL);
            console.log("Connected to PlanetScale!");
            var sql = `INSERT INTO timings (subuh, maghrib) VALUES ('${subuhTime}', '${maghribTime}')`;
            connection.execute(sql, [10], (err, rows) => {
                if (err) throw err;
                console.log("1 record inserted");
                console.log(rows);
                connection.end();
                res.status(200).json({ maghribTime: maghribTime, subuhTime: subuhTime })
            });
        })
        .catch(error => {
            console.log(error);
            res.status(503).json({ error: error })
        });

}

function convertToTime(scrapedTime, add12hours) {
    // set the time to 30 seconds past "HH:MM"
    const [hour, minute] = scrapedTime.split(":");
    const date = new Date()
    date.setHours(parseInt(hour) + (add12hours ? 12 : 0), parseInt(minute), 30, 0);
    // create a formatter for the Singapore time zone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Singapore',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    // format the date to a string in the Singapore time zone
    const dateString = formatter.format(date);
    console.log(dateString);

    return dateString
}
