const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const kitchenBarPresetSchema = new mongoose.Schema({
    category: { type: String },
    name: { type: String },
    price: { type: String },
    description: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
},{
  collection: 'demo_kitchen_bar_presets',
  versionKey: false
});

kitchenBarPresetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("KitchenBarPreset", kitchenBarPresetSchema);
