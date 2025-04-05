const express = require("express");
const ItemCategoryRouter = express.Router();
const ItemCategoryController =
  require("../controller/ItemCategoryController")();

ItemCategoryRouter.patch("/edit", ItemCategoryController.editCategory);

ItemCategoryRouter.post("/new", ItemCategoryController.newItemCategory);

ItemCategoryRouter.get("/select/:name", ItemCategoryController.selectCategory);

ItemCategoryRouter.get(
  "/all/:page/:perPage",
  ItemCategoryController.allCategories
);

module.exports = ItemCategoryRouter;
