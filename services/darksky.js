const fetch = require('node-fetch');

const latitude = "40.740018";
const longitude = "-73.98974600000001";

const API_URL = "https://api.darksky.net/forecast/";
const API_KEY = process.env.DARKSKY_KEY;

function getDarkSkyData(req,res,next) {
  console.log("Dark Sky Fetch");
  fetch(`${API_URL}${API_KEY}/${latitude},${longitude}`)
  .then(r => r.json())
  .then((result) => {
    res.darkSkyData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getDarkSkyData }
