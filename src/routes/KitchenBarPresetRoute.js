const express = require('express');
const KitchenBarPresetRouter = express.Router();
const KitchenBarPresetController = require("../controller/KitchenBarPresetController")();

KitchenBarPresetRouter.patch('/edit', KitchenBarPresetController.editPreset)

KitchenBarPresetRouter.post('/new', KitchenBarPresetController.newPreset)

KitchenBarPresetRouter.get('/select/:name', KitchenBarPresetController.selectPreset)

KitchenBarPresetRouter.get('/all/:page/:perPage', KitchenBarPresetController.allPresets)


module.exports = KitchenBarPresetRouter;
