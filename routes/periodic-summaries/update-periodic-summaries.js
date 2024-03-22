const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const periodicSummaries = require('../../models/periodicSummariesHistory');

// Update periodic summaries route
router.put('/', authMiddleware, async(req, res) => {
    try{
        const userID = req._id;
        const date = new Date(req.body.date);
        const steps = req.body.steps;
        const calories = req.body.calories;
        const distance = req.body.distance;
        const stepsGoal = req.body.stepsGoal;

        // Check if all reqd fields are present
        if (!(date && steps && calories && distance && stepsGoal))
            return res.status(400).json({message: 'Invalid request body'});

        // Calculate goalAchieved status
        const goalAchieved = steps >= stepsGoal;

        // Update the daily summaries for the user
        const dailySummary = {
            date,
            steps,
            calories,
            distance,
        };
        const dailySummaryExists = await periodicSummaries.findOne({userID, 'daily.date': date});
        if (dailySummaryExists)
            await periodicSummaries.updateOne({userID, 'daily.date': date}, {$set: {'daily.$': dailySummary}});
        else
            await periodicSummaries.updateOne({userID}, {$push: {daily: dailySummary}});


        // Find the date of the first day of the given date's week
        const weekStart = date.getDate() - date.getDay();
        const weekStartDate = new Date(date);
        weekStartDate.setDate(weekStart);

        // Update the weekly summaries for the user: If the week's summary exists, increment steps, dist, cal; else, create a new one
        const weeklySummary = {
            date: weekStartDate,
            steps,
            calories,
            distance,
        };
        const weeklySummaryExists = await periodicSummaries.findOne({userID, 'weekly.date': weekStartDate});
        if (weeklySummaryExists)
            await periodicSummaries.updateOne(
                {userID, 'weekly.date': weekStartDate},
                {
                    $inc: {
                        'weekly.$.steps': steps,
                        'weekly.$.calories': calories,
                        'weekly.$.distance': distance,
                    },
                }
            );
        else
            await periodicSummaries.updateOne({userID}, {$push: {weekly: weeklySummary}});

        
        // Find the date of the first day of the given date's month
        const monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);

        // Update the monthly summaries for the user: If the month's summary exists, increment steps, dist, cal; else, create a new one
        const monthlySummary = {
            date: monthStartDate,
            steps,
            calories,
            distance,
        };
        const monthlySummaryExists = await periodicSummaries.findOne({userID, 'monthly.date': monthStartDate});
        if (monthlySummaryExists)
            await periodicSummaries.updateOne(
                {userID, 'monthly.date': monthStartDate},
                {
                    $inc: {
                        'monthly.$.steps': steps,
                        'monthly.$.calories': calories,
                        'monthly.$.distance': distance,
                    },
                }
            );
        else
            await periodicSummaries.updateOne({userID}, {$push: {monthly: monthlySummary}});

        
        // Update the steps goal and goal achieved status
        await periodicSummaries.updateOne({userID}, {$set: {stepsGoal, goalAchieved}});

        // Respond to client w/ success msg
        res.status(200).json({message: 'Periodic summaries updated successfully!'});

    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;