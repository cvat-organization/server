const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const activitiesHistory = require('../../../models/activitiesHistory');

// Write new document into activitieshistory collection route
router.post('/', authMiddlewareAdmin, async(req, res) => {
    try {
        const userID = req.body.userID;
        const trackableActivitiesHistory = req.body.trackableActivitiesHistory;
        const untrackableActivitiesHistory = req.body.untrackableActivitiesHistory;
        const isActive = req.body.isActive;
        const createdAt = req.body.createdAt;
        const updatedAt = req.body.updatedAt;
        const createdBy = req.body.createdBy;
        const updatedBy = req.body.updatedBy;
        const __v = req.body.__v;

        // Check if all reqd fields are present
        if (!userID)
            return res.status(400).json({message: 'userID is required'});

        // Type checking
        if (trackableActivitiesHistory && !Array.isArray(trackableActivitiesHistory))
            return res.status(400).json({message: 'trackableActivitiesHistory must be an array'});
        if (untrackableActivitiesHistory && !Array.isArray(untrackableActivitiesHistory))
            return res.status(400).json({message: 'untrackableActivitiesHistory must be an array'});

        // Write the new activities' history
        const newActivitiesHistory = new activitiesHistory({
            userID,
            trackableActivitiesHistory,
            untrackableActivitiesHistory,
            isActive,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
            __v
        });

        // Save the new activities' history
        await newActivitiesHistory.save();

        // Respond to the client with appropriate msg
        res.status(201).json({message: 'Document written successfully'});

    } catch (err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;