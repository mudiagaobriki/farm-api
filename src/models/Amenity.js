const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const amenitySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  category: { type: String },
  images: [{ type: String }],
  isDeleted: { type: Boolean, default: false},
},{
  collection: 'demo_amenities',
  versionKey: false
});

amenitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Amenity", amenitySchema);
