const express = require('express');
const messageRouter = express.Router();
const SMSController = require("../controller/MessagingController")();

// whatsappRouter.get('/all/:page/:perPage',RoomController.allRooms)

messageRouter.post('/new', SMSController.newMessage)

// roomRouter.patch('/edit', RoomController.editRoom)
//
// roomRouter.get('/details/:number/', RoomController.selectRoom)


module.exports = messageRouter;
