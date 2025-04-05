const Facility = require('../models/Facility')
const Room = require("../models/Room");

function FacilityController(){
    const newFacility = async (req,res) => {
        const {name,description,bookingPrice,images = []} = req.body;

        // validate the facilities
        if (!name){
            return res.status(400).send("Facility name is required.")
        }

        // check if facility with the same name already exists
        const oldFacility = await Facility.findOne({name, isDeleted: false})
        console.log({oldFacility})

        if (oldFacility){
            return res.status(409).send('Facility with the same name already exists')
        }

        const payload = {
            name,description,bookingPrice,images
        }

        try {
            const facility = await Facility.create(payload)

            if (facility){
                return res.status(201).json('Facility created successfully')
            }
            else{
                return res.status(400).json('Error in creating facility')
            }
        }
        catch (err){
            return res.status(500).json({
                message: err?.toString(),
                statusCode: 500
            })
        }
    }

    const editFacility = async (req,res) => {
        try{
            const {id, payload} = req.body

            const facility = await Facility.findOneAndUpdate({_id: id}, payload, {new: true})

            if (!facility){
                return res.status(404).send('Facility not found')
            }

            res.send({
                status: "success",
                message: 'Facility edited successfully',
                data: facility
            })

        }
        catch (err){
            return res.status(500).json({
                status: 'error',
                message: err?.toString()
            })
        }
    }

    const allAmenities = async (req, res) => {
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
                facility: q
            }

            if (q && q.length) {
                const Amenities = await Facility.paginate(query, options);

                if (Amenities){
                    return res.send({
                        status: "success",
                        data: Amenities
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Amenities with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const Amenities = await Facility.paginate({}, options);

                if (Amenities){
                    return res.send({
                        status: "success",
                        data: Amenities
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Amenities failed'
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

    const selectFacility  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const facility = await Facility.find({_id: id});

            // console.log({accountNumber})

            if (!facility){
                return res.send({
                    status: 'error',
                    data: 'No room with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: facility
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                status: 'error',
                error: err
            })
        }
    }

    return {
        newFacility,
        editFacility,
        allAmenities,
        selectFacility,
    }

}

module.exports = FacilityController