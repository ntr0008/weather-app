const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/page.html");
});

app.post("/", function (req, res) {
  const location = req.body.location;

  // Geocoding API request to get longitude and latitude
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    location
  )}&limit=1&appid=2d54ccaef4c0c5e1195bce3b57f046e0`;

  https.get(geocodeUrl, function (response) {
    response.on("data", function (data) {
      const geocodeData = JSON.parse(data);
      if (geocodeData.length > 0) {
        const latitude = geocodeData[0].lat;
        const longitude = geocodeData[0].lon;

        // Weather API request using longitude and latitude
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2d54ccaef4c0c5e1195bce3b57f046e0&units=imperial`;

        https.get(weatherUrl, function (response) {
          response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl =
              "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write(
              `<h1>The weather in ${location} is ${temp} degrees Fahrenheit</h1>`
            );
            res.write(`<p>The weather description is ${des}</p>`);
            res.write(`<img src="${imageUrl}">`);
            res.send();
          });
        });
      } else {
        res.send("Location not found");
      }
    });
  });
});

app.listen(9000);
