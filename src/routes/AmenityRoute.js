const AmenityRoute = require('express').Router()
const AmenityController = require('../controller/AmenityController')()

AmenityRoute.get('/', (req, res) => {
    res.send('Amenity route is working!');
});
AmenityRoute.post('/new', AmenityController.newAmenity)

AmenityRoute.post('/edit', AmenityController.editAmenity)

AmenityRoute.get('/all/:page/:perPage/', AmenityController.allAmenities)

AmenityRoute.get('/details/:id/', AmenityController.selectAmenity)


module.exports = AmenityRoute;