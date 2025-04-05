const express = require('express');
const TransactionRouter = express.Router();
const TransactionController = require("../controller/TransactionController")();

TransactionRouter.route('/transaction/new')
    .post(TransactionController.newTransaction)

TransactionRouter.route('/transaction/all/:page/:perPage/')
    .get(TransactionController.allTransactions)

TransactionRouter.route('/transaction/details/:email/:accountNumber/')
    .get(TransactionController.selectTransaction)

TransactionRouter.route('/transaction/edit')
    .post(TransactionController.editTransaction)

module.exports = TransactionRouter;
