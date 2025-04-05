const FacilityBooking = require("../models/FacilityBooking");

function FacilityBookingController(){

    const allFacilityBookings = async (req, res) => {
        try {
            const page = req.params?.page;
            const perPage = req.params?.perPage;
            const q = req.query?.q;

            const options = {
                page: page,
                limit: perPage,
                sort: {createdAt: -1}
            }

            const query = {
                facilityBooking: q
            }

            if (q && q.length) {
                const facilityBookings = await FacilityBooking.paginate(query, options);

                if (facilityBookings){
                    for (const booking of facilityBookings.docs) {
                        await booking.populate('facility').execPopulate();
                    }

                    return res.send({
                        status: "success",
                        data: facilityBookings
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching facilityBookings with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const facilityBookings = await FacilityBooking.paginate({}, options);

                for (const booking of facilityBookings.docs) {
                    await booking.populate('facility').execPopulate();
                }

                if (facilityBookings){
                    return res.send({
                        status: "success",
                        data: facilityBookings
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching facilityBookings failed'
                    })
                }


            }
        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }

    const newFacilityBooking  = async (req, res) => {
        try {
            // Get user input
            const { facility, bookedBy, startDate, endDate,
                guests, depositAmount,
                balanceAmount, status,
                createdAt, updatedAt,
                } = req.body;

            // Validate user input
            if (!(facility || bookedBy)) {
                return res.status(400).send("Facility name and details of person booking it are compulsory.");
            }

            // // check if category name already exists
            // const oldFacilityBooking = await FacilityBooking.findOne({name});
            //
            // if (oldFacilityBooking) {
            //     return res.status(409).send("Facility Booking with the same details exists.");
            // }

            // Create user in our database
            const facilityBooking = await FacilityBooking.create({
                facility, bookedBy, startDate, endDate,
                guests, depositAmount,
                balanceAmount, status,
                createdAt, updatedAt,
            });

            if (facilityBooking){
                return res.status(201).json(facilityBooking);
            }
            else{
                return res.status(400).send('Error in facility Booking creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }
    const editFacilityBooking  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            // const payload = { category, name, costPrice, salePrice,
            //     discount, quantity,
            //     unit, description,
            //     expiryDate, status,
            //     images }

            const facilityBooking = await FacilityBooking.findOneAndUpdate({_id: id}, payload,{new: true});

            // console.log({wallet})

            if (!facilityBooking){
                return res.send({
                    status: 'error',
                    data: 'No facility Booking with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: facilityBooking
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectFacilityBooking  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const facilityBooking = await FacilityBooking.findOne({_id: id});

            // console.log({wallet})

            if (!facilityBooking){
                return res.send({
                    status: 'error',
                    data: 'No facility Booking details with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: facilityBooking
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteFacilityBooking = async (req, res) => {
        try {
            const {id} = req.body;
            const facilityBooking = await FacilityBooking.find({_id: id});
            if (!facilityBooking) {
                return res.status(404).send({
                    status: "error",
                    msg: "Facility Booking not found"
                });
            }

            let deletedFacilityBooking = await FacilityBooking.findOneAndDelete({_id: id});

            if (deletedFacilityBooking){
                return res.send({
                    status: "success",
                    msg: "Facility Booking deleted"
                });
            }
            else{
                return res.send({
                    status: "error",
                    msg: "Facility Booking not deleted successfully"
                });
            }


        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }

    return { newFacilityBooking, editFacilityBooking, selectFacilityBooking, deleteFacilityBooking, allFacilityBookings }
}

module.exports = FacilityBookingController
