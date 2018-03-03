var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  var User = require('../models/user');
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) return next();

    if (user) {
      if (user.checkPassword(req.body.currentPassword)) {
        if (req.body.newPassword === req.body.newPasswordConfirm) {
          user.set('password', req.body.newPassword);
          user.save(function (err, user) {
            if (err) return next();

            if (user) {
              res.status(200)
                .type('application/json')
                .send(JSON.stringify({
                    rc: 0,
                    message: Enum.rcs[29]
                  }
                ));
            } else {
              res.status(403)
                .type('application/json')
                .send(JSON.stringify({
                    rc: 28,
                    message: Enum.rcs[28]
                  }
                ));
            }
          })
        } else {
          res.status(403)
            .type('application/json')
            .send(JSON.stringify({
                rc: 28,
                message: Enum.rcs[28]
              }
            ));
        }
      } else {
        res.status(403)
          .type('application/json')
          .send(JSON.stringify({
              rc: 28,
              message: Enum.rcs[28]
            }
          ));
      }
    } else {
      res.status(403)
        .type('application/json')
        .send(JSON.stringify({
            rc: 28,
            message: Enum.rcs[28]
          }
        ));
    }
  })
});

module.exports = router;
