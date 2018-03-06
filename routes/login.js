let express = require('express');
let router = express.Router();
let Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  let User = require('../models/user');

  User.findOne({username: req.body.name}, function (err, user) {
    if (err) return next(err);

    if (user) {
      if (user.blockedAccount) {
        res.status(200)
          .type('application/json')
          .send(JSON.stringify({
              data: {
                redirect: true
              },
              rc: 0,
              message: Enum.rcs[24]
            }
          ));
      } else {
        if (user.checkPassword(req.body.password)) {
          req.session.user = user._id;
          req.session.userData = user;
          changeBlockingUserData(user, true);
          res.status(200)
            .type('application/json')
            .send(JSON.stringify({
                rc: 0,
                message: Enum.rcs[0]
              }
            ));
        } else {
          changeBlockingUserData(user, false);
          res.status(403)
            .type('application/json')
            .send(JSON.stringify({
                rc: 23,
                message: Enum.rcs[23]
              }
            ));
        }
      }
    } else {
      res.status(403)
         .type('application/json')
         .send(JSON.stringify({
           rc: 23,
           message: Enum.rcs[23]
         }
      ));
    }
  });

  function changeBlockingUserData(user, auth) {
    if (auth) {
      user.countFailedInputs = 0;
      user.blockedAccount = false;
      user.save();
      return
    } else {
      user.countFailedInputs = user.countFailedInputs ? ++user.countFailedInputs : 1;

      if (user.countFailedInputs >= 5) {
        user.blockedAccount = true;
      }
      user.save();
    }
    console.log(user)
  }
});

module.exports = router;
