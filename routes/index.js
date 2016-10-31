const express = require('express');
const { randomUnsplashImage } = require("../services/unsplash");

const indexRouter = express.Router();

// This is the route that serves your '/' homepage
indexRouter.get('/', randomUnsplashImage, (req, res) => {
  res.render('index', {
    bgImage: res.backgroundImage
  });
});

// This route serves your `/login` form
indexRouter.get('/login', (req, res) => {
  res.render('login');
});

// This route serves your `/signup` form
indexRouter.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = indexRouter;
