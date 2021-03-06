var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  var User = require('../models/user');
  var authUser = req.session.user;
  var savePath = Enum.accountFileUploadFolder;

  req.files.avatar.mv('./public/' + authUser + '.' + req.files.avatar.name.split('.')[1], function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('file uploaded in path: /' + authUser + '.' + req.files.avatar.name.split('.')[1]);
  })
});

module.exports = router;
