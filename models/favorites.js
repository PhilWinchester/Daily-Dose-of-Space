const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect.js');

function getEntries(req, res, next) {
  // find all favorites for your userId
  getDB().then((db) => {
    db.collection('data')
      .find({ userId: { $eq: req.session.userId } })
      .toArray((toArrErr, data) => {
        if(toArrErr) return next(toArrErr);

        res.entries = data;
        db.close();
        next();
      });
      return false;
  });
  return false;
};

function getEntry(req,res,next) {
  getDB().then((db) => {
    db.collection('data')
      .findOne({ _id: ObjectID(req.params.id) }, (findErr, sunset) => {
        if(findErr) return next(findErr);
        console.log(sunset);
        res.sunset = sunset;
        db.close();
        next();
      });
      return false;
  });
  return false;
}

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

function updateEntry(req,res,next) {
  getDB().then((db) => {
    db.collection('data')
      .findAndModify({ _id: ObjectID(req.params.id) }, [] /* sort */,
      { $set: req.body.sunset }, { new: true } /* options */, (updateError, doc) => {
        if (updateError) return next(updateError);

        // return the data
        res.updated = doc;
        db.close();
        return next();
      });
    return false;
    });
  return false;
};

// function editMovie(req, res, next) {
//   MongoClient.connect(dbConnection, (err, db) => {
//     if (err) return next(err);
//
//     db.collection('movies')
//       .findAndModify({ _id: ObjectID(req.params.id) }, [] /* sort */,
//       { $set: req.body.movie }, { new: true } /* options */, (updateError, doc) => {
//         if (updateError) return next(updateError);
//
//         // return the data
//         res.updated = doc;
//         db.close();
//         return next();
//       });
//     return false;
//   });
//   return false;
// }

module.exports = { getEntries, deleteEntry, updateEntry, getEntry };
