const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const kitchenBarCategorySchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String },
    isDeleted: { type: Boolean, default: false },
},{
  collection: 'demo_kitchen_bar_categories',
  versionKey: false
});

kitchenBarCategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("KitchenBarCategory", kitchenBarCategorySchema);
