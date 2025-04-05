const express = require('express');
const ServiceRouter = express.Router();
const ServiceController = require("../controller/ServiceController")();

ServiceRouter.post('/new',ServiceController.newService)

ServiceRouter.get('/all/:page/:perPage/',ServiceController.allServices)

ServiceRouter.get('/details/:id/',ServiceController.selectService)

ServiceRouter.patch('/edit',ServiceController.editService)

module.exports = ServiceRouter;
