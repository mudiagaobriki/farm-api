const Order = require("../models/KitchenBarOrder");

function KitchenBarOrderController() {
    const allCategories = async (req, res) => {
        try {
            const page = parseInt(req.params?.page) || 1;
            const perPage = parseInt(req.params?.perPage) || 10;
            const q = req.query?.q;

            const options = {
                page: page,
                limit: perPage,
                sort: { createdAt: -1 },
            };

            const query = {};
            if (q) {
                query["orderDetails.orderSource"] = q; // Query by `orderSource` if provided
            }

            const types = await Order.paginate(query, options);

            if (types) {
                for (const order of types.docs) {
                    await order.populate("orderItems.Id").execPopulate();
                }

                return res.send({
                    status: "success",
                    data: types,
                });
            } else {
                return res.send({
                    status: "error",
                    message: "Fetching kitchen orders failed",
                });
            }
        } catch (e) {
            return res.send({
                status: "error",
                message: e.toString(),
            });
        }
    };

    const newOrder = async (req, res) => {
        try {
            const { customer, orderDetails, orderItems } = req.body;

            // Validate required fields
            if (!customer || !customer.Id || !customer.roomNumber) {
                return res.status(400).send("Customer ID and room number are required.");
            }

            if (!orderDetails || !orderDetails.orderSource) {
                return res.status(400).send("Order details and order source are required.");
            }

            const validSources = ["kitchen", "bar", "pool"];
            if (!validSources.includes(orderDetails.orderSource)) {
                return res.status(400).send("Invalid order source.");
            }

            if (!Array.isArray(orderItems) || orderItems.length === 0) {
                return res.status(400).send("At least one order item is required.");
            }

            // Create the order
            const order = await Order.create({
                customer,
                orderDetails,
                orderItems,
            });

            return res.status(201).json({
                status: "success",
                data: order,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                status: "error",
                message: err.toString(),
            });
        }
    };


    const editOrder = async (req, res) => {
        try {
            const { id, payload } = req.body;

            if (!id || !payload) {
                return res.status(400).send("Order ID and update payload are required.");
            }

            const order = await Order.findOneAndUpdate({ _id: id }, payload, { new: true });

            if (!order) {
                return res.status(404).send({
                    status: "error",
                    message: "No order found with the provided ID.",
                });
            }

            res.status(200).send({
                status: "success",
                data: order,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                status: "error",
                message: err.toString(),
            });
        }
    };

    const selectOrder = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).send("Order ID is required.");
            }

            const order = await Order.findById(id).populate("orderItems.Id");

            if (!order) {
                return res.status(404).send({
                    status: "error",
                    message: "No order found with the provided ID.",
                });
            }

            res.status(200).send({
                status: "success",
                data: order,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                status: "error",
                message: err.toString(),
            });
        }
    };

    const deleteOrder = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).send("Order ID is required.");
            }

            const order = await Order.findById(id);

            if (!order) {
                return res.status(404).send({
                    status: "error",
                    message: "Order not found.",
                });
            }

            await Order.findByIdAndDelete(id);

            return res.send({
                status: "success",
                message: "Order deleted successfully.",
            });
        } catch (e) {
            console.error(e);
            return res.status(500).send({
                status: "error",
                message: e.toString(),
            });
        }
    };

    return { allCategories, newOrder, editOrder, selectOrder, deleteOrder };
}

module.exports = KitchenBarOrderController;
