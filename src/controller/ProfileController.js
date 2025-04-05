const Profile = require("../models/Profile");

function ProfileController() {
  const newProfile = async (req, res) => {
    const {
      firstName,
      lastName,
      otherNames,
      country,
      email,
      countryCode,
      gender,
      dateOfBirth,
      phone,
      altPhone,
      city,
      address,
      zip,
      imageUrl,
      otherImages,
      type,
      maritalStatus,
      marriageAnniversary,
      nextOfKin,
      nextOfKinContact,
    } = req.body;

    // validate the amenities
    if (!firstName) {
      return res.status(400).send("First name is required.");
    }

    // // check if amenity with the same name already exists
    // const oldAmenity = await Amenity.findOne({name})
    // console.log({oldAmenity})
    //
    // if (oldAmenity){
    //     return res.status(409).send('Amenity with the same name already exists')
    // }

    const payload = {
      firstName,
      lastName,
      otherNames,
      country,
      countryCode,
      gender,
      dateOfBirth,
      phone,
      altPhone,
      city,
      address,
      zip,
      imageUrl,
      otherImages,
      type,
      maritalStatus,
      marriageAnniversary,
      email,
      nextOfKin,
      nextOfKinContact,
    };

    try {
      const profile = await Profile.create(payload);

      if (profile) {
        return res
          .status(201)
          .json({
            status: "success",
            msg: "Profile created successfully.",
            data: profile,
          });
      } else {
        return res.status(400).json("Error in creating profile.");
      }
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        message: err?.toString(),
        statusCode: 500,
      });
    }
  };

  const editProfile = async (req, res) => {
    try {
      const { id, payload } = req.body;

      const profile = await Profile.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });

      if (!profile) {
        return res.status(404).send("Profile not found");
      }

      res.status(200).json({
        status: "success",
        message: "Profile edited successfully",
        data: profile,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err?.toString(),
      });
    }
  };

  const allProfiles = async (req, res) => {
    try {
      const page = req.params?.page;
      const perPage = req.params?.perPage;
      const q = req.query?.q;

      const options = {
        page: page,
        limit: perPage,
        sort: { createdAt: -1 },
      };

      const query = {
        Profile: q,
      };

      if (q && q.length) {
        const Profiles = await Profile.paginate(query, options);

        if (Profiles) {
          return res.send({
            status: "success",
            data: Profiles,
          });
        } else {
          return res.send({
            status: "error",
            message: "Fetching Profiles with query failed",
          });
        }
      } else {
        // Pagination of all posts
        const Profiles = await Profile.paginate({}, options);

        if (Profiles) {
          return res.send({
            status: "success",
            data: Profiles,
          });
        } else {
          res.send({
            status: "error",
            message: "Fetching Profiles failed",
          });
        }
      }
    } catch (e) {
      return res.send({
        status: "error",
        message: e.toString(),
      });
    }
  };

  const selectProfile = async (req, res) => {
    try {
      // Get user input
      const { id } = req.params;

      // check if user already exist
      // Validate if user exist in our database
      const profile = await Profile.find({ _id: id });

      // console.log({accountNumber})

      if (!profile) {
        return res.send({
          status: "error",
          data: "No profile with that id",
        });
      }

      // return the subscription found
      res.status(200).send({
        status: "success",
        data: profile,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    newProfile,
    selectProfile,
    editProfile,
    allProfiles,
  };
}

module.exports = ProfileController;
