import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const transactionSchema = new Schema({
    type: { type: String },
    paymentMode: { type: String },
    date: { type: Date },
    from: { type: Schema.Types.ObjectId, ref: "Profile" },
    receivedBy: { type: Schema.Types.ObjectId, ref: "Profile" },
    amount: { type: String },
    currency: { type: String, default: "NGN" },
    activity: { type: String },
    details: { type: String },
    title: { type: String },
    images: [{ type: String }],
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
}, {
    collection: 'demo_transaction',
    versionKey: false
});

transactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
