/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const { ObjectID }        = require('mongodb');
const { getDB }           = require('../lib/dbConnect.js');
const bcrypt              = require('bcryptjs');

const SALTROUNDS = 10;

function createUser(req, res, next) {
  const userObject = {
    username: req.body.user.username,
    email: req.body.user.email,
    latitude: req.body.user.latitude,
    longitude: req.body.user.longitude,

    // Store hashed password
    password: bcrypt.hashSync(req.body.user.password, SALTROUNDS)
  };

  console.log(req.body.user.latitude);
  console.log(req.body.user.longitude);

  //user ID is collection ID
  getDB().then((db) => {
    db.collection('users')
      .insert(userObject, (insertErr, dbUser) => {
        if (insertErr) return next(insertErr);
        console.log("inserting new user");
        res.user = dbUser;
        db.close();
        return next();
      });
  });
};

function getUserById(id) {
  return getDB().then((db) => {
    const promise = new Promise((resolve, reject) => {
      db.collection('users')
        .findOne({ _id: ObjectID(id) }, (findError, user) => {
          if (findError) reject(findError);
          db.close();
          resolve(user);
        });
    });
    return promise;
  });
};

function getUserByUsername(username) {
  return getDB().then((db) => {
    const promise = new Promise((resolve, reject) => {
      db.collection('users')
        .findOne({ username }, (findError, user) => {
          if (findError) reject(findError);
          db.close();
          resolve(user);
        });
    });
    return promise;
  });
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
};
