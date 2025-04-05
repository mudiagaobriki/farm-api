const express = require('express');
const BookingRouter = express.Router();
const BookingController = require("../controller/BookingController")();

BookingRouter.post('/new',BookingController.newBooking)

BookingRouter.get('/all/:page/:perPage/', BookingController.allBookings)

BookingRouter.get('/details/:email/:accountNumber/',BookingController.selectBooking)

BookingRouter.patch('/edit', BookingController.editBooking)

module.exports = BookingRouter;
