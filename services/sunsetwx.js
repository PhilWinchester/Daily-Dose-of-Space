const fetch     = require('node-fetch');
const SunsetWx  = require('node-sunsetwx');

//need to figure out token
const API_URL = "https://sunburst.sunsetwx.com/v1/quality?type=sunset";
const API_EMAIL = process.env.SUNSETWX_EMAIL;
const API_KEY = process.env.SUNSETWX_KEY;
const API_PASSWORD = process.env.SUNSETWX_PASSWORD;

function getSunsetWXData(req,res,next) {
  const header = {
    "Authorization" : "Bearer " + res.sunsetwx_authorization
  };
  console.log("Sunsetwx Fetch", header);
  fetch(`${API_URL}&coords=${res.user.longitude}%2C${res.user.latitude}`, {
    headers: header
  })
  .then(r => r.json())
  .then((result) => {
    res.sunsetWxData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = {
  sunsewxLogin,
  getSunsetWXData
}
