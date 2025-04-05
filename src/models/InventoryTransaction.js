// models/Transaction.js
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    type: { type: String, enum: ['use', 'restock'], required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: false },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

transactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Transaction', transactionSchema);
