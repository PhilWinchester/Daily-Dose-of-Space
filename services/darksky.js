const fetch = require('node-fetch');

const API_URL = "https://api.darksky.net/forecast/";
const API_KEY = process.env.DARKSKY_KEY;

function getDarkSkyData(req,res,next) {
  console.log("Dark Sky Fetch");
  fetch(`${API_URL}${API_KEY}/${req.body.latitude},${req.body.longitude}`)
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
