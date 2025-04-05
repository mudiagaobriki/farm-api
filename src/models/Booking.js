const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const bookingSchema = new mongoose.Schema({
    customer: { type: Schema.Types.ObjectId, ref: "Profile"},
    room: [{ type: Schema.Types.ObjectId, ref: "Room"}],
    checkIn: { type: String, default: null },
    checkOut: { type: String },
    durationOfStay: { type: String },
    bookingDate: { type: String, unique: false },
    adults: { type: String },
    kids: { type: String },
    orders: [{ type: String }],
    paymentMode: { type: String },
    expectedAmount: { type: String },
    paid: { type: String },
    balance: { type: String },
    notes: { type: String },
    status: { type: String, default: "checked-in" },
},{
  collection: 'demo_bookings',
  versionKey: false
});

bookingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Bookings", bookingSchema);
