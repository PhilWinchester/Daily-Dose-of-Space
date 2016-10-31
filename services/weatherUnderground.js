const fetch = require('node-fetch');

const API_URL = "http://api.wunderground.com/api/";
const API_KEY = process.env.WEATHERUNDERGROUND_KEY;

function getWeatherUndergroundData(req,res,next) {
  console.log("Weather Underground Fetch");
  fetch(`${API_URL}${API_KEY}/hourly/geolookup/q/${res.user.latitude},${res.user.longitude}.json`)
  .then(r => r.json())
  .then((result) => {
    res.weatherUndergroundData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getWeatherUndergroundData }
