const express = require('express');
const router = express.Router();

const activitiesHistory = require('../../models/activitiesHistory');
const authMiddleware = require('../../middleware/authMiddleware');

// Retrieve Activities' History Route
router.get('/', authMiddleware, async(req, res) => {
    try {
        const userID = req._id;
        const user = await activitiesHistory.findOne({ userID, isActive: true });

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
