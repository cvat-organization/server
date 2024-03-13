const express = require('express');
const router = express.Router();

const users = require('../models/users');
const activitiesParameters = require('../models/activitiesParameters');
const authMiddleware = require('../middleware/authMiddleware');

// Save a Trackable Activity Route
router.put('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;     
        const activityName = req.body.activityName;
        const subActivity = req.body.subActivity;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const comments = req.body.comments;
        
        // Check if all reqd fields are present
        if (!(activityName && startTime && endTime)) 
            return res.status(400).json({message: "Invalid request body"});

        // Check if the activity is defined and ensure that the activity is trackable
        const activity = await activitiesParameters.findOne({ activityName, isTrackable: true });
        if (!activity) 
            return res.status(404).json({message: "Activity not found"});

        // If the activity has subActivities, ensure that the subActivity is present in the request & is valid
        if (activity.subActivities.length > 0 && !(subActivity && activity.subActivities.includes(subActivity))) 
            return res.status(400).json({message: "Invalid request body. Sub-activity is missing or invalid"});

        // Ensure that startTime and endTime are in a date-convertable format
        if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) 
            return res.status(400).json({message: "Invalid request body. Invalid date format"});


        // Read the parameters for the respective activity from `activitesParameters`
        const activityParameters = activity.activityParameters;

        // Convert activityParameters to an array
        const activityParametersArray = Object.keys(activityParameters);

        // Ensure that the parameters are present in the request & are of the correct data type
        for (let parameter of activityParametersArray) {
            if (!req.body[parameter]) 
                return res.status(400).json({message: `Invalid request body. Parameter ${parameter} is missing`});

            if (typeof req.body[parameter] !== activityParameters[parameter].toLowerCase()) 
                return res.status(400).json({message: `Invalid request body. Parameter ${parameter} is of invalid format`});
        }

        
        // Compile all the activity parameter fields of the request into a single object
        const parameters = {};
        for (let parameter of activityParametersArray)
            parameters[parameter] = req.body[parameter];

        // Store all the fields in the trackable activites' history array
        const result = await users.findOneAndUpdate(
            { _id },
            { $push: { trackableActivitiesHistory: { activityName, subActivity, startTime, endTime, parameters, comments } } },
            { new: true }
        );

        // Respond to the client w appropriate message
        if (result) {
            const activityHistoryID = result.trackableActivitiesHistory[result.trackableActivitiesHistory.length - 1]._id;
            return res.status(200).json({message: "Activity saved successfully", activityHistoryID});
        } else 
            return res.status(500).json({message: "Error saving activity"});

    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;