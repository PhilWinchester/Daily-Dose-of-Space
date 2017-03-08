const fetch                   = require('node-fetch');
const { getDB }               = require('../lib/dbConnect.js');

const API_URL                 = "https://www.zipcodeapi.com/rest/";
const API_KEY                 = process.env.ZIPCODE_KEY;

function getLatLongByZip(req,res,next) {
  console.log("Zip api fetch", req.body);
  let zipQuery = ""
  if (req.body.zipcode != undefined) {
    zipQuery = req.body.zipcode;
  } else {
    zipQuery = res.zipResponse;
  }
  console.log("zipQuery", zipQuery);
  fetch(`${API_URL}${API_KEY}/info.json/${zipQuery}/degrees`)
    .then(r => r.json())
    .then((result) => {
      res.latLongResponse = result;
      next();
    })
    .catch((err) => {
      res.err = err;
      next();
    });
};

function getLatLongByCity(req,res,next) {
  console.log("City api fetch", req.body);
  fetch(`${API_URL}${API_KEY}/city-zips.json/${req.body.city}/${req.body.state}`)
    .then(r => r.json())
    .then((result) => {
      res.zipResponse = result;
      next();
    })
    .catch((err) => {
      res.err = err;
      next();
    });
};



module.exports = { getLatLongByZip, getLatLongByCity }
