var apiBenchmark = require("api-benchmark");
const fs = require("fs");

var services = {
  server1: "http://localhost:3000/",
};
var options = {
  minSamples: 100,
};

var routeWithoutCache = { route1: "users?email=Nathan@yesenia.net" };
var routeWithCache = { route1: "cached-users?email=Nathan@yesenia.net" };

apiBenchmark.measure(
  services,
  routeWithoutCache,
  options,
  function (err, results) {
    apiBenchmark.getHtml(results, function (error, html) {
      fs.writeFile("no-cache-results.html", html, function (err) {
        if (err) return console.log(err);
      });
    });
  }
);

apiBenchmark.measure(
  services,
  routeWithCache,
  options,
  function (err, results) {
    apiBenchmark.getHtml(results, function (error, html) {
      fs.writeFile("cache-results.html", html, function (err) {
        if (err) return console.log(err);
      });
    });
  }
);