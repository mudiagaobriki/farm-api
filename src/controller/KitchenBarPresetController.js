const Preset = require("../models/KitchenBarPreset");

function KitchenBarPresetController(){
    const allPresets = async (req, res) => {
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
                Preset: q
            }

            if (q && q.length) {
                const types = await Preset.paginate(query, options);

                if (types){
                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching kitchen presets with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const types = await Preset.paginate({}, options);

                if (types){
                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching kitchen presets failed'
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

    const newPreset  = async (req, res) => {
        try {
            // Get user input
            const { category, name, price, description='',
               } = req.body;

            // Validate user input
            if (!(name && price)) {
                return res.status(400).send("Name and price are compulsory.");
            }

            // check if preset name already exists
            const oldPresets = await Preset.findOne({name, isDeleted: false});

            if (oldPresets) {
                return res.status(409).send("Kitchen and Bar Preset with the same details exists.");
            }

            // Create user in our database
            const preset = await Preset.create({
                category, name, price, description,
            });

            if (preset){
                return res.status(201).json(preset);
            }
            else{
                return res.status(400).send('Error in Kitchen and Bar Preset creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }
    const editPreset  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            const preset = await Preset.findOneAndUpdate({_id: id}, payload,{new: true});

            // console.log({wallet})

            if (!preset){
                return res.send({
                    status: 'error',
                    data: 'No Kitchen and Bar Preset with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: preset
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectPreset  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const preset = await Preset.findOne({_id:id});

            // console.log({wallet})

            if (!preset){
                return res.send({
                    status: 'error',
                    data: 'No Kitchen and Bar Preset with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: preset
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deletePreset = async (req, res) => {
        try {
            const {id} = req.body;
            const preset = await Preset.find({_id:id});
            if (!preset) {
                return res.status(404).send({
                    status: "error",
                    msg: "Kitchen and Bar Preset not found"
                });
            }

            let deletedPreset = await Preset.findOneAndDelete({_id: id});

            if (deletedPreset){
                return res.send({
                    status: "success",
                    msg: "Preset deleted"
                });
            }
            else{
                return res.send({
                    status: "error",
                    msg: "Preset not deleted successfully"
                });
            }


        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }


    return { allPresets, newPreset, editPreset, selectPreset, deletePreset }
}

module.exports = KitchenBarPresetController
