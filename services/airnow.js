const fetch = require('node-fetch');

const latitude = "40.740018";
const longitude = "-73.98974600000001";

const API_URL = "http://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&";
const API_KEY = process.env.AIRNOW_KEY;

function getAirNowData(req,res,next) {
  console.log("Air Now Fetch");
  fetch(`${API_URL}latitude=${latitude.slice(0,7)}&longitude=${longitude.slice(0,7)}&distance=150&API_KEY=${API_KEY}`)
  .then(r => r.json())
  .then((result) => {
    res.airNowData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getAirNowData }
