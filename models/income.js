var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var IncomeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  money: {
    type: Number,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  parentId: {
    type: String,
    required: true
  }
});

var Income = mongoose.model('Income', IncomeSchema);
module.exports = Income;