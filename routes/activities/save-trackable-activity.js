const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const activitiesHistory = require('../../models/activitiesHistory');
const configActivitiesParameters = require('../../models/configActivitiesParameters');
const authMiddleware = require('../../middleware/authMiddleware');

// Save a Trackable Activity Route
router.put('/', authMiddleware, async(req, res) => {
    try {
        const userID = req._id;     
        const activityName = req.body.activityName;
        const subActivityTree = req.body.subActivityTree;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const thumbnail = req.body.thumbnail;
        const comments = req.body.comments;
        
        // Create an activityHistoryID for the entry
        const activityHistoryID = new mongoose.Types.ObjectId();

        // Check if all reqd fields are present
        if (!(activityName && startTime && endTime)) 
            return res.status(400).json({message: "Invalid request body"});

        // Check if the activity is defined and ensure that the activity is trackable
        const activity = await configActivitiesParameters.findOne({ activityName, isTrackable: true });
        if (!activity) 
            return res.status(404).json({message: "Activity not found"});

        // If the activity has subActivities, ensure that the subActivity is present in the request & is valid
        if (activity.hasSubActivities) {
            let x = activity.subActivities;
            let y = subActivityTree;
            while (!Array.isArray(x)){
                if (x === undefined || y === undefined)
                    return res.status(400).json({message: "Invalid request body. SubActivityTree is missing/invalid"});
                x = x[Object.keys(y)[0]];
                y = y[Object.keys(y)[0]];
            }
            if (y["_v"] === undefined || x.indexOf(y["_v"]) === -1)
                return res.status(400).json({message: "Invalid request body. Invalid subActivityTree"});
        }

        // Ensure that startTime and endTime are in a date-convertable format
        if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) 
            return res.status(400).json({message: "Invalid request body. Invalid date format"});

        // If thumbnail is present, read it as a base64 string and save it in the `assets/thumbnails` folder
        let thumbnailPath;
        if (thumbnail) {
            const base64ImageBuffer = Buffer.from(thumbnail.replace(/^data:image\/png;base64,/, ""), 'base64');
            thumbnailPath = `assets/map-thumbnails/${activityHistoryID}.png`;
            fs.writeFileSync(thumbnailPath, base64ImageBuffer);
        }


        // Read the parameters for the respective activity from `configActivitiesParameters`
        const activityParameters = activity.activityParameters;

        // Convert activityParameters to an array
        const activityParametersArray = Object.keys(activityParameters);

        // Ensure that the parameters are present in the request & are of the correct data type
        for (let parameter of activityParametersArray) {
            if (req.body[parameter] === undefined) 
                return res.status(400).json({message: `Invalid request body. Parameter "${parameter}" is missing`});

            if (typeof req.body[parameter] !== activityParameters[parameter].toLowerCase()) 
                return res.status(400).json({message: `Invalid request body. Parameter "${parameter}" is of invalid format. Expected type <${activityParameters[parameter].toLowerCase()}>, but got type <${typeof req.body[parameter]}>`});
        }

        
        // Compile all the activity parameter fields of the request into a single object
        const parameters = {};
        for (let parameter of activityParametersArray)
            parameters[parameter] = req.body[parameter];

        // Append the object to the trackableActivitiesHistory array in the activitiesHistory collection.
        // If the user doesn't have an entry in the activitiesHistory collection, create one
        const result = await activitiesHistory.updateOne(
            { userID },
            {
                $setOnInsert: { userID, isActive: true },
                $push: {
                    trackableActivitiesHistory: {
                        _id: activityHistoryID,
                        activityName,
                        subActivityTree,
                        startTime,
                        endTime,
                        parameters,
                        thumbnail: thumbnailPath,
                        comments,
                    }
                }
            },
            { upsert: true }
        );
        

        // Respond to the client w appropriate message
        if (result.modifiedCount > 0 || result.upsertedCount > 0)
            return res.status(200).json({message: "Activity saved successfully", activityHistoryID});
        else 
            return res.status(500).json({message: "Error saving activity"});

    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;