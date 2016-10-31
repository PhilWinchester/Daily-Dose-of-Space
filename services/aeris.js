const fetch               = require('node-fetch');
const { getDB }           = require('../lib/dbConnect.js');

const API_URL             = "https://api.aerisapi.com/observations/within?";
const API_ID              = process.env.AERIS_ID;
const API_SECRET          = process.env.AERIS_SECRET;

function getAerisData(req,res,next) {
  console.log("Aeris Fetch");
  console.log("Aeris fetch data user - ",  res.user);
  // res.user.latitude
  fetch(`${API_URL}p=${res.user.latitude},${res.user.longitude}&radius=50mi&client_id=${API_ID}&client_secret=${API_SECRET}`)
  .then(r => r.json())
  .then((result) => {
    res.aerisData = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

module.exports = { getAerisData }
