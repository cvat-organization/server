const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Get users vs time data route
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const userType = req.body.userType;

        // Check if all reqd fields are present
        if (!userType)
            return res.status(400).json({message: 'Invalid request body'});

        // Fetch the users
        const usersData = await users.find({ userType });

        // Convert the user data to 2 arrays of userIDs and registration dates
        const dateVSCount = {};
        usersData.forEach((user) => {
            const formattedDate = user.createdAt.toISOString().split('T')[0];
            if (!dateVSCount[formattedDate]) {
                dateVSCount[formattedDate] = 1;
            } else {
                dateVSCount[formattedDate]++;
            }
        });

        // Respond to the client with the user data
        res.status(200).json({
            message: 'Users vs time data fetched successfully',
            dates: Object.keys(dateVSCount),
            counts: Object.values(dateVSCount),
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;