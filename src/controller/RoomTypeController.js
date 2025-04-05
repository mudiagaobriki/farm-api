const RoomType = require("../models/RoomType");

function RoomTypeController(){
    const allRoomTypes = async (req, res) => {
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
                RoomType: q
            }

            if (q && q.length) {
                const types = await RoomType.paginate(query, options);

                if (types){
                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching room types with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const types = await RoomType.paginate({}, options);

                if (types){
                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching room types failed'
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

    const newRoomType  = async (req, res) => {
        try {
            // Get user input
            const { price=0, name, amenities=[], services=[],
                discount="0", weekendPrice,
               } = req.body;

            // Validate user input
            if (!(name)) {
                return res.status(400).send("Room Type name is compulsory.");
            }

            // check if category name already exists
            const oldRoomType = await RoomType.findOne({name, isDeleted: false});

            if (oldRoomType) {
                return res.status(409).send("Room Type with the same details exists.");
            }

            // Create user in our database
            const roomType = await RoomType.create({
                price, name, amenities, services,
                discount, weekendPrice,
            });

            if (roomType){
                return res.status(201).json(roomType);
            }
            else{
                return res.status(400).send('Error in Room Type creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }
    const editRoomType  = async (req, res) => {
        try {
            // Get user input
            const { name, payload } = req.body;

            const roomType = await RoomType.findOneAndUpdate({name}, payload,{new: true});

            // console.log({wallet})

            if (!roomType){
                return res.send({
                    status: 'error',
                    data: 'No Room Type with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: roomType
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectRoomType  = async (req, res) => {
        try {
            // Get user input
            const { name } = req.params;

            const roomType = await RoomType.findOne({name});

            // console.log({wallet})

            if (!roomType){
                return res.send({
                    status: 'error',
                    data: 'No Room Type details with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: roomType
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteRoomType = async (req, res) => {
        try {
            const {name} = req.body;
            const RoomType = await RoomType.find({name});
            if (!RoomType) {
                return res.status(404).send({
                    status: "error",
                    msg: "RoomType not found"
                });
            }

            let deletedRoomType = await RoomType.findOneAndDelete({name});

            if (deletedRoomType){
                return res.send({
                    status: "success",
                    msg: "RoomType deleted"
                });
            }
            else{
                return res.send({
                    status: "error",
                    msg: "RoomType not deleted successfully"
                });
            }


        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }


    return { allRoomTypes, newRoomType, editRoomType, selectRoomType, deleteRoomType }
}

module.exports = RoomTypeController
