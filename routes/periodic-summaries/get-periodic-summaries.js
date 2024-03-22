const express = require('express');
const router = express.Router();

const periodicSummaries = require('../../models/periodicSummaries');

// Get daily, weekly, monthly summaries route
router.get('/', async(req, res) => {
    try{
        const userID = req.body.userID;

        // Check if all reqd fields are present
        if (!userID)
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