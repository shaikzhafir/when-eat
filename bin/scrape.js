const puppeteer = require("puppeteer");
require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log("Connected to PlanetScale!");

async function scrapeTime() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://www.muis.gov.sg/");
  const subuhTime = await page.$eval(
    "#PrayerTimeControl1_Subuh",
    (span) => span.textContent
  );
  let maghribTime = await page.$eval(
    "#PrayerTimeControl1_Maghrib",
    (span) => span.textContent
  );

  maghribTime =
    parseInt(maghribTime.split(":")[0]) + 12 + ":" + maghribTime.split(":")[1];

  connection.connect(function (err) {
    if (err) throw err;
    var sql = `INSERT INTO timings (subuh, maghrib) VALUES ('${subuhTime}', '${maghribTime}')`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      console.log(result);
      connection.end();
    });
  });

  await browser.close();
  return {
    subuhTime: subuhTime,
    maghribTime: maghribTime,
  };
}

scrapeTime().then((data) => {
  console.log(data);
});
