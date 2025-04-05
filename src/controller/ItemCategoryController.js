const ItemCategory = require("../models/ItemCategory");

function ItemCategoryController(){
    const newItemCategory  = async (req, res) => {
        try {
            // Get user input
            const { name, alias, } = req.body;

            // Validate user input
            if (!(name)) {
                return res.status(400).send("Category name is required.");
            }

            // check if category already exist
            const oldCategory = await ItemCategory.findOne({name});

            // if (oldLoan && email !== "admin" && oldLoan?.status === "completed") {
            //     return res.status(409).send("Clear your previous loan before applying for another.");
            // }

            // Create user in our database
            const category = await ItemCategory.create({
                name,
                alias,
            });

            if (category){
                return res.status(201).json(category);
            }
            else{
                return res.status(400).send('Error in category creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

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
                Categories: q
            }

            if (q && q.length) {
                const categories = await ItemCategory.paginate(query, options);

                if (categories){
                    return res.send({
                        status: "success",
                        data: categories
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching categories with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const categories = await ItemCategory.paginate({}, options);

                if (categories){
                    return res.send({
                        status: "success",
                        data: categories
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching categories failed'
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

    const selectCategory  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            const category = await ItemCategory.find({_id:id});

            console.log({category})

            if (!category){
                return res.send({
                    status: 'error',
                    data: 'No category with that id'
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

    const editCategory  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            const category = await ItemCategory.findOneAndUpdate({_id: id}, payload);

            console.log({category})

            if (!category){
                return res.send({
                    status: 'error',
                    data: 'No category with that id'
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


    return { newItemCategory, allCategories, selectCategory, editCategory, }
}

module.exports = ItemCategoryController
