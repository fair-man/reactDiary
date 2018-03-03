var express = require('express');
var router = express.Router();
var Expense = require('../models/expense');
var Tag = require('../models/tag');
var _ = require('lodash');
var Enum = require('../lib/enum');

var date = new Date();

router.get('/', function (req, res, next) {
  if (req.session.user) {
    return Tag.find({parentId: req.session.user},
      function (err, tags) {
      if (!err) {
        res.status(200)
           .type('application/json')
           .send(JSON.stringify({
             data:{
               tags: tags
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

    Tag.findOne({parentId: req.session.user, name: req.body.name},
      function (err, tag) {
        if (!err) {
          if (tag) {
            return res.status(403)
              .type('application/json')
              .send(JSON.stringify({
                  rc: 50,
                  message: Enum.rcs[50]
                }
              ));
          } else {
            var tag = new Tag({
              name: req.body.name,
              color: req.body.color,
              parentId: req.session.user
            });

            tag.save(function (err, tag) {
              if (!err) {
                res.status(200)
                  .type('application/json')
                  .send(JSON.stringify({
                      data: {
                        tags: [tag]
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
          }
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

router.put('/', function (req, res, next) {
  if (req.session.user) {
    Tag.findOne({parentId: req.session.user, name: req.body.name},
      function (err, tag) {
        if (!err) {
          if (tag && (tag.name === req.body.name) && (tag.color === req.body.color)) {
            return res.status(403)
              .type('application/json')
              .send(JSON.stringify({
                  rc: 50,
                  message: Enum.rcs[50]
                }
              ));
          } else {
            Tag.update({parentId: req.session.user, _id: req.body.id},
              {
                name: req.body.name,
                color: req.body.color,
              }, function (err, tag) {
                if (!err) {
                  Tag.find({parentId: req.session.user}, function (err, tags, next) {
                    if(err) return next(err);
                    res.status(200)
                      .type('application/json')
                      .send(JSON.stringify({
                          data: {
                            tags: tags
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
          }
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
})

router.delete('/', function (req, res, next) {
  if(req.session.user) {
    return Tag.remove({_id: req.body.removeId}, function (err, data, effected) {
      if (!err) {
        Expense.find({parentId: req.session.user}, function (err, expenses) {
          expenses.forEach(function (expense) {
            if (expense.tagId && expense.tagId === req.body.removeId) {
              expense.tagId = null;
              expense.save(function (err, expense) {
                if (!err) {
                  console.log('saved');
                } else {
                  console.log(err)
                  console.log('not saved')
                }
              })
            }
          });
          res.status(200)
             .type('application/json')
             .send(JSON.stringify({
               rc: 0,
               message: Enum.rcs[0]
             }
          ));
        })
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
