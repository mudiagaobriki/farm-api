const express = require("express");
const ItemRouter = express.Router();
const ItemController = require("../controller/ItemController")();
const InventoryTransactionController = require("../controller/InventoryTransactionController");

ItemRouter.route("/new").post(ItemController.newItem);

ItemRouter.route("/all/:page/:perPage/").get(ItemController.allItems);

ItemRouter.route("/item/details/:id/").get(ItemController.selectItem);

ItemRouter.route("/edit-Item").post(ItemController.editItem);

ItemRouter.route("/transactions").post(InventoryTransactionController.logTransaction);

ItemRouter.route("/get-transactions").get(InventoryTransactionController.getTransactions);

module.exports = ItemRouter;
