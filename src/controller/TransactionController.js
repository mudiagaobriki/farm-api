const Transaction = require('../models/Transaction')

function TransactionController(){
    const newTransaction = async (req,res) => {
        const { type,paymentMode,date,from,
        receivedBy,amount,currency,activity,details,
        title, images, items } = req.body;

        // validate the amenities
        if (!amount){
            return res.status(400).send("Transaction amount is required.")
        }

        // // check if amenity with the same name already exists
        // const oldAmenity = await Amenity.findOne({name})
        // console.log({oldAmenity})
        //
        // if (oldAmenity){
        //     return res.status(409).send('Amenity with the same name already exists')
        // }

        const payload = {
            type,paymentMode,date,from,
            receivedBy,amount,currency,activity,details,
            title, images, items
        }

        try {
            const transaction = await Transaction.create(payload)

            if (transaction){
                return res.status(201).json('Transaction created successfully.')
            }
            else{
                return res.status(400).json('Error in creating transaction.')
            }
        }
        catch (err){
            return res.status(500).json({
                message: err?.toString(),
                statusCode: 500
            })
        }
    }

    const editTransaction = async (req,res) => {
        try{
            const {id, payload} = req.body

            const transaction = await Transaction.findOneAndUpdate({_id:id}, payload, {new: true})

            if (!transaction){
                res.status(404).send('Transaction not found.')
            }

            res.status(200).json({
                status: "success",
                message: 'Profile edited successfully',
                data: transaction
            })

        }
        catch (err){
            return res.status(500).json({
                status: 'error',
                message: err?.toString()
            })
        }
    }

    const allTransactions = async (req, res) => {
        try {
            const page = req.params?.page;
            const perPage = req.params?.perPage;
            const q = req.query?.q;

            const options = {
                page: page,
                limit: perPage,
                sort: {createdAt: -1}
            }

            const query = {
                Transaction: q
            }

            if (q && q.length) {
                const Transactions = await Transaction.paginate(query, options);

                if (Transactions){
                    return res.send({
                        status: "success",
                        data: Transactions
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Transactions with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const Transactions = await Transaction.paginate({}, options);

                if (Transactions){
                    return res.send({
                        status: "success",
                        data: Transactions
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Transactions failed'
                    })
                }


            }
        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }

    const selectTransaction  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const transaction = await Transaction.find({_id: id});

            // console.log({accountNumber})

            if (!transaction){
                return res.send({
                    status: 'error',
                    data: 'No transaction with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: transaction
            });
        } catch (err) {
            console.log(err);
        }
    }

    return {
        newTransaction,
        selectTransaction,
        editTransaction,
        allTransactions,
    }

}

module.exports = TransactionController