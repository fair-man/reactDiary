let express = require('express');
let router = express.Router();
let Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  let User = require('../models/user');
  let params = {};
    params[req.body.type] = req.body.value;
    return User.find(params, function (err, user) {
        if (user) {
            if(req.body.type === 'username') {
                if (user && user.length) {
                    res.status(403)
                       .type('application/json')
                       .send(JSON.stringify({
                          rc: 21,
                          message: Enum.rcs[21]
                       }
                    ));
                } else {
                    res.status(200)
                       .type('application/json')
                       .send(JSON.stringify({
                          rc: 0,
                          message: Enum.rcs[0]
                       }
                    ));
                }
            } else {
                if (user && user.length) {
                    res.status(403)
                       .type('application/json')
                       .send(JSON.stringify({
                          rc: 22,
                          message: Enum.rcs[22]
                       }
                    ));
                } else {
                    res.status(200)
                       .type('application/json')
                       .send(JSON.stringify({
                          rc: 0,
                          message: Enum.rcs[0]
                       }
                    ));
                }
            }
        } else {
            console.log(err);
        }
    })
});

module.exports = router;
