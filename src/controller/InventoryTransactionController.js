const InventoryTransaction = require('../models/InventoryTransaction');

exports.logTransaction = async (req, res) => {
    try {
        const { itemName, quantityChanged, pricePerUnit, actionType } = req.body;

        if (!itemName || !quantityChanged || !pricePerUnit || !actionType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const totalPrice = quantityChanged * pricePerUnit;

        const transaction = await InventoryTransaction.create({
            item: itemName,
            quantity: quantityChanged,
            unitPrice: pricePerUnit,
            price: totalPrice,
            type: actionType,
            date: new Date(),
        });

        return res.status(201).json(transaction);
    } catch (error) {
        console.error('Error logging transaction:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 1000000 } = req.query;
        const transactions = await InventoryTransaction.paginate({}, { page, limit });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
