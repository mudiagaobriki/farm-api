const Service = require("../models/Service");
const mongoose = require("mongoose");

function ServiceController(){
    const newService  = async (req, res) => {
        try {
            // Get user input
            const {name, price, status } = req.body;

            // Validate user input
            if (!(name && price)) {
                return res.status(400).send(" Name are required in creating a new Service.");
            }

            // check if service already exist
            const oldService = await Service.findOne({name, isDeleted: false});

            if (oldService) {
                return res.status(409).send("Service with the same name already exists. Please create another.");
            }

            // Create user in our database
            const service = await Service.create({
                name, price, status
            });

            if (service){
                return res.status(201).json(service);
            }
            else{
                return res.status(400).send('Error in Service creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allServices = async (req, res) => {
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
                Service: q
            }

            if (q && q.length) {
                const services = await Service.paginate(query, options);

                if (services){
                    return res.send({
                        status: "success",
                        data: services
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Services with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const services = await Service.paginate({}, options);

                if (services){
                    return res.send({
                        status: "success",
                        data: services
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Services failed'
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

    const selectService  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const service = await Service.find({_id: id});

            console.log({service})

            if (!service){
                return res.send({
                    status: 'error',
                    data: 'No Service with that id'
                })
            }

            // return the service found
            res.status(200).send({
                status: 'success',
                data: service
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editService  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            const service = await Service.findOneAndUpdate({_id:id}, payload);

            console.log({service})

            if (!service){
                return res.send({
                    status: 'error',
                    data: 'No Service with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: service
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newService, allServices, selectService, editService, }
}

module.exports = ServiceController
