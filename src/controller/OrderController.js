const Order = require("../models/Order");
const mongoose = require("mongoose");

function OrderController(){
    const newOrder  = async (req, res) => {
        try {
            // Get user input
            const { status, orderTime, service, room, executionTime, details, bonusPrice , profile,
            assignedTo, attendedBy, feedback, items, pendingBalance } = req.body;

            // Validate user input
            if (!(status && orderTime)) {
                return res.status(400).send("Status and Order Time are necessary.");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            // const oldFDR = await FDR.findOne({email});

            // if (oldFDR) {
            //     return res.status(409).send("Clear your previous FDR before applying for another.");
            // }

            // Create user in our database
            const order = await Order.create({
                status, orderTime, service, room, executionTime, details, bonusPrice , profile,
                assignedTo, attendedBy, feedback, items, pendingBalance
            });

            if (order){
                return res.status(201).json(order);
            }
            else{
                return res.status(400).send('Error in Order creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allOrders = async (req, res) => {
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
                const orders = await Order.paginate(query, options);

                if (orders){
                    return res.send({
                        status: "success",
                        data: orders
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Orders with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const orders = await Order.paginate({}, options);

                if (orders){
                    return res.send({
                        status: "success",
                        data: orders
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Orders failed'
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

    const selectOrder  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const order = await Order.findOne({_id: id});

            console.log({order})

            if (!order){
                return res.send({
                    status: 'error',
                    data: 'No order with that id'
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

    const editOrder  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            const order = await Order.findOneAndUpdate({_id: id}, payload);

            console.log({order})

            if (!order){
                return res.send({
                    status: 'error',
                    data: 'No order with that id'
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

    return { newOrder, allOrders, editOrder, selectOrder, }
}

module.exports = OrderController
