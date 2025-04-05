const FacilityRoute = require('express').Router()
const FacilityController = require('../controller/FacilityController')()

FacilityRoute.get('/', (req, res) => {
    res.send('Facility route is working!');
});
FacilityRoute.post('/new', FacilityController.newFacility)

FacilityRoute.patch('/edit', FacilityController.editFacility)

FacilityRoute.get('/all/:page/:perPage/', FacilityController.allAmenities)

FacilityRoute.get('/details/:id/', FacilityController.selectFacility)


module.exports = FacilityRoute;