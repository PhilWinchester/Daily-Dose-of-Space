const fetch = require("node-fetch");

class NasaData {

  constructor(){
    this.APOD_URL = "https://api.nasa.gov/planetary/apod?api_key="
    this.EPIC_URL = "https://api.nasa.gov/EPIC/api/v1.0/images.php?api_key="
    this.API_KEY = process.env.NASA_KEY;
    this.health = 5;
  }

  getApod(req,res, next) {
    console.log(this.health);
    fetch(`${this.APOD_URL}${this.API_KEY}`)
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

  getEpic(req,res,next) {
    fetch(`${this.EPIC_URL}${this.API_KEY}`)
    .then(r => r.json())
    .then((result) => {
      res.epic = result;
      next();
    })
    .catch((err) => {
      res.err = err;
      next();
    });
  };
};

let nasaService = new NasaData();

module.exports = { nasaService }
