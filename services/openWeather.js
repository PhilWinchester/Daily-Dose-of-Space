const fetch = require('node-fetch');

const latitude = "40.740018";
const longitude = "-73.98974600000001";

const API_URL = "http://api.openweathermap.org/data/2.5/weather?";
const API_KEY = process.env.OPENWEATHER_KEY;

function getOpenWeatherData(req,res,next) {
  console.log("Open Weather Fetch");
  fetch(`${API_URL}lat=${latitude.slice(0,7)}&lon=${longitude.slice(0,7)}&appid=${API_KEY}`)
  .then(r => r.json())
  .then((result) => {
    res.openWeatherData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getOpenWeatherData }
