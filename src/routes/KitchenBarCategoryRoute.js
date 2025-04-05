const express = require('express');
const KitchenBarCategoryRouter = express.Router();
const KitchenBarCategoryController = require("../controller/KitchenBarCategoryController")();

KitchenBarCategoryRouter.patch('/edit', KitchenBarCategoryController.editCategory)

KitchenBarCategoryRouter.post('/new', KitchenBarCategoryController.newCategory)

KitchenBarCategoryRouter.get('/select/:name', KitchenBarCategoryController.selectCategory)

KitchenBarCategoryRouter.get('/all/:page/:perPage', KitchenBarCategoryController.allCategories)


module.exports = KitchenBarCategoryRouter;
