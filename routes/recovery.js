var express = require('express');
var router = express.Router();
var Enum = require('../lib/enum');
var nodemailer = require('nodemailer');
var config = require('../config');
var passwordGenerator = require('../lib/passwordGenerator');

router.post('/', function (req, res, next) {
  var User = require('../models/user');

  User.findOne({email: req.body.email}, function (err, user) {
    if (!err && user && user.blockedAccount) {
      var newPassword = passwordGenerator.generate(8).replace('undefined', 'F');

      user.set('password', newPassword);
      user.blockedAccount = false;
      user.countFailedInputs = 0;
      user.save(function (err, user) {
        if (err) return next;

        if (user) {
          console.log(user)
          nodemailer.createTestAccount(function(err, account) {
            var transporter = nodemailer.createTransport(config.get('mailer'));

            var mailOptions = {
              from: config.get('mailer:auth:user'),
              to: req.body.email,
              subject: 'Восстановление пароля для учетной записи на сайте app-diary.herokuapp.com',
              text: 'Восстановление пароля для вашей учетной записи',
              html: '<h4>Здравствуйте!</h4>' +
              '<div>Ваша учетная запись заблокирована. Для восстановления доступа перейдите по ' +
              '<a href="https://app-diary.herokuapp.com" target="_blank">ссылке</a>' +
              ' и авторизуйтесь. Ваши новые данные для авторизации:</br></div>' +
              '<div><b>Login:</b> ' + user.username + '<br/><b>Password:</b> ' + newPassword + '</div><br/>' +
              '<div>С уважением, администраниция сайта app-diary.herokuapp.com</div>'
            };

            var ccOptions = {
              from: config.get('mailer:auth:user'),
              to: 'app.diary.herokuapp@gmail.com',
              subject: 'Восстановление пароля для учетной записи на сайте app-diary.herokuapp.com',
              text: 'Восстановление пароля учетной записи',
              html: '<h4>Здравствуйте!</h4><div>Пароль для учетной записи <b>' + user.username + '</b> был успешно восстановлен</div>'
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                res.status(403)
                  .type('application/json')
                  .send(JSON.stringify({
                      rc: 25,
                      message: Enum.rcs[25]
                    }
                  ));

                return console.log(error);
              } else {
                console.log('Message sent: %s', info.messageId);

                transporter.sendMail(ccOptions, (error, info) => {
                  if (error) {
                    res.status(403)
                      .type('application/json')
                      .send(JSON.stringify({
                          rc: 25,
                          message: Enum.rcs[25]
                        }
                      ));

                    return console.log(error);
                  } else {
                    console.log('Message sent: %s', info.messageId);

                    res.status(200)
                      .type('application/json')
                      .send(JSON.stringify({
                          rc: 0,
                          message: Enum.rcs[27]
                        }
                      ));
                  }
                });
              }
            });
          });
        } else {
          res.status(403)
            .type('application/json')
            .send(JSON.stringify({
                rc: 26,
                message: Enum.rcs[26]
              }
            ));
        }
      });

    } else {
      res.status(403)
        .type('application/json')
        .send(JSON.stringify({
            rc: 26,
            message: Enum.rcs[26]
          }
        ));
    }
  })
});

module.exports = router;
