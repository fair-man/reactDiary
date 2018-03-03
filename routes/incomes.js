var express = require('express');
var router = express.Router();
var Income = require('../models/income');
var moment = require('moment');
var Enum = require('../lib/enum');

var date = new Date();
var startDateCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
var lastDateCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0);

router.get('/', function (req, res, next) {
  if (req.session.user) {
    return Income.find({parentId: req.session.user, dateCreated: {
      "$gte" : startDateCurrentMonth,
      "$lt" : lastDateCurrentMonth }},
      function (err, incomes) {
      if (!err) {
        res.status(200)
           .type('application/json')
           .send(JSON.stringify({
             data: {
               incomes: incomes
             },
             rc: 0,
             message: Enum.rcs[0]
           }
        ));
      } else {
        console.log(err)
      }
    })
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

router.post('/', function (req, res, next) {
  if(req.session.user) {
    if (new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")) > lastDateCurrentMonth) {
      res.status(403).type('application/json').send(JSON.stringify({rc: 40, message: Enum.rcs[40]}));
      return;
    }

    var income = new Income({
      name: req.body.name,
      money: Number(req.body.money),
      dateCreated: new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")),
      parentId: req.session.user
    });

    income.save(function (err, income) {
      if (!err) {
        if (income.dateCreated >= startDateCurrentMonth && income.dateCreated <= lastDateCurrentMonth) {
          res.status(200)
            .type('application/json')
            .send(JSON.stringify({
                data: {
                  incomes: [income]
                },
                rc: 0
              }
            ));
        } else {
          res.status(200)
            .type('application/json')
            .send(JSON.stringify({
                data: {
                  incomes: []
                },
                rc: 0,
                message: Enum.rcs[41]
              }
            ));
        }
      } else {
        res.status(403)
           .type('application/json')
           .send(JSON.stringify({
             rc: 20,
             message: Enum.rcs[20]
           }
        ));
      }
    })
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

router.put('/', function (req, res, next) {
  if (req.session.user) {
    if (new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")) > lastDateCurrentMonth) {
      res.status(403).type('application/json').send(JSON.stringify({rc: 40, message: Enum.rcs[40]}));
      return;
    }

    Income.update({parentId: req.session.user, _id: req.body.id}, {
      name: req.body.name,
      money: Number(req.body.money),
      dateCreated: new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")),
      parentId: req.session.user
    }, function (err, income) {
      if (!err) {
        Income.find({parentId: req.session.user, _id: req.body.id}, function (err, income, next) {
          if(err) return next(err);
          // res.status(200)
          //    .type('application/json')
          //    .send(JSON.stringify({
          //      data: {
          //        income: income[0]
          //      },
          //      rc: 0,
          //      message: Enum.rcs[0]
          //    }
          // ));
          var income = income[0];
          if (income.dateCreated >= startDateCurrentMonth && income.dateCreated <= lastDateCurrentMonth) {
            res.status(200)
              .type('application/json')
              .send(JSON.stringify({
                  data: {
                    incomes: [income]
                  },
                  rc: 0
                }
              ));
          } else {
            res.status(200)
              .type('application/json')
              .send(JSON.stringify({
                  data: {
                    incomes: []
                  },
                  rc: 0,
                  message: Enum.rcs[42]
                }
              ));
          }
        })
      } else {
        res.status(403)
           .type('application/json')
           .send(JSON.stringify({
             rc: 20,
             message: Enum.rcs[20]
           }
        ));
      }
    })
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

router.delete('/', function (req, res, next) {
  if(req.session.user) {
    var selectedIds = req.body.selectedIds.split('&');
    var requestArr = [];

    if (selectedIds.length) {
      selectedIds.forEach(function (id) {
        requestArr.push({_id: id});
      });
    }
    return Income.remove({$or: requestArr}, function (err, data, effected) {
      if (!err) {
        res.status(200)
           .type('application/json')
           .send(JSON.stringify({
             data: {
               removeIncomes: selectedIds
             },
             rc: 0,
             message: Enum.rcs[0]
           }
        ));
      } else {
        console.log(err);
        res.status(403)
           .type('application/json')
           .send(JSON.stringify({
             rc: 20,
             message: Enum.rcs[20]
           }
        ));
      }
    })
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
