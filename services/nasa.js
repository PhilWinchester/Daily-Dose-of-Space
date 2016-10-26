const fetch = require("node-fetch");

const APOD_URL = "https://api.nasa.gov/planetary/apod?api_key="
const EPIC_URL = "https://api.nasa.gov/EPIC/api/v1.0/images.php?api_key="
const API_KEY = process.env.NASA_KEY;

function getApod(req,res, next) {
  fetch(`${APOD_URL}${API_KEY}`)
  .then(r => r.json())
  .then((result) => {
    res.apod = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  });
};

function getEpic(req,res,next) {
  fetch(`${EPIC_URL}${API_KEY}`)
  .then(r => r.json())
  .then((result) => {
    res.epic = result;
    console.log(result);
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  })

}

module.exports = { getApod, getEpic }
