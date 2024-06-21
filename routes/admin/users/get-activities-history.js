const express = require('express');
const router = express.Router();
const fs = require('fs');

const activitiesHistory = require('../../models/activitiesHistory');
const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');

// Retrieve Activities' History Route
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try {
        const userID = req.body.userID;

        // Check if all reqd fields are present
        if (!userID)
            return res.status(400).json({message: "Please provide all required fields"});

        // If the user has no activities' history, respond with an appropriate message
        const user = await activitiesHistory.findOne({ userID, isActive: true });
        if (!user)
            return res.status(404).json({message: "No activities' history found"});
        
        // For all trackable activities, read the thumbnail from the file system and convert it to a base64 string
        for (let activity of user.trackableActivitiesHistory) {
            if (activity.thumbnail) {
                try{
                    const base64Image = fs.readFileSync(activity.thumbnail, {encoding: 'base64'});
                    activity.thumbnail = `data:image/png;base64,${base64Image}`;
                } catch(err) {
                    activity.thumbnail = null;
                }
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
