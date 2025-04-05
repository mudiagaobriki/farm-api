const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const messageSchema = new mongoose.Schema({
  type: { type: String },
  from: { type: String },
  recipients: [{ type: String }],
  body: { type: String },
  status: { type: String },
  sent: {type: Date,default:Date.now},
  isDeleted: { type: Boolean, default: false},
},{
  collection: 'demo_messages',
  versionKey: false
});

messageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Message", messageSchema);
