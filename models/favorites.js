const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect.js');

function getEntries(req, res, next) {
  // find all favorites for your userId
  getDB().then((db) => {
    db.collection('data')
      .find({ userId: { $eq: req.session.userId } })
      .toArray((toArrErr, data) => {
        if(toArrErr) return next(toArrErr);
        console.log(data);
        res.entries = data;
        db.close();
        next();
      });
      return false;
  });
  return false;
};

function deleteEntry(req, res, next) {
  getDB().then((db) => {
    db.collection('data')
      .findAndRemove({ _id: ObjectID(req.params.id) }, (removeErr, result) => {
        if (removeErr) return next(removeErr);
        res.removed = result;
        db.close();
        next();
      });
      return false;
  });
  return false;
};


module.exports = { getEntries, deleteEntry };
