const fetch = require('node-fetch');

const API_URL = "http://api.openweathermap.org/data/2.5/weather?";
const API_KEY = process.env.OPENWEATHER_KEY;

function getOpenWeatherData(req,res,next) {
  console.log("Open Weather Fetch");
  console.log("req.body", req.body);
  fetch(`${API_URL}lat=${req.body.latitude.slice(0,7)}&lon=${req.body.longitude.slice(0,7)}&appid=${API_KEY}`)
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
