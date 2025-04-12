import { Router } from 'express';
import TransactionControllerFactory from '../controller/TransactionController.js';

const transactionRouter = Router();
const TransactionController = TransactionControllerFactory();

// Define routes for transaction management
transactionRouter.post('/transaction/new', TransactionController.newTransaction);
transactionRouter.get('/transaction/all/:page/:perPage', TransactionController.allTransactions);
transactionRouter.get('/transaction/details/:email/:accountNumber', TransactionController.selectTransaction);
transactionRouter.post('/transaction/edit', TransactionController.editTransaction);

export default transactionRouter;
