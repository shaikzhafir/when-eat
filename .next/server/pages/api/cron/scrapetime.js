"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/cron/scrapetime";
exports.ids = ["pages/api/cron/scrapetime"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "cheerio":
/*!**************************!*\
  !*** external "cheerio" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("cheerio");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(api)/./src/pages/api/cron/scrapetime.js":
/*!******************************************!*\
  !*** ./src/pages/api/cron/scrapetime.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\nconst cheerio = __webpack_require__(/*! cheerio */ \"cheerio\");\nconst axios = __webpack_require__(/*! axios */ \"axios\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst path = __webpack_require__(/*! path */ \"path\");\n// just doing req and res to debug on localhost\n// cron should just call this endpoint\nasync function handler(req, res) {\n    // scrape using cheerio\n    axios.get(\"https://www.muis.gov.sg/\").then((response)=>{\n        const $ = cheerio.load(response.data);\n        const scrapedSubuh = $(\"#PrayerTimeControl1_Subuh\").text();\n        const scrapedMaghrib = $(\"#PrayerTimeControl1_Maghrib\").text();\n        const subuhTime = convertToTime(scrapedSubuh, false);\n        const maghribTime = convertToTime(scrapedMaghrib, true);\n        console.log(subuhTime); // Output: the text content of the div with id \"PrayerTimeControl1_Subuh\"\n        console.log(maghribTime); // Output: the text content of the div with id \"PrayerTimeControl1_Maghrib\"\n        // update json file\n        const filePath = path.join(process.cwd(), \"src\", \"data.json\");\n        const fileContents = fs.readFileSync(filePath, \"utf8\");\n        const data = JSON.parse(fileContents);\n        data.subuh = subuhTime;\n        data.maghrib = maghribTime;\n        fs.writeFileSync(filePath, JSON.stringify(data));\n        res.status(200).json({\n            maghribTime: maghribTime,\n            subuhTime: subuhTime\n        });\n    }).catch((error)=>{\n        console.log(error);\n        res.status(503).json({\n            error: error\n        });\n    });\n}\nfunction convertToTime(scrapedTime, add12hours) {\n    // set the time to 30 seconds past \"HH:MM\"\n    const [hour, minute] = scrapedTime.split(\":\");\n    const date = new Date();\n    date.setHours(parseInt(hour) + (add12hours ? 12 : 0), parseInt(minute), 30, 0);\n    return date;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2Nyb24vc2NyYXBldGltZS5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTUEsVUFBVUMsbUJBQU9BLENBQUM7QUFDeEIsTUFBTUMsUUFBUUQsbUJBQU9BLENBQUM7QUFDdEIsTUFBTUUsS0FBS0YsbUJBQU9BLENBQUM7QUFDbkIsTUFBTUcsT0FBT0gsbUJBQU9BLENBQUM7QUFFckIsK0NBQStDO0FBQy9DLHNDQUFzQztBQUN2QixlQUFlSSxRQUFRQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM1Qyx1QkFBdUI7SUFDdkJMLE1BQU1NLEdBQUcsQ0FBQyw0QkFDTEMsSUFBSSxDQUFDQyxDQUFBQSxXQUFZO1FBQ2QsTUFBTUMsSUFBSVgsUUFBUVksSUFBSSxDQUFDRixTQUFTRyxJQUFJO1FBQ3BDLE1BQU1DLGVBQWVILEVBQUUsNkJBQTZCSSxJQUFJO1FBQ3hELE1BQU1DLGlCQUFpQkwsRUFBRSwrQkFBK0JJLElBQUk7UUFDNUQsTUFBTUUsWUFBWUMsY0FBY0osY0FBYyxLQUFLO1FBQ25ELE1BQU1LLGNBQWNELGNBQWNGLGdCQUFnQixJQUFJO1FBQ3RESSxRQUFRQyxHQUFHLENBQUNKLFlBQVkseUVBQXlFO1FBQ2pHRyxRQUFRQyxHQUFHLENBQUNGLGNBQWMsMkVBQTJFO1FBRXJHLG1CQUFtQjtRQUNuQixNQUFNRyxXQUFXbEIsS0FBS21CLElBQUksQ0FBQ0MsUUFBUUMsR0FBRyxJQUFJLE9BQU87UUFDakQsTUFBTUMsZUFBZXZCLEdBQUd3QixZQUFZLENBQUNMLFVBQVU7UUFDL0MsTUFBTVQsT0FBT2UsS0FBS0MsS0FBSyxDQUFDSDtRQUN4QmIsS0FBS2lCLEtBQUssR0FBR2I7UUFDYkosS0FBS2tCLE9BQU8sR0FBR1o7UUFDZmhCLEdBQUc2QixhQUFhLENBQUNWLFVBQVVNLEtBQUtLLFNBQVMsQ0FBQ3BCO1FBQzFDTixJQUFJMkIsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFaEIsYUFBYUE7WUFBYUYsV0FBV0E7UUFBVTtJQUMxRSxHQUNDbUIsS0FBSyxDQUFDQyxDQUFBQSxRQUFTO1FBQ1pqQixRQUFRQyxHQUFHLENBQUNnQjtRQUNaOUIsSUFBSTJCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUUsT0FBT0E7UUFBTTtJQUN4QztBQUVSLENBQUM7QUFFRCxTQUFTbkIsY0FBY29CLFdBQVcsRUFBRUMsVUFBVSxFQUFFO0lBQzVDLDBDQUEwQztJQUMxQyxNQUFNLENBQUNDLE1BQU1DLE9BQU8sR0FBR0gsWUFBWUksS0FBSyxDQUFDO0lBQ3pDLE1BQU1DLE9BQU8sSUFBSUM7SUFDakJELEtBQUtFLFFBQVEsQ0FBQ0MsU0FBU04sUUFBU0QsQ0FBQUEsYUFBYSxLQUFLLENBQUMsR0FBR08sU0FBU0wsU0FBUyxJQUFJO0lBQzVFLE9BQU9FO0FBQ1giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93aGVuLWVhdC8uL3NyYy9wYWdlcy9hcGkvY3Jvbi9zY3JhcGV0aW1lLmpzPzRiNjUiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY2hlZXJpbyA9IHJlcXVpcmUoJ2NoZWVyaW8nKTtcbmNvbnN0IGF4aW9zID0gcmVxdWlyZSgnYXhpb3MnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbi8vIGp1c3QgZG9pbmcgcmVxIGFuZCByZXMgdG8gZGVidWcgb24gbG9jYWxob3N0XG4vLyBjcm9uIHNob3VsZCBqdXN0IGNhbGwgdGhpcyBlbmRwb2ludFxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICAgIC8vIHNjcmFwZSB1c2luZyBjaGVlcmlvXG4gICAgYXhpb3MuZ2V0KCdodHRwczovL3d3dy5tdWlzLmdvdi5zZy8nKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgY29uc3Qgc2NyYXBlZFN1YnVoID0gJCgnI1ByYXllclRpbWVDb250cm9sMV9TdWJ1aCcpLnRleHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNjcmFwZWRNYWdocmliID0gJCgnI1ByYXllclRpbWVDb250cm9sMV9NYWdocmliJykudGV4dCgpO1xuICAgICAgICAgICAgY29uc3Qgc3VidWhUaW1lID0gY29udmVydFRvVGltZShzY3JhcGVkU3VidWgsIGZhbHNlKVxuICAgICAgICAgICAgY29uc3QgbWFnaHJpYlRpbWUgPSBjb252ZXJ0VG9UaW1lKHNjcmFwZWRNYWdocmliLCB0cnVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2coc3VidWhUaW1lKTsgLy8gT3V0cHV0OiB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBkaXYgd2l0aCBpZCBcIlByYXllclRpbWVDb250cm9sMV9TdWJ1aFwiXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtYWdocmliVGltZSk7IC8vIE91dHB1dDogdGhlIHRleHQgY29udGVudCBvZiB0aGUgZGl2IHdpdGggaWQgXCJQcmF5ZXJUaW1lQ29udHJvbDFfTWFnaHJpYlwiXG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBqc29uIGZpbGVcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMnLCAnZGF0YS5qc29uJyk7XG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShmaWxlQ29udGVudHMpO1xuICAgICAgICAgICAgZGF0YS5zdWJ1aCA9IHN1YnVoVGltZVxuICAgICAgICAgICAgZGF0YS5tYWdocmliID0gbWFnaHJpYlRpbWVcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgbWFnaHJpYlRpbWU6IG1hZ2hyaWJUaW1lLCBzdWJ1aFRpbWU6IHN1YnVoVGltZSB9KVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDMpLmpzb24oeyBlcnJvcjogZXJyb3IgfSlcbiAgICAgICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gY29udmVydFRvVGltZShzY3JhcGVkVGltZSwgYWRkMTJob3Vycykge1xuICAgIC8vIHNldCB0aGUgdGltZSB0byAzMCBzZWNvbmRzIHBhc3QgXCJISDpNTVwiXG4gICAgY29uc3QgW2hvdXIsIG1pbnV0ZV0gPSBzY3JhcGVkVGltZS5zcGxpdChcIjpcIik7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZS5zZXRIb3VycyhwYXJzZUludChob3VyKSArIChhZGQxMmhvdXJzID8gMTIgOiAwKSwgcGFyc2VJbnQobWludXRlKSwgMzAsIDApO1xuICAgIHJldHVybiBkYXRlO1xufVxuIl0sIm5hbWVzIjpbImNoZWVyaW8iLCJyZXF1aXJlIiwiYXhpb3MiLCJmcyIsInBhdGgiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwiJCIsImxvYWQiLCJkYXRhIiwic2NyYXBlZFN1YnVoIiwidGV4dCIsInNjcmFwZWRNYWdocmliIiwic3VidWhUaW1lIiwiY29udmVydFRvVGltZSIsIm1hZ2hyaWJUaW1lIiwiY29uc29sZSIsImxvZyIsImZpbGVQYXRoIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJmaWxlQ29udGVudHMiLCJyZWFkRmlsZVN5bmMiLCJKU09OIiwicGFyc2UiLCJzdWJ1aCIsIm1hZ2hyaWIiLCJ3cml0ZUZpbGVTeW5jIiwic3RyaW5naWZ5Iiwic3RhdHVzIiwianNvbiIsImNhdGNoIiwiZXJyb3IiLCJzY3JhcGVkVGltZSIsImFkZDEyaG91cnMiLCJob3VyIiwibWludXRlIiwic3BsaXQiLCJkYXRlIiwiRGF0ZSIsInNldEhvdXJzIiwicGFyc2VJbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/cron/scrapetime.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/cron/scrapetime.js"));
module.exports = __webpack_exports__;

})();