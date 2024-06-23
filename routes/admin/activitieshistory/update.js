const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const activitiesHistory = require('../../../models/activitiesHistory');

// Update activitieshistory collection route
router.put('/', authMiddlewareAdmin, async(req, res) => {
    try {
        const _id = req.body._id;
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
        if (!_id)
            return res.status(400).json({message: '_id is required'});

        // Type checking
        if (trackableActivitiesHistory && !Array.isArray(trackableActivitiesHistory))
            return res.status(400).json({message: 'trackableActivitiesHistory must be an array'});
        if (untrackableActivitiesHistory && !Array.isArray(untrackableActivitiesHistory))
            return res.status(400).json({message: 'untrackableActivitiesHistory must be an array'});

        // Update the activities' history
        const updatedActivitiesHistory = await activitiesHistory.findOneAndUpdate(
            { _id },
            {
                userID,
                trackableActivitiesHistory,
                untrackableActivitiesHistory,
                isActive,
                createdAt,
                updatedAt,
                createdBy,
                updatedBy,
                __v
            },
            { new: true }
        );

        // Respond to the client with appropriate msg
        if (updatedActivitiesHistory)
            res.status(200).json({message: 'Activities history updated successfully'});
        else
            res.status(404).json({message: 'Document not found. _id is invalid'});

    } catch (err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;