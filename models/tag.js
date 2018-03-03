var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
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

var Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;
