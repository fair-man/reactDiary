var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  money: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  },
  status: {
    type: Number,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateRelease: {
    type: Date,
    default: Date.now
  },
  parentId: {
    type: String,
    required: true
  },
  tagId: {
    type: String
  }
});

var Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;
