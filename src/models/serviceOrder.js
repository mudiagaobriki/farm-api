const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const serviceOrderSchema = new mongoose.Schema({
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
        comments: { type: String, required: true },
        status: { type: String, enum: ['pending', 'in progress', 'delivered', 'cancelled'], default: 'pending' },
    },
    orderItems: [
        {
            Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
},{
  collection: 'demo_service_orders',
  versionKey: false
});

serviceOrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ServiceOrder", serviceOrderSchema);
