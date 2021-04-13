var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');


/* GET home page. */
router.get('/', function(req, res, next) {
  //puppeter code and  extract the timings 
  (async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.muis.gov.sg/');
    await page.screenshot({path: 'example.png'});
    const subuhTime = await page.$eval('#PrayerTimeControl1_Subuh', span => span.textContent)
    const maghribTime = await page.$eval('#PrayerTimeControl1_Maghrib', span => span.textContent)
    res.render('index', 
  { title: 'When to eat',
    subuhTime : subuhTime,
    maghribTime : maghribTime
    });
    await browser.close();
  })();

  
  
});

module.exports = router;
