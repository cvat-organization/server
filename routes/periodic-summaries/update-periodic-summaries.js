const express = require('express');
const router = express.Router();

const periodicSummaries = require('../../models/periodicSummaries');

// Update periodic summaries route
router.get('/', async(req, res) => {
    try{
        const userID = req.body.userID;
        const date = req.body.date;
        const steps = req.body.steps;
        const calories = req.body.calories;
        const distance = req.body.distance;
        const stepsGoal = req.body.stepsGoal;

        const goalAchieved = steps >= stepsGoal;

        // Check if all reqd fields are present
        if (!(userID && date && steps && calories && distance && stepsGoal))
            return res.status(400).json({message: 'Invalid request body'});

        // Fetch the periodic summaries for the user
        const summaries = await periodicSummaries.findOne({userID});

        // Respond to client w/ success msg
        res.status(200).json({
            message: 'Periodic summaries fetched successfully!',
            daily: summaries.daily,
            weekly: summaries.weekly,
            monthly: summaries.monthly,
        });

    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});