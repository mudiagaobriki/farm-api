const express = require('express');
const ProfileRouter = express.Router();
const ProfileController = require("../controller/ProfileController")();

ProfileRouter.post('/new',ProfileController.newProfile)

ProfileRouter.get('/all/:page/:perPage', ProfileController.allProfiles)

ProfileRouter.get('/:id', ProfileController.selectProfile)

ProfileRouter.post('/edit', ProfileController.editProfile)

module.exports = ProfileRouter;
