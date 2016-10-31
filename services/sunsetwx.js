const fetch = require('node-fetch');

const latitude = "40.740018";
const longitude = "-73.98974600000001";

//need to figure out token
const API_URL = "https://sunburst.sunsetwx.com/v1/quality?type=sunset";
const API_AUTHORIZATION = process.env.SUNSETWX_AUTHORIZATION;

const header = {
  "Authorization" : "Bearer " + API_AUTHORIZATION
};

function getSunsetWXData(req,res,next) {
  console.log("Sunsetwx Fetch");
  fetch(`${API_URL}&coords=${longitude}%2C${latitude}`, {
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

module.exports = { getSunsetWXData }
