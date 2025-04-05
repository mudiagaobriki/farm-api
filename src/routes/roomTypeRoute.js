const express = require('express');
const RoomTypeRouter = express.Router();
const RoomTypeController = require("../controller/RoomTypeController")();

RoomTypeRouter.route('/new')
    .post(RoomTypeController.newRoomType)

RoomTypeRouter.route('/all/:page/:perPage/')
    .get(RoomTypeController.allRoomTypes)

RoomTypeRouter.route('/details/:name/')
    .get(RoomTypeController.selectRoomType)

RoomTypeRouter.route('/edit')
    .patch(RoomTypeController.editRoomType)

RoomTypeRouter.route('/delete')
    .post(RoomTypeController.deleteRoomType)

module.exports = RoomTypeRouter;
