var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  var User = require('../models/user');
  var user = new User({
    username: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  user.save(function (err, user) {
    if (err) return next(err);
    res.status(200)
       .type('application/json')
       .send(JSON.stringify({
         rc: 0,
         message: Enum.rcs[0]
       }
    ));
  });
});

module.exports = router;
