const express = require('express');
const router = express.Router();
const fs = require('fs');

const activitiesHistory = require('../../models/activitiesHistory');
const authMiddleware = require('../../middleware/authMiddleware');

// Delete a Trackable Activity Route
router.delete('/', authMiddleware, async(req, res) => {
    try {
        const userID = req._id;
        const activityHistoryID = req.body.activityHistoryID;

        // Check if all reqd fields are present
        if (!activityHistoryID)
            return res.status(400).json({message: "Invalid request body. activityHistoryID is missing"});

        // Check if the activity exists
        const activity = await activitiesHistory.findOne({ userID, "trackableActivitiesHistory._id": activityHistoryID });
        if (!activity)
            return res.status(404).json({message: "Activity not found"});

        // Delete the thumbnail from the assets/map-thumbnails folder
        const thumbnailPath = activity.trackableActivitiesHistory.id(activityHistoryID).thumbnail;
        if (thumbnailPath)
            fs.unlinkSync(thumbnailPath);

        // Delete the element from the trackableActivitiesHistory array
        await activitiesHistory.updateOne(
            { userID },
            { $pull: { trackableActivitiesHistory: { _id: activityHistoryID } } }
        );
        
        // Respond to the client w/ appropriate message
        res.status(200).json({message: "Activity deleted successfully"});
        
    } catch (err) {
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;