let express = require('express');
let router = express.Router();
let Expense = require('../models/expense');
let Enum = require('../lib/enum');

var date = new Date();

router.get('/', function (req, res, next) {
  if (req.session.user) {
    let params = {parentId: req.session.user};
    return Expense.find(params,
      function (err, expenses) {
        if (!err) {
          let expensesCompleted = [],
            expensesActive = [],
            expensesActivePrev = [];

          expenses.forEach(function (expense) {
            let dateRelease = new Date(expense.dateRelease);

            if (date.getMonth() === dateRelease.getMonth()) {
              expense.status === 0 ? expensesActive.push(expense) : expensesCompleted.push(expense);
            } else {
              if ((expense.dateRelease < date) && expense.status === 0) {
                expensesActivePrev.push(expense)
              }
            }
          });
          res.status(200)
             .type('application/json')
             .send(JSON.stringify({
               data:{
                 expensesCompleted: expensesCompleted,
                 expensesActive: expensesActive,
                 expensesActivePrev: expensesActivePrev
               },
               rc: 0,
               message: Enum.rcs[0]
             }));
        } else {
          console.log(err)
        }
      })
  } else {
    res.status(403).type('application/json').send(JSON.stringify({rc: 20, message: Enum.rcs[20]}));
  }
});

router.post('/date', function (req, res, next) {
  let date = new Date(req.body.date);
  let params = {parentId: req.session.user};

  params.dateRelease = {
    "$gte" : new Date(date.getFullYear(), date.getMonth(), 2, 1, 0, 0, 0),
    "$lt" : new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0)
  };

  if(req.session.user) {
    return Expense.find(params,
      function (err, expenses) {
        if (!err) {
          res.status(200)
            .type('application/json')
            .send(JSON.stringify({
              data:{
                expensesNext: expenses,
              },
              rc: 0,
              message: Enum.rcs[0]
            }));
        } else {
          res.status(403).type('application/json').send(JSON.stringify({rc: 20, message: Enum.rcs[20]}));
        }
      })
  } else {
    res.status(403).type('application/json').send(JSON.stringify({rc: 20, message: Enum.rcs[20]}));
  }
});

router.post('/', function (req, res, next) {
  let date = new Date();
  if(req.session.user) {
    if (+new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")) < +date && Number(req.body.status) === 0) {
      res.status(403).type('application/json').send(JSON.stringify({rc: 30, message: Enum.rcs[30]}));
      return;
    }
    if (+new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")) > +date && Number(req.body.status) === 1) {
      res.status(403).type('application/json').send(JSON.stringify({rc: 31, message: Enum.rcs[31]}));
      return;
    }
    let expense = new Expense({
      name: req.body.name,
      money: req.body.money,
      parentId: req.session.user,
      comment: req.body.comment ? req.body.comment : '',
      status: Number(req.body.status),
      dateRelease: new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")),
      tagId: req.body.select ? req.body.select : null
    });

    expense.save(function (err, expense) {
      if (!err) {
        let expensesCompleted = [],
          expensesActive = [],
          expensesActiveNext = [],
          dateRelease = new Date(expense.dateRelease);

        if (date.getMonth() === dateRelease.getMonth()) {
          expense.status === 0 ? expensesActive.push(expense) : expensesCompleted.push(expense);
        } else {
          if ((date.getMonth() + 1) === dateRelease.getMonth()) {
            expensesActiveNext.push(expense)
          }
        }

        if (expensesCompleted.length) {
          res.status(200)
             .type('application/json')
             .send(JSON.stringify({
               data: {
                 expensesCompleted: expensesCompleted
               },
               rc: 0,
               message: Enum.rcs[0]
             }
          ));
        } else if (expensesActive.length) {
          res.status(200)
             .type('application/json')
             .send(JSON.stringify({
               data: {
                 expensesActive: expensesActive
               },
               rc: 0,
               message: Enum.rcs[0]
             }
          ));
        } else {
          res.status(200)
             .type('application/json')
             .send(JSON.stringify({
               data: {
                 expensesActiveNext: expensesActiveNext
               },
               rc: 0,
               message: Enum.rcs[0]
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

router.delete('/', function (req, res, next) {
  if(req.session.user) {
    let selectedIds = req.body.selectedIds.split('&');
    let requestArr = [];

    if (selectedIds.length) {
      selectedIds.forEach(function (id) {
        requestArr.push({_id: id});
      });
    }
    return Expense.remove({$or: requestArr}, function (err, data, effected) {
      if (!err) {
        res.status(200)
           .type('application/json')
           .send(JSON.stringify({
             data: {
               removeExpenses: selectedIds
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

router.put('/', function (req, res, next) {
  if (req.session.user) {
    let params = {parentId: req.session.user};
    let firstDateCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    let inputDate = new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));

    if (inputDate < firstDateCurrentMonth) {
      return res.status(403)
        .type('application/json')
        .send(JSON.stringify({
            rc: 30,
            message: Enum.rcs[30]
          }
        ));
    }

    if (new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")) > new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0)) {
      res.status(403).type('application/json').send(JSON.stringify({rc: 31, message: Enum.rcs[31]}));
      return;
    }

    Expense.update({parentId: req.session.user, _id: req.body.id},
     {
        name: req.body.name,
        money: Number(req.body.money),
        comment: req.body.comment ? req.body.comment : '',
        dateRelease: new Date(req.body.date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")),
        status: Number(req.body.status),
        tagId: req.body.select ? req.body.select : null
     }, function (err, expense) {
      if (!err) {
        Expense.find(params, function (err, expenses, next) {
          if(err) return next(err);
          let expensesCompleted = [],
              expensesActive = [],
              expensesActivePrev = [];

            expenses.forEach(function (expense) {
              let dateRelease = new Date(expense.dateRelease);
              if (dateRelease.getMonth() === date.getMonth()) {
                expense.status === 0 ? expensesActive.push(expense) : expensesCompleted.push(expense);
              } else {
                if ((expense.dateRelease < date) && expense.status === 0) {
                  expensesActivePrev.push(expense)
                }
              }
            });
            res.status(200)
               .type('application/json')
               .send(JSON.stringify({
                 data:{
                   expensesCompleted: expensesCompleted,
                   expensesActive: expensesActive,
                   expensesActivePrev: expensesActivePrev
                 },
                 rc: 0,
                 message: Enum.rcs[0]
               }
            ));
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
})

module.exports = router;
