const Order = require("../models/serviceOrder");

function ServiceOrderController(){
    const allCategories = async (req, res) => {
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
                Order: q
            }

            if (q && q.length) {
                const types = await Order.paginate(query, options);

                if (types){
                    // Iterate through each order and populate orderItems
                    for (const order of types.docs) {
                        await order.populate('orderItems.Id').execPopulate();
                    }

                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching kitchen orders with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const types = await Order.paginate({}, options);

                if (types){
                    // Iterate through each order and populate orderItems
                    for (const order of types.docs) {
                        await order.populate('orderItems.Id').execPopulate();
                    }

                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching orders failed'
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

    const newOrder  = async (req, res) => {
        try {
            // Get user input
            const { customer, orderDetails, orderItems
               } = req.body;

            // Validate user input
            if (!(customer && orderDetails)) {
                return res.status(400).send("Customer and order details are compulsory.");
            }

            // // check if order name already exists
            // const oldCategories = await Order.findOne({_id:, isDeleted: false});
            //
            // if (oldCategories) {
            //     return res.status(409).send("Kitchen and Bar Order with the same details exists.");
            // }

            // Create user in our database
            const order = await Order.create({
                customer, orderDetails, orderItems
            });

            if (order){
                return res.status(201).json(order);
            }
            else{
                return res.status(400).send('Error in Kitchen and Bar Order creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }
    const editOrder  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            const order = await Order.findOneAndUpdate({_id: id}, payload,{new: true});

            // console.log({wallet})

            if (!order){
                return res.send({
                    status: 'error',
                    data: 'No Kitchen and Bar Order with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: order
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectOrder  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const order = await Order.findOne({_id:id});

            // console.log({wallet})

            if (!order){
                return res.send({
                    status: 'error',
                    data: 'No Kitchen and Bar Order with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: order
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteOrder = async (req, res) => {
        try {
            const {id} = req.body;
            const order = await Order.find({_id:id});
            if (!order) {
                return res.status(404).send({
                    status: "error",
                    msg: "Kitchen and Bar Order not found"
                });
            }

            let deletedOrder = await Order.findOneAndDelete({_id: id});

            if (deletedOrder){
                return res.send({
                    status: "success",
                    msg: "Order deleted"
                });
            }
            else{
                return res.send({
                    status: "error",
                    msg: "Order not deleted successfully"
                });
            }


        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }


    return { allCategories, newOrder, editOrder, selectOrder, deleteOrder }
}

module.exports = ServiceOrderController
