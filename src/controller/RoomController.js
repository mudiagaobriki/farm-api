const Room = require("../models/Room");

function RoomController(){
    const newRoom  = async (req, res) => {
        try {
            // Get user input
            const {name, number, type, bonusPrice, images = [], videos= [],} = req.body;

            // Validate user input
            if (!(number && type)) {
                return res.status(400).send("Room Number and Type are compulsory in creating a room");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            const oldRoom = await Room.findOne({number, isDeleted: false});

            if (oldRoom) {
                return res.status(409).send("Room Already Exists.");
            }

            // Create user in our database
            const room = await Room.create({
                name,
                number,
                type,
                bonusPrice,
                images,
                videos,
            });

            if (room){
                return res.status(201).json(room);
            }
            else{
                return res.status(400).send('Error in room creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const editRoom  = async (req, res) => {
        try {
            // Get user input
            const { number, payload } = req.body;

            if (!(number && payload)){
                return res.status(400).send("Name and Payload compulsory")
            }

            const filter = {
                number
            }

            let oldRoom = await Room.findOne({number})

            if (!oldRoom){
                return res.status(409).send('No room with that Id.')
            }


            let updatedRoom = await Room.findOneAndUpdate(filter, payload,{new: true})

            if (updatedRoom) {
                res.send(
                    {
                        status: "success",
                        msg: "Room updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "error",
                        msg: "Room update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allRooms = async (req, res) => {
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
                Room: q
            }

            if (q && q.length) {
                const rooms = await Room.paginate(query, options);

                if (rooms){
                    return res.send({
                        status: "success",
                        data: rooms
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching rooms with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const rooms = await Room.paginate({}, options);

                if (rooms){
                    return res.send({
                        status: "success",
                        data: rooms
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching rooms failed'
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

    const selectRoom  = async (req, res) => {
        try {
            // Get user input
            const { number } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const room = await Room.find({number});

            // console.log({accountNumber})

            if (!room){
                return res.send({
                    status: 'error',
                    data: 'No room with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: room
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newRoom, editRoom, allRooms, selectRoom, }
}

module.exports = RoomController
