const fetch = require('node-fetch');

const API_URL = "http://forecast.weather.gov/MapClick.php?";

function getForecastGovData(req,res,next) {
  console.log("Forecast Gov Fetch");
  fetch(`${API_URL}lat=${req.body.latitude}&lon=${req.body.longitude}&FcstType=json`)
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
