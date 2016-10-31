const fetch = require("node-fetch");

const API_URL = "https://api.unsplash.com/photos/random/?query=sunset&"
const API_KEY = process.env.UNSPLASH_KEY;

// https://api.unsplash.com/photos/random/?collection=sunset-login&client_id=6dd228beddbb535ed095e43e0b42c16a29ce3df71ff95eda910ce578ebdc172a

function randomUnsplashImage(req, res, next){
  fetch(`${API_URL}client_id=${API_KEY}`)
  .then(r => r.json())
  .then((result) => {
    res.backgroundImage = result;
    next();
  })
  .catch((err) => {
    res.err = err;
    next();
  })

}
module.exports = { randomUnsplashImage }
