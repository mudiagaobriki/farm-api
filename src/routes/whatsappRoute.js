const express = require('express');
const whatsappRouter = express.Router();
const WhatsappController = require("../utils/twilio/Whatsapp")();

// whatsappRouter.get('/all/:page/:perPage',RoomController.allRooms)

whatsappRouter.post('/new-message', WhatsappController.sendWhatsAppMessages)

// roomRouter.patch('/edit', RoomController.editRoom)
//
// roomRouter.get('/details/:number/', RoomController.selectRoom)


module.exports = whatsappRouter;
