const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "ItemCategory" },
    name: { type: String },
    costPrice: { type: String },
    salePrice: { type: String },
    discount: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    description: { type: String },
    expiryDate: { type: Date },
    status: { type: String },
    images: [{ type: String }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "demo_items",
    versionKey: false,
  }
);

itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Item", itemSchema);
