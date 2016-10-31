const fetch = require('node-fetch');

const latitude = "40.740018";
const longitude = "-73.98974600000001";

const API_URL = "http://api.sunrise-sunset.org/json?";

function getSunsetTimeData(req,res,next) {
  console.log("Sunset Time Fetch");
  fetch(`${API_URL}lat=${latitude}&lng=${longitude}`)
  .then(r => r.json())
  .then((result) => {
    res.sunsetTimeData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getSunsetTimeData }
