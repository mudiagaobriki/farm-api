const express = require('express');
const ServiceOrderRouter = express.Router();
const ServiceOrderController = require("../controller/ServiceOrderController")();

ServiceOrderRouter.patch('/edit', ServiceOrderController.editOrder)

ServiceOrderRouter.post('/new', ServiceOrderController.newOrder)

ServiceOrderRouter.get('/select/:name', ServiceOrderController.selectOrder)

ServiceOrderRouter.get('/all/:page/:perPage', ServiceOrderController.allCategories)


module.exports = ServiceOrderRouter;
