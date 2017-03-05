const index = require('express').Router();
const path = require('path');

// This is the route that serves your '/' homepage
index.get('/', (req, res) => {
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
