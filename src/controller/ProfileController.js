import Profile from '../models/Profile.js';

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

    if (!firstName) {
      return res.status(400).send('First name is required.');
    }

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
        return res.status(201).json({
          status: 'success',
          msg: 'Profile created successfully.',
          data: profile,
        });
      } else {
        return res.status(400).json('Error in creating profile.');
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
        return res.status(404).send('Profile not found');
      }

      res.status(200).json({
        status: 'success',
        message: 'Profile edited successfully',
        data: profile,
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err?.toString(),
      });
    }
  };

  const allProfiles = async (req, res) => {
    try {
      const page = req.params?.page || 1;
      const perPage = req.params?.perPage || 10;
      const q = req.query?.q;

      const options = {
        page,
        limit: perPage,
        sort: { createdAt: -1 },
      };

      let query = {};

      if (q && q.length) {
        query = {
          Profile: q,
        };
      }

      const profiles = await Profile.paginate(query, options);

      if (profiles) {
        return res.send({
          status: 'success',
          data: profiles,
        });
      } else {
        return res.send({
          status: 'error',
          message: 'Fetching profiles failed',
        });
      }
    } catch (e) {
      return res.send({
        status: 'error',
        message: e.toString(),
      });
    }
  };

  const selectProfile = async (req, res) => {
    try {
      const { id } = req.params;

      const profile = await Profile.find({ _id: id });

      if (!profile || profile.length === 0) {
        return res.send({
          status: 'error',
          data: 'No profile with that id',
        });
      }

      res.status(200).send({
        status: 'success',
        data: profile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: 'error',
        message: 'An error occurred while retrieving the profile.',
      });
    }
  };

  return {
    newProfile,
    selectProfile,
    editProfile,
    allProfiles,
  };
}

export default ProfileController;
