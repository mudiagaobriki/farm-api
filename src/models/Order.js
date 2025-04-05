const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const orderSchema = new mongoose.Schema({
    status: { type: String},
    orderTime: { type: String },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    executionTime: { type: String },
    details: { type: String },
    bonusPrice: { type: String },
    profile: { type: String },
    assignedTo: { type: String },
    attendedBy: { type: String },
    feedback: { type: String },
    items: [{ type: String }],
    pendingBalance: [{ type: String }],
},{
    collection: 'demo_orders',
    versionKey: false
});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", orderSchema);
