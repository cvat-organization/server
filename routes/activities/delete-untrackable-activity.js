const express = require('express');
const router = express.Router();

const users = require('../../models/users');
const authMiddleware = require('../../middleware/authMiddleware');

// Delete an unrackable Activity Route
router.delete('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;
        const activityHistoryID = req.body.activityHistoryID;

        // Check if all reqd fields are present
        if (!activityHistoryID)
            return res.status(400).json({message: "Invalid request body. activityHistoryID is missing"});

        // Remove the activity from the user's untrackableActivitiesHistory array
        await users.updateOne(
            { _id },
            { $pull: { untrackableActivitiesHistory: { _id: activityHistoryID } } },
        );

        // Respond to the client w/ appropriate message
        res.status(200).json({message: "Activity deleted successfully"});
        
    } catch (err) {
        // Error handling
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;