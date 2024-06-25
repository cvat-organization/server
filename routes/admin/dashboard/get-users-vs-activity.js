const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const activitiesHistory = require('../../../models/activitiesHistory');

// Get users vs location data route
/*
    Return format:
    [
        {
            date: '2021-08-01',
            activity: 'Running',
            users: 5
        },
        {
            date: '2021-08-01',
            activity: 'Hiking',
            users: 10
        },
        ...
    ]
*/
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try {
        const activitiesHistoryData = await activitiesHistory.find();

        // Convert the data to an array of objects with date, location and count
        const dateActivityVSCount = {};
        activitiesHistoryData.forEach((activity) => {
            for (const trackableActivity of activity.trackableActivitiesHistory) {
                const formattedDate = trackableActivity.startTime.toISOString().split('T')[0];
                const activityName = trackableActivity.activityName;
                const key = `${formattedDate}_${activityName}`;
                if (!dateActivityVSCount[key]) {
                    dateActivityVSCount[key] = 1;
                } else {
                    dateActivityVSCount[key]++;
                }
            }
            for (const untrackableActivity of activity.untrackableActivitiesHistory) {
                const formattedDate = untrackableActivity.startTime.toISOString().split('T')[0];
                const activityName = untrackableActivity.activityName;
                const key = `${formattedDate}_${activityName}`;
                if (!dateActivityVSCount[key]) {
                    dateActivityVSCount[key] = 1;
                } else {
                    dateActivityVSCount[key]++;
                }
            }
        });

        // Convert the object to an array of objects
        const dateActivityVSCountArray = [];
        Object.keys(dateActivityVSCount).forEach((key) => {
            const [formattedDate, activity] = key.split('_');
            dateActivityVSCountArray.push({
                date: formattedDate,
                activity,
                users: dateActivityVSCount[key],
            });
        });

        // Respond to the client with the data
        res.status(200).json({
            message: 'Users vs activity data fetched successfully',
            data: dateActivityVSCountArray,
        });

    } catch (err) {
        // Error handling
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;