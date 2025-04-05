const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const serviceSchema = new mongoose.Schema({
    // isInternal: { type: Boolean},
    // vendor: { type: String, unique: false },
    name: { type: String },
    price: { type: String },
    status: { type: String },
    isDeleted: { type: Boolean, default: false },
},{
  collection: 'demo_services',
  versionKey: false
});

serviceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Service", serviceSchema);
