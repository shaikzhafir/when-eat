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
router.get("/", function (req, res, next) {
  //puppeter code and  extract the timings

  //code to try to extract from cache, else run the scraping
  const dateNow = new Date();
  const dateStored = new Date(data.date);
  console.log(dateNow);
  console.log(dateStored);
  if (!datesAreOnSameDay(dateNow, dateStored)) {
    (async () => {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      await page.goto("https://www.muis.gov.sg/");
      await page.screenshot({ path: "example.png" });
      const subuhTime = await page.$eval(
        "#PrayerTimeControl1_Subuh",
        (span) => span.textContent
      );
      const maghribTime = await page.$eval(
        "#PrayerTimeControl1_Maghrib",
        (span) => span.textContent
      );
      fs.writeFileSync(
        path.resolve(__dirname, fileName),
        JSON.stringify({
          date: dateNow,
          maghribTime: maghribTime,
          subuhTime: subuhTime,
        })
      );
      res.render("index", {
        title: "When to eat",
        subuhTime: subuhTime,
        maghribTime: maghribTime,
      });
      await browser.close();
    })();
  } else {
    res.render("index", {
      title: "When to eat",
      subuhTime: data.subuhTime,
      maghribTime: data.maghribTime,
    });
  }
});

module.exports = router;
