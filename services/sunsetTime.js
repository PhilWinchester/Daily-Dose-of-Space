const fetch = require('node-fetch');

const API_URL = "http://api.sunrise-sunset.org/json?";

function getSunsetTimeData(req,res,next) {
  console.log("Sunset Time Fetch");
  fetch(`${API_URL}lat=${res.user.latitude}&lng=${res.user.longitude}`)
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
