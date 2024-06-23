const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const activitiesHistory = require('../../../models/activitiesHistory');

// Get complete activitieshistory collection route
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const activitiesData = await activitiesHistory.find();

        // Respond to the client with the activities data
        res.status(200).json({
            message: 'Activities data fetched successfully',
            activitiesData
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;