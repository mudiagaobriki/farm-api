import Transaction from '../models/Transaction.js';

function TransactionController() {
    const newTransaction = async (req, res) => {
        const {
            type, paymentMode, date, from,
            receivedBy, amount, currency, activity, details,
            title, images, items
        } = req.body;

        if (!amount) {
            return res.status(400).send('Transaction amount is required.');
        }

        const payload = {
            type, paymentMode, date, from,
            receivedBy, amount, currency, activity, details,
            title, images, items
        };

        try {
            const transaction = await Transaction.create(payload);

            if (transaction) {
                return res.status(201).json('Transaction created successfully.');
            } else {
                return res.status(400).json('Error in creating transaction.');
            }
        } catch (err) {
            return res.status(500).json({
                message: err?.toString(),
                statusCode: 500
            });
        }
    };

    const editTransaction = async (req, res) => {
        try {
            const { id, payload } = req.body;

            const transaction = await Transaction.findOneAndUpdate({ _id: id }, payload, { new: true });

            if (!transaction) {
                return res.status(404).send('Transaction not found.');
            }

            res.status(200).json({
                status: 'success',
                message: 'Transaction edited successfully',
                data: transaction
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err?.toString()
            });
        }
    };

    const allTransactions = async (req, res) => {
        try {
            const page = req.params?.page || 1;
            const perPage = req.params?.perPage || 10;
            const q = req.query?.q;

            const options = {
                page,
                limit: perPage,
                sort: { createdAt: -1 }
            };

            let query = {};

            if (q && q.length) {
                query = {
                    Transaction: q
                };
            }

            const transactions = await Transaction.paginate(query, options);

            if (transactions) {
                return res.send({
                    status: 'success',
                    data: transactions
                });
            } else {
                return res.send({
                    status: 'error',
                    message: 'Fetching transactions failed'
                });
            }
        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    };

    const selectTransaction = async (req, res) => {
        try {
            const { id } = req.params;

            const transaction = await Transaction.find({ _id: id });

            if (!transaction || transaction.length === 0) {
                return res.send({
                    status: 'error',
                    data: 'No transaction with that id'
                });
            }

            res.status(200).send({
                status: 'success',
                data: transaction
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({
                status: 'error',
                message: 'An error occurred while retrieving the transaction.'
            });
        }
    };

    return {
        newTransaction,
        selectTransaction,
        editTransaction,
        allTransactions
    };
}

export default TransactionController;
