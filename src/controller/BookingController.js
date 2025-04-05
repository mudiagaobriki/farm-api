const Booking = require("../models/Booking");

function BookingController() {
  const newBooking = async (req, res) => {
    try {
      // Get user input
      const {
        customer,
        room,
        checkIn,
        checkOut,
        bookingDate,
        adults,
        kids,
        orders,
        paymentMode,
        expectedAmount,
        paid,
        balance,
        notes,
      } = req.body;

      // Validate user input
      if (!(customer && room && checkIn)) {
        return res.status(400).send("Customer, room and checkin are required.");
      }

      // check if user already exist
      // Validate if account number already exists in our database
      // const oldBeneficiary = await Beneficiary.findOne({accountNumber});
      //
      // if (oldBeneficiary) {
      //     return res.status(409).send("Clear your previous Beneficiary before applying for another.");
      // }

      // Create user in our database
      const booking = await Booking.create({
        customer,
        room,
        checkIn,
        checkOut,
        bookingDate,
        adults,
        kids,
        orders,
        paymentMode,
        expectedAmount,
        paid,
        balance,
        notes,
      });

      if (booking) {
        return res.status(201).json({ booking, status: "success" });
      } else {
        return res
          .status(400)
          .send("Error in Booking Creation. Please try again later.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const allBookings = async (req, res) => {
    try {
      const page = parseInt(req.params?.page, 10) || 1;
      const perPage = parseInt(req.params?.perPage, 10) || 10;
      const q = req.query?.q;

      const options = {
        page: page,
        limit: perPage,
        sort: { createdAt: -1 },
        populate: [
          { path: 'customer', select: 'firstName lastName otherNames _id' }, // Populate customer with name and ID
          { path: 'room', select: 'name _id type' }, // Populate room with name and ID
        ],
        lean: true, // Ensure plain objects are returned
      };

      const query = q
          ? { Booking: { $regex: q, $options: 'i' } } // Use regex to match bookings if a query exists
          : {};

      const bookings = await Booking.paginate(query, options);

      if (!bookings) {
        return res.status(404).send({
          status: "error",
          message: "No bookings found",
        });
      }

      return res.status(200).send({
        status: "success",
        data: {
          docs: bookings.docs, // Includes populated fields
          totalDocs: bookings.totalDocs,
          totalPages: bookings.totalPages,
          page: bookings.page,
          limit: bookings.limit,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: "error",
        message: "Failed to fetch bookings",
      });
    }
  };



  const selectBooking = async (req, res) => {
    try {
      // Get user input
      const { id } = req.params;

      const booking = await Booking.find({ _id: id });

      console.log({ booking });

      if (!booking) {
        return res.send({
          status: "error",
          data: "No Booking with that id",
        });
      }

      // return the subscription found
      res.status(200).send({
        status: "success",
        data: booking,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const editBooking = async (req, res) => {
    try {
      // Get user input
      const { id, payload } = req.body;

      console.log({id, payload});

      const booking = await Booking.findOneAndUpdate({ _id: id }, payload);

      console.log({ booking });

      if (!booking) {
        return res.send({
          status: "error",
          data: "No Booking with that id",
        });
      }

      // return the subscription found
      res.status(200).send({
        status: "success",
        data: booking,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return { newBooking, allBookings, selectBooking, editBooking };
}

module.exports = BookingController;
