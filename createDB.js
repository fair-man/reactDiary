var async = require('async');
var mongoose = require('./lib/mongoose');
var User = require('./models/user');

function connectDB(callback) {
  mongoose.connection.on('open', callback);
}

function dropDB(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function createUser(callback) {
  var arr = [
    new User({username: 'Ruslan', email: 'ruslan.tukalenko@gmail.com', password: '12345678'})
  ];

  async.each(arr, function (user, callback) {
    user.save(callback)
  }, callback);
}

async.series([
  connectDB,
  dropDB,
  createUser
], function (err, results) {
  if (err) throw err;
  mongoose.disconnect();
  console.log(results)
});