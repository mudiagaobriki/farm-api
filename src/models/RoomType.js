const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const roomTypeSchema = new mongoose.Schema({
    name: { type: String},
    price: { type: String },
    amenities: [{ type: String }],
    services: [{ type: String }],
    discount: { type: String },
    weekendPrice: { type: String },
    isDeleted: { type: Boolean, default: false },
},{
  collection: 'demo_room_type',
  versionKey: false
});

roomTypeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("RoomType", roomTypeSchema);
