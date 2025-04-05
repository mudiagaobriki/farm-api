const Category = require("../models/KitchenBarCategory");

function KitchenBarCategoryController(){
    const allCategories = async (req, res) => {
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
                Category: q
            }

            if (q && q.length) {
                const types = await Category.paginate(query, options);

                if (types){
                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching room types with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const types = await Category.paginate({}, options);

                if (types){
                    return res.send({
                        status: "success",
                        data: types
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching room types failed'
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

    const newCategory  = async (req, res) => {
        try {
            // Get user input
            const { type, name,
               } = req.body;

            // Validate user input
            if (!(name && type)) {
                return res.status(400).send("Type and name are compulsory.");
            }

            // check if category name already exists
            const oldCategories = await Category.findOne({name, isDeleted: false});

            if (oldCategories) {
                return res.status(409).send("Kitchen and Bar Category with the same details exists.");
            }

            // Create user in our database
            const category = await Category.create({
                type, name,
            });

            if (category){
                return res.status(201).json(category);
            }
            else{
                return res.status(400).send('Error in Kitchen and Bar Category creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }
    const editCategory  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            const category = await Category.findOneAndUpdate({_id: id}, payload,{new: true});

            // console.log({wallet})

            if (!category){
                return res.send({
                    status: 'error',
                    data: 'No Kitchen and Bar Category with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: category
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectCategory  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const category = await Category.findOne({_id:id});

            // console.log({wallet})

            if (!category){
                return res.send({
                    status: 'error',
                    data: 'No Kitchen and Bar Category with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: category
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteCategory = async (req, res) => {
        try {
            const {id} = req.body;
            const category = await Category.find({_id:id});
            if (!category) {
                return res.status(404).send({
                    status: "error",
                    msg: "Kitchen and Bar Category not found"
                });
            }

            let deletedCategory = await Category.findOneAndDelete({_id: id});

            if (deletedCategory){
                return res.send({
                    status: "success",
                    msg: "Category deleted"
                });
            }
            else{
                return res.send({
                    status: "error",
                    msg: "Category not deleted successfully"
                });
            }


        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }


    return { allCategories, newCategory, editCategory, selectCategory, deleteCategory }
}

module.exports = KitchenBarCategoryController
