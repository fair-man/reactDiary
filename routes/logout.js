var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');

router.post('/', function(req, res, next) {
  req.session.destroy();
  res.status(200)
     .type('application/json')
     .send(JSON.stringify({
       rc: 0,
       message: Enum.rcs[0]
     }
  ));
});

module.exports = router;
