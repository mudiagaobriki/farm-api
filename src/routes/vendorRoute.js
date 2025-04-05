const express = require('express');
const VendorRouter = express.Router();
const VendorController = require("../controller/VendorController")();

VendorRouter.route('/vendor/new')
    .post(VendorController.newVendor)

VendorRouter.route('/vendor/all/:page/:perPage/')
    .get(VendorController.allVendors)

VendorRouter.route('/vendor/details/:email/:accountNumber/')
    .get(VendorController.selectVendor)

VendorRouter.route('/vendor/edit')
    .post(VendorController.editVendor)

module.exports = VendorRouter;
