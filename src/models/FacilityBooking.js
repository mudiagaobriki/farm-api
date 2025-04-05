const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const facilityBookingSchema = new mongoose.Schema({
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    },
    bookedBy: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    depositAmount: {
        type: Number,
        default: 0
    },
    balanceAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{
    collection: 'demo_facility_bookings',
    versionKey: false
});

facilityBookingSchema.plugin(mongoosePaginate);

const FacilityBooking = mongoose.model('FacilityBooking', facilityBookingSchema);

module.exports = FacilityBooking;
