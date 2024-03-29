const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const dailySummariesHistory = require('../../models/dailySummariesHistory');
const { getWeekStartDate, getMonthStartDate } = require('../../utils/dateUtils');

// Get daily, weekly, monthly summaries route
router.get('/', authMiddleware, async(req, res) => {
    try{
        const userID = req._id;

        // Fetch the daily summaries for the user
        const summaries = await dailySummariesHistory.findOne({userID});

        // If the user has no summaries, respond with an error
        if(!summaries)
            return res.status(404).json({message: 'No daily summaries found for the user'});


        // Obtain weekly and monthly summaries from the daily summaries
        const weeklySummaries = {};
        const monthlySummaries = {};
        summaries.daily.forEach((summary) => {
            const weekStartDate = getWeekStartDate(summary.date);
            const monthStartDate = getMonthStartDate(summary.date);

            // Update weekly summaries
            if(weeklySummaries[weekStartDate]) {
                weeklySummaries[weekStartDate].steps += summary.steps;
                weeklySummaries[weekStartDate].calories += summary.calories;
                weeklySummaries[weekStartDate].distance += summary.distance;
            }
            else
                weeklySummaries[weekStartDate] = {steps: summary.steps, calories: summary.calories, distance: summary.distance};

            // Update monthly summaries
            if(monthlySummaries[monthStartDate]) {
                monthlySummaries[monthStartDate].steps += summary.steps;
                monthlySummaries[monthStartDate].calories += summary.calories;
                monthlySummaries[monthStartDate].distance += summary.distance;
            }
            else
                monthlySummaries[monthStartDate] = {steps: summary.steps, calories: summary.calories, distance: summary.distance};
        });
        


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
        Object.keys(weeklySummaries).forEach((summaryDate) => {
            weeklyDates.push(summaryDate);
            weeklySteps.push(weeklySummaries[summaryDate].steps);
            weeklyCalories.push(weeklySummaries[summaryDate].calories);
            weeklyDistance.push(weeklySummaries[summaryDate].distance);
        });

        // Convert the monthly summary to 4 arrays of dates, steps, calories, distance
        const monthlyDates = [];
        const monthlySteps = [];
        const monthlyCalories = [];
        const monthlyDistance = [];
        Object.keys(monthlySummaries).forEach((summaryDate) => {
            monthlyDates.push(summaryDate);
            monthlySteps.push(monthlySummaries[summaryDate].steps);
            monthlyCalories.push(monthlySummaries[summaryDate].calories);
            monthlyDistance.push(monthlySummaries[summaryDate].distance);
        });


        // Respond to the client with the summaries
        res.status(200).json({
            message: 'daily summaries fetched successfully',
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