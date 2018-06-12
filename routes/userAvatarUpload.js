var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  var User = require('../models/user');
  var authUser = req.session.user;
  var savePath = Enum.accountFileUploadFolder;

  req.files.avatar.mv('./' + savePath + req.files.avatar.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  })
});

module.exports = router;
