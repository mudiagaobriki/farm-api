const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const roomSchema = new mongoose.Schema({
    number: { type: String},
    name: { type: String },
    type: { type: String },
    bonusPrice: { type: String, unique: false },
    images: [{ type: String }],
    videos: [{ type: String, }],
    isBooked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
},{
  collection: 'demo_rooms',
  versionKey: false
});

roomSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Room", roomSchema);
