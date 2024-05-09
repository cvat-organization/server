const express = require('express');
const router = express.Router();
const fs = require('fs');

const activitiesHistory = require('../../models/activitiesHistory');
const authMiddleware = require('../../middleware/authMiddleware');

// Retrieve Activities' History Route
router.get('/', authMiddleware, async(req, res) => {
    try {
        const userID = req._id;
        const user = await activitiesHistory.findOne({ userID, isActive: true });

        // If the user has no activities' history, respond with an appropriate message
        if (!user)
            return res.status(404).json({message: "No activities' history found"});
        
        // For all trackable activities, read the thumbnail from the file system and convert it to a base64 string
        for (let activity of user.trackableActivitiesHistory) {
            if (activity.thumbnail) {
                const base64Image = fs.readFileSync(activity.thumbnail, {encoding: 'base64'});
                activity.thumbnail = `data:image/png;base64,${base64Image}`;
            }
        }

        // Respond with trackable & untrackable activities' history
        res.status(200).json({
            message: "Activities' (trackable & untrackable) history retrieved successfully",
            trackableActivitiesHistory: user.trackableActivitiesHistory,
            untrackableActivitiesHistory: user.untrackableActivitiesHistory,
        });

    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;
