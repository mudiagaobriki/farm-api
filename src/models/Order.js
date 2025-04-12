import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const orderSchema = new Schema({
    status: { type: String },
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
}, {
    collection: "demo_orders",
    versionKey: false,
});

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderSchema);

export default Order;
