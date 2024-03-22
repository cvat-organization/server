const express = require('express');
const router = express.Router();
const fs = require('fs');

const users = require('../../models/users');
const authMiddleware = require('../../middleware/authMiddleware');

// Update User Profile Route
router.put('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;
        const fullName = req.body.fullName;
        const displayName = req.body.displayName;

        // Check if reqd fields are present
        if (!(fullName && displayName))
            return res.status(400).json({message: 'Invalid request body'});

        // Accept profilePicture as a base64 String and save it in the `assets/profile-pictures` folder
        if (req.body.profilePicture) {
            const base64Image = (req.body.profilePicture).replace(/^data:image\/png;base64,/, "");
            const base64ImageBuffer = Buffer.from(base64Image, 'base64');
            const profilePicturePath = `assets/profile-pictures/${_id}.png`;

            // Save the image
            fs.writeFileSync(profilePicturePath, base64ImageBuffer);
            req.body.profilePicture = profilePicturePath;
        }

        // Update user profile
        const udpateResult = await users.updateOne(
            { _id },
            { $set: {
                    fullName,
                    displayName,
                    phoneNo: req.body.phoneNo,
                    bio: req.body.bio,
                    website: req.body.website,
                    location: req.body.location,
                    gender: req.body.gender,
                    birthYear: req.body.birthYear,
                    metric: req.body.metric,
                    height: req.body.height,
                    weight: req.body.weight,
                    stepLengthCM: req.body.stepLengthCM,
                    profilePicture: req.body.profilePicture,
            }}
        );

        // Check if update was successful
        if (udpateResult.modifiedCount > 0)
            return res.status(200).json({message: 'User profile updated successfully'});

        res.status(401).json({message: 'Unauthorized. Session not found'});

    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;