const express = require('express');
const facilityBookingRouter = express.Router();
const FacilityBookingController = require("../controller/FacilityBookingController")();

facilityBookingRouter.get('/all/:page/:perPage',FacilityBookingController.allFacilityBookings)

facilityBookingRouter.post('/new', FacilityBookingController.newFacilityBooking)

facilityBookingRouter.patch('/edit', FacilityBookingController.editFacilityBooking)

facilityBookingRouter.get('/details/:number/', FacilityBookingController.selectFacilityBooking)


module.exports = facilityBookingRouter;
