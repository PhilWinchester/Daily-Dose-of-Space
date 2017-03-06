const fetch = require('node-fetch');

const API_URL = "http://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&";
const API_KEY = process.env.AIRNOW_KEY;

function getAirNowData(req,res,next) {
  console.log("Air Now Fetch");
  fetch(`${API_URL}latitude=${req.body.latitude.slice(0,7)}&longitude=${req.body.longitude.slice(0,7)}&distance=150&API_KEY=${API_KEY}`)
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
