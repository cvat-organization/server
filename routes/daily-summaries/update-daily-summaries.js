const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const dailySummaries = require('../../models/dailySummariesHistory');

// Update daily summaries route
router.put('/', authMiddleware, async(req, res) => {
    try{
        const userID = req._id;
        const summaries = req.body.summaries;

        // Check if all reqd fields are present
        if (!summaries)
            return res.status(400).json({message: 'Invalid request body'});

        // Validate the summaries array
        for (let summary of summaries) {
            let date = summary.date;
            let steps = summary.steps;
            let calories = summary.calories;
            let distance = summary.distance;
            let stepsGoal = summary.stepsGoal;

            if (!(date && steps && calories && distance && stepsGoal))
                return res.status(400).json({message: 'Invalid request body. Fields missing in object of summaries array'});
            if (typeof date !== 'string' || typeof steps !== 'number' || typeof calories !== 'number' || typeof distance !== 'number' || typeof stepsGoal !== 'number')
                return res.status(400).json({message: 'Invalid data type(s) in request body'});
            
            summary.goalAchieved = steps >= stepsGoal;
            summary.date = new Date(date);
        }


        // Sort the summaries array in increasing order of date
        summaries.sort((a, b) => a.date - b.date);

        let dailySummary = await dailySummaries.findOne({userID});

        // Clean the summaries array
        let cleanedSummaries = [];
        let startingPoint = 0;
        if (dailySummary){
            // Skip the dates that exist in the dailySummary
            const latestExistingDate = dailySummary.daily[dailySummary.daily.length - 1].date;
            for (let i = 0; i < summaries.length; i++)
                if (summaries[i].date > latestExistingDate && summaries[i].date.toDateString() !== latestExistingDate.toDateString()){
                    startingPoint = i;
                    break;
                }
            startingPoint = startingPoint === 0 ? summaries.length : startingPoint;
        }
        // Remove duplicate dates
        let i = startingPoint;
        for (i; i < summaries.length - 1; i++)
            if (summaries[i].date.toDateString() !== summaries[i + 1].date.toDateString())
                cleanedSummaries.push(summaries[i]);
        if (i < summaries.length) cleanedSummaries.push(summaries[i]);

        // If cleanedSummaries is empty, respond with an error
        if (cleanedSummaries.length === 0)
            return res.status(400).json({message: 'No new data to update'});



        // If the user has no dailySummary, create one
        if(!dailySummary)
            dailySummary = new dailySummaries({
                userID,
                daily: cleanedSummaries,
            });
        else
            dailySummary.daily.push(...cleanedSummaries);

        await dailySummary.save();

        // Respond to the client w/ appropriate message
        res.status(200).json({message: 'Updated successfully!'});

    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;