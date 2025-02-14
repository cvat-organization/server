const express = require('express');
const router = express.Router();
const fs = require('fs');

const users = require('../../models/users');
const authMiddleware = require('../../middleware/authMiddleware');

// Retrieve User Profile Route
router.get('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;
        const user = await users.findOne({ _id });

        // Read the profilePicture from the file system, add it's headers and convert it to a base64 string
        if (user.profilePicture) {
            const base64Image = fs.readFileSync(user.profilePicture, {encoding: 'base64'});
            user.profilePicture = `data:image/png;base64,${base64Image}`;
        }

        // Respond with user profile data
        res.status(200).json({
            message: 'User profile data successfully retrieved',
            fullName: user.fullName,
            displayName: user.displayName,
            trackerID: user.trackerID,
            email: user.email,
            phoneNo: user.phoneNo,
            followers: user.followers,
            incomingFollowRequests: user.incomingFollowRequests,
            following: user.following,
            bio: user.bio,
            website: user.website,
            location: user.location,
            gender: user.gender,
            birthYear: user.birthYear,
            metric: user.metric,
            height: user.height,
            weight: user.weight,
            stepLengthCM: user.stepLengthCM,
            subscriptionStatus: user.subscriptionStatus,
            profilePicture: user.profilePicture,
        });
    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;