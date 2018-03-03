let express = require('express');
let router = express.Router();
let Enum = require('../lib/enum');

router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.status(200)
       .type('application/json')
       .send(JSON.stringify({
          rc: 0,
          message: Enum.rcs[0]
       }
    ));
  } else {
    res.status(401)
       .type('application/json')
       .send(JSON.stringify({
          rc: 10,
          message: Enum.rcs[10]
       }
    ));
  }
});

module.exports = router;
