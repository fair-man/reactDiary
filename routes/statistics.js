var async = require('async');
var moment = require('moment');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Expense = require('../models/expense');
var Income = require('../models/income');
var _ = require('lodash');
var Enum = require('../lib/enum');

router.post('/', function (req, res, next) {
  if (req.session.user) {
    var paramsIncomes = {parentId: req.session.user, dateCreated: {
      "$gte" : new Date(req.body.startDate),
      "$lte" : new Date(req.body.endDate)
    }};
    var paramsExpenses = {parentId: req.session.user, dateRelease: {
      "$gte" : new Date(req.body.startDate),
      "$lte" : new Date(req.body.endDate)
    }};

    var promise = Income.find(paramsIncomes).exec()
      .then(function(incomes) {
        return Expense.find(paramsExpenses).exec()
         .then(function(expenses) {
           return [incomes, expenses]
         })
      }).then(function(result) {
        res.status(200)
           .type('application/json')
           .send(JSON.stringify({
             data: {
               incomes: result[0],
               expenses: _.filter(result[1], function (expense) {
                 if (expense.status === 1) return expense;
               })
             },
             rc: 0
           }
        ));
      }).catch(function(err) {
        res.status(403)
           .type('application/json')
           .send(JSON.stringify({
             rc: 20,
             message: Enum.rcs[20]
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
});

router.post('/expenses', function (req, res, next) {
  if (req.session.user) {
    var paramsExpense = {parentId: req.session.user, dateRelease: {
      "$gte" : new Date(req.body.startDate.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")),
      "$lte" : new Date(req.body.endDate.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"))
    }};
    paramsExpense.tagId = req.body.tagId === '000000000000000000000000' ? null : req.body.tagId;

    Expense.find(paramsExpense, function (err, expenses) {
      if (!err) {
        res.status(200)
          .type('application/json')
          .send(JSON.stringify({
              data: {
                expenses: expenses
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
