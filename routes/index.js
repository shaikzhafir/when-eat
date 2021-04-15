var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fileName = "../public/javascripts/timing.json";
const data = require("../public/javascripts/timing.json");
const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();
/* GET home page. */
router.get("/", async function (req, res, next) {
  //code to try to extract from cache, else run the scraping
  const dateNow = new Date();
  const dateStored = new Date(data.date);
  console.log(dateNow);
  console.log(dateStored);
  let maghribTime
  let subuhTime 
  if (!datesAreOnSameDay(dateNow, dateStored)) {
    let scrape = await scrapeTime()
    updateJSONTime(dateNow,scrape.subuhTime,scrape.maghribTime)
    maghribTime = scrape.maghribTime
    subuhTime = scrape.subuhTime

  } else {
    maghribTime = data.maghribTime
    subuhTime = data.subuhTime
  }
  res.render("index", {
    title: "When to eat",
    subuhTime: subuhTime,
    maghribTime: maghribTime,
  });
});

module.exports = router;



function updateJSONTime(dateNow, subuhTime, maghribTime) {
  fs.writeFileSync(
    path.resolve(__dirname, fileName),
    JSON.stringify({
      date: dateNow,
      maghribTime: maghribTime,
      subuhTime: subuhTime,
    })
  );
}


 //puppeter code and  extract the timings
async function scrapeTime() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://www.muis.gov.sg/");
  const subuhTime = await page.$eval(
    "#PrayerTimeControl1_Subuh",
    (span) => span.textContent
  );
  const maghribTime = await page.$eval(
    "#PrayerTimeControl1_Maghrib",
    (span) => span.textContent
  );
  await browser.close();
  return { 
    subuhTime :subuhTime, 
    maghribTime : maghribTime }
}