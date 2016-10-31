const fetch = require('node-fetch');

const latitude = "40.740018";
const longitude = "-73.98974600000001";

const API_URL = "http://forecast.weather.gov/MapClick.php?";

function getForecastGovData(req,res,next) {
  console.log("Forecast Gov Fetch");
  fetch(`${API_URL}lat=${latitude}&lon=${longitude}&FcstType=json`)
  .then(r => r.json())
  .then((result) => {
    res.forecastGovData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getForecastGovData }
