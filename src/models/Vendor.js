const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const vendorSchema = new mongoose.Schema({
    category: { type: String, },
    vendorNo: { type: String },
    officialEmail: { type: String },
    officialNumber: { type: String},
    status: { type: String },
    profile: { type: Schema.Types.ObjectId, ref: "Profile" },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    verified: {type: Boolean, default: false },
},{
  collection: 'demo_vendors',
  versionKey: false
});

vendorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", vendorSchema);
