const express = require('express');
const roomRouter = express.Router();
const RoomController = require("../controller/RoomController")();

roomRouter.get('/all/:page/:perPage',RoomController.allRooms)

roomRouter.post('/new', RoomController.newRoom)

roomRouter.patch('/edit', RoomController.editRoom)

roomRouter.get('/details/:number/', RoomController.selectRoom)


module.exports = roomRouter;
