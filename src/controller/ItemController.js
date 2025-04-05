const Item = require("../models/Item");
const ItemCategory = require("../models/ItemCategory");

function ItemController() {
  const allItems = async (req, res) => {
    try {
      const page = req.params?.page;
      const perPage = req.params?.perPage;
      const q = req.query?.q;

      const options = {
        page: page,
        limit: perPage,
        sort: { createdAt: -1 },
      };

      const query = {
        Item: q,
      };

      if (q && q.length) {
        const items = await Item.paginate(query, options);

        if (items) {
          return res.send({
            status: "success",
            data: items,
          });
        } else {
          return res.send({
            status: "error",
            message: "Fetching items with query failed",
          });
        }
      } else {
        // Pagination of all posts
        const items = await Item.paginate({}, options);

        if (items) {
          return res.send({
            status: "success",
            data: items,
          });
        } else {
          res.send({
            status: "error",
            message: "Fetching items failed",
          });
        }
      }
    } catch (e) {
      return res.send({
        status: "error",
        message: e.toString(),
      });
    }
  };

  const newItem = async (req, res) => {
    try {
      // Get user input
      const {
        category,
        name,
        costPrice,
        salePrice,
        discount = "0",
        quantity = 0,
        unit = "",
        description = "",
        expiryDate = null,
        status = "active",
        images = [],
      } = req.body;

      // Validate user input
      if (!(name || category)) {
        return res.status(400).json({
          message: "Item name and category are compulsory.",
          success: false,
        });
      }

      // check if category name already exists
      const oldItem = await Item.findOne({ name });

      if (oldItem) {
        return res.status(409).json({
          message: "Item with the same details exists.",
          success: false,
        });
      }

      const itemCat = await ItemCategory.findOne({ name: category });
      if (!itemCat) {
        return res.status(400).json({
          message: "Item category is required.",
          success: false,
        });
      }
      console.log("IMCAT::", itemCat);

      // Create item in our database
      const item = await Item.create({
        category: itemCat?._id,
        name,
        costPrice,
        salePrice,
        discount,
        quantity,
        unit,
        description,
        expiryDate,
        status,
        images,
      });

      if (item) {
        return res.status(201).json({
          item,
          success: true,
          message: "Store Item Added Successfully",
        });
      } else {
        return res.status(400).json({
          message: "Error in item creation. Please try again later.",
          success: false,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "An Unexpected error occured",
        success: false,
      });
    }
  };
  const editItem = async (req, res) => {
    try {
      // Get user input
      const { name, payload } = req.body;

      // const payload = { category, name, costPrice, salePrice,
      //     discount, quantity,
      //     unit, description,
      //     expiryDate, status,
      //     images }

      const item = await Item.findOneAndUpdate({ name }, payload, {
        new: true,
      });

      // console.log({wallet})

      if (!item) {
        return res.send({
          status: "error",
          data: "No item with that id",
        });
      }

      // return the subscription found
      res.status(200).send({
        status: "success",
        data: item,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const selectItem = async (req, res) => {
    try {
      // Get user input
      const { name } = req.params;

      const item = await Item.findOne({ name });

      // console.log({wallet})

      if (!item) {
        return res.send({
          status: "error",
          data: "No item details with that id",
        });
      }

      // return the subscription found
      res.status(200).send({
        status: "success",
        data: item,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (req, res) => {
    try {
      const { name } = req.body;
      const item = await Item.find({ name });
      if (!item) {
        return res.status(404).send({
          status: "error",
          msg: "Item not found",
        });
      }

      let deletedItem = await Item.findOneAndDelete({ name });

      if (deletedItem) {
        return res.send({
          status: "success",
          msg: "Item deleted",
        });
      } else {
        return res.send({
          status: "error",
          msg: "Item not deleted successfully",
        });
      }
    } catch (e) {
      return res.send({
        status: "error",
        message: e.toString(),
      });
    }
  };

  return { newItem, editItem, selectItem, deleteItem, allItems };
}

module.exports = ItemController;
