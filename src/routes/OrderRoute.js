const express = require('express');
const OrderRouter = express.Router();
const OrderController = require("../controller/OrderController")();

OrderRouter.route('/orders/new')
    .post(OrderController.newOrder)

OrderRouter.route('/order/all/:page/:perPage/')
    .get(OrderController.allOrders)

OrderRouter.route('/order/details/:email/:OrderName/')
    .get(OrderController.selectOrder)

OrderRouter.route('/order/edit-Order/')
    .post(OrderController.editOrder)

module.exports = OrderRouter;
