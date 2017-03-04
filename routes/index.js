const index = require('express').Router();
const path = require('path');
// const { randomUnsplashImage } = require("../services/unsplash");

// const index = express.Router();

// This is the route that serves your '/' homepage
index.get('/', (req, res) => {
  // res.render('index', {
  //   bgImage: res.backgroundImage
  // });
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// This route serves your `/login` form
index.get('/login', (req, res) => {
  res.render('login');
});

// This route serves your `/signup` form
index.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = index;
