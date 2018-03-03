var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');

router.get('/', function (req, res, next) {
  if(req.session.user) {
    res.status(200)
       .type('application/json')
       .send(JSON.stringify({
         data: {
           user: {
             username: req.session.userData.username,
             email: req.session.userData.email,
             created: req.session.userData.created
           }
         },
         rc: 0,
         message: Enum.rcs[0]
       }
    ));
  } else {
    res.status(403)
       .type('application/json')
       .send(JSON.stringify({
         rc: 20,
         message: Enum.rcs[20]
       }
    ));
  }
});

module.exports = router;
