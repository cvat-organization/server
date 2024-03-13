const express = require('express');
const router = express.Router();

const users = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');

// Retrieve Activities' History Route
router.get('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;
        const user = await users.findOne({ _id });

        // Respond with trackable & untrackable activites' history
        res.status(200).json({
            message: "Activites' (trackable & untrackable) history retrieved successfully",
            trackableActivitesHistory: user.trackableActivitiesHistory,
            untrackableActivitiesHistory: user.untrackableActivitesHistory,
        });

    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;
