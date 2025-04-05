const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const facilitySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  bookingPrice: { type: String },
  healthStatus: { type: String, default: "good" },
  isAvailable:  { type: Boolean, default: true},
  images: [{ type: String }],
  isDeleted: { type: Boolean, default: false},
},{
  collection: 'demo_facilities',
  versionKey: false
});

facilitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Facility", facilitySchema);
