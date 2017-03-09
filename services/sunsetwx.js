const fetch      = require('node-fetch');
const urlencoded = require('form-urlencoded');
const SunsetWx   = require('node-sunsetwx');

const API_URL = "https://sunburst.sunsetwx.com/v1/quality?type=sunset";
const API_EMAIL = process.env.SUNSETWX_EMAIL;
const API_PASSWORD = process.env.SUNSETWX_PASSWORD;

function sunsetwxLogin(req,res,next) {
  let loginInfo = {
    email: API_EMAIL.toLowerCase(),
    password: API_PASSWORD
  };

  fetch('https://sunburst.sunsetwx.com/v1/login', {
    headers: {
      'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'
    },
    method: 'POST',
    body: urlencoded(loginInfo)
  })
    .then(r => r.json())
    .then(token => {
      res.sunsetwx_authorization = token.token
      next();
    })
    .catch(err => next(err))
};

function getSunsetWXData(req,res,next) {
  const header = {
    "Authorization" : "Bearer " + res.sunsetwx_authorization
  };
  //These guys do longitude first latitude second
  //longitude: -77.8600012 latitude: 40.7933949

  fetch(`${API_URL}&coords=${req.body.longitude}%2C${req.body.latitude}`, {
    headers: header
  })
    .then(r => r.json())
    .then((result) => {
      res.sunsetWxData = result;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  sunsetwxLogin,
  getSunsetWXData
}
