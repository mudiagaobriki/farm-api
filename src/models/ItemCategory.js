const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const itemCategorySchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
},{
  collection: 'demo_item_categories',
  versionKey: false
});

itemCategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ItemCategory", itemCategorySchema);
