const Amenity = require('../models/Amenity')
const Room = require("../models/Room");

function AmenityController(){
    const newAmenity = async (req,res) => {
        const {name,description,category,images = []} = req.body;

        // validate the amenities
        if (!name){
            return res.status(400).send("Amenity name is required.")
        }
        if (!category){
            return res.status(400).send("Amenity category is necessary")
        }

        // check if amenity with the same name already exists
        const oldAmenity = await Amenity.findOne({name, isDeleted: false})
        console.log({oldAmenity})

        if (oldAmenity){
            return res.status(409).send('Amenity with the same name already exists')
        }

        const payload = {
            name,description,category,images
        }

        try {
            const amenity = await Amenity.create(payload)

            if (amenity){
                return res.status(201).json('Amenity created successfully')
            }
            else{
                return res.status(400).json('Error in creating amenity')
            }
        }
        catch (err){
            return res.status(500).json({
                message: err?.toString(),
                statusCode: 500
            })
        }
    }

    const editAmenity = async (req,res) => {
        try{
            const {name, payload} = req.body

            const amenity = await Amenity.findOneAndUpdate({name}, payload, {new: true})

            if (!amenity){
                return res.status(404).send('Amenity not found')
            }

            res.send({
                status: "success",
                message: 'Amenity edited successfully',
                data: amenity
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
                amenity: q
            }

            if (q && q.length) {
                const Amenities = await Amenity.paginate(query, options);

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
                const Amenities = await Amenity.paginate({}, options);

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

    const selectAmenity  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const amenity = await Amenity.find({_id: id});

            // console.log({accountNumber})

            if (!amenity){
                return res.send({
                    status: 'error',
                    data: 'No room with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: amenity
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
        newAmenity,
        editAmenity,
        allAmenities,
        selectAmenity,
    }

}

module.exports = AmenityController