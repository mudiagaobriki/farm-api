const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const kitchenBarOrderSchema = new mongoose.Schema(
    {
        customer: {
            Id: { type: String, required: true },
            name: { type: String, required: false },
            contactNumber: { type: String, required: false },
            roomNumber: { type: String, required: true },
        },
        orderDetails: {
            orderDate: { type: Date, default: Date.now },
            orderTime: { type: String },
            totalAmount: { type: Number, required: true },
            comments: { type: String, required: false },
            status: {
                type: String,
                enum: ["pending", "in progress", "delivered", "cancelled"],
                default: "pending",
            },
            orderSource: {
                type: String,
                enum: ["kitchen", "bar", "pool"],
                required: true,
            },
        },
        orderItems: [
            {
                Id: { type: mongoose.Schema.Types.ObjectId, ref: "KitchenBarPreset" },
                name: { type: String, required: true }, // Store the name to preserve data if the preset changes
                price: { type: Number, required: true }, // Store the price to maintain historical accuracy
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
    },
    {
        collection: "demo_kitchen_bar_orders",
        versionKey: false,
    }
);

kitchenBarOrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("KitchenBarOrder", kitchenBarOrderSchema);
