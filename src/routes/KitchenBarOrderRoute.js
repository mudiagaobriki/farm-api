const express = require('express');
const KitchenBarOrderRouter = express.Router();
const KitchenBarOrderController = require("../controller/KitchenBarOrderController")();

KitchenBarOrderRouter.patch('/edit', KitchenBarOrderController.editOrder)

KitchenBarOrderRouter.post('/new', KitchenBarOrderController.newOrder)

KitchenBarOrderRouter.get('/select/:name', KitchenBarOrderController.selectOrder)

KitchenBarOrderRouter.get('/all/:page/:perPage', KitchenBarOrderController.allCategories)


module.exports = KitchenBarOrderRouter;
