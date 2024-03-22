const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const periodicSummariesHistory = require('../../models/periodicSummariesHistory');

// Get daily, weekly, monthly summaries route
router.get('/', authMiddleware, async(req, res) => {
    try{
        const userID = req._id;

        // Fetch the periodic summaries for the user
        const summaries = await periodicSummariesHistory.findOne({userID});

        // Convert the daily summary to 4 arrays of dates, steps, calories, distance
        const dailyDates = [];
        const dailySteps = [];
        const dailyCalories = [];
        const dailyDistance = [];
        const dailyStepsGoals = [];
        const dailyGoalAchieved = [];
        summaries.daily.forEach((summary) => {
            dailyDates.push(summary.date);
            dailySteps.push(summary.steps);
            dailyCalories.push(summary.calories);
            dailyDistance.push(summary.distance);
            dailyStepsGoals.push(summary.stepsGoal);
            dailyGoalAchieved.push(summary.goalAchieved);
        });

        // Convert the weekly summary to 4 arrays of dates, steps, calories, distance
        const weeklyDates = [];
        const weeklySteps = [];
        const weeklyCalories = [];
        const weeklyDistance = [];
        summaries.weekly.forEach((summary) => {
            weeklyDates.push(summary.date);
            weeklySteps.push(summary.steps);
            weeklyCalories.push(summary.calories);
            weeklyDistance.push(summary.distance);
        });

        // Convert the monthly summary to 4 arrays of dates, steps, calories, distance
        const monthlyDates = [];
        const monthlySteps = [];
        const monthlyCalories = [];
        const monthlyDistance = [];
        summaries.monthly.forEach((summary) => {
            monthlyDates.push(summary.date);
            monthlySteps.push(summary.steps);
            monthlyCalories.push(summary.calories);
            monthlyDistance.push(summary.distance);
        });


        // Respond to the client with the summaries
        res.status(200).json({
            message: 'Periodic summaries fetched successfully',
            daily: {
                dates: dailyDates,
                steps: dailySteps,
                calories: dailyCalories,
                distances: dailyDistance,
                stepsGoals: dailyStepsGoals,
                goalAchieved: dailyGoalAchieved,
            },
            weekly: {
                dates: weeklyDates,
                steps: weeklySteps,
                calories: weeklyCalories,
                distances: weeklyDistance,
            },
            monthly: {
                dates: monthlyDates,
                steps: monthlySteps,
                calories: monthlyCalories,
                distances: monthlyDistance,
            },
        });

    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;