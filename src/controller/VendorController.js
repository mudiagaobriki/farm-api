const Vendor = require('../models/Vendor')

function VendorController(){
    const newVendor = async (req,res) => {
        const { category,vendorNo,officialEmail,officialNumber,
        status,profile,services,verified } = req.body;

        // validate the amenities
        if (!vendorNo){
            return res.status(400).send("Vendor Number is required.")
        }

        // // check if amenity with the same name already exists
        // const oldAmenity = await Amenity.findOne({name})
        // console.log({oldAmenity})
        //
        // if (oldAmenity){
        //     return res.status(409).send('Amenity with the same name already exists')
        // }

        const payload = {
            category,vendorNo,officialEmail,officialNumber,
            status,profile,services,verified
        }

        try {
            const vendor = await Vendor.create(payload)

            if (vendor){
                return res.status(201).json('Vendor created successfully.')
            }
            else{
                return res.status(400).json('Error in creating vendor.')
            }
        }
        catch (err){
            return res.status(500).json({
                message: err?.toString(),
                statusCode: 500
            })
        }
    }

    const editVendor = async (req,res) => {
        try{
            const {id, payload} = req.body

            const vendor = await Vendor.findOneAndUpdate({_id:id}, payload, {new: true})

            if (!vendor){
                res.status(404).send('Vendor not found.')
            }

            res.status(200).json({
                status: "success",
                message: 'Vendor edited successfully',
                data: vendor
            })

        }
        catch (err){
            return res.status(500).json({
                status: 'error',
                message: err?.toString()
            })
        }
    }

    const allVendors = async (req, res) => {
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
                Vendor: q
            }

            if (q && q.length) {
                const Vendors = await Vendor.paginate(query, options);

                if (Vendors){
                    return res.send({
                        status: "success",
                        data: Vendors
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Vendors with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const Vendors = await Vendor.paginate({}, options);

                if (Vendors){
                    return res.send({
                        status: "success",
                        data: Vendors
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Vendors failed'
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

    const selectVendor  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const vendor = await Vendor.find({_id: id});

            // console.log({accountNumber})

            if (!vendor){
                return res.send({
                    status: 'error',
                    data: 'No vendor with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: vendor
            });
        } catch (err) {
            console.log(err);
        }
    }

    return {
        newVendor,
        selectVendor,
        editVendor,
        allVendors,
    }

}

module.exports = VendorController