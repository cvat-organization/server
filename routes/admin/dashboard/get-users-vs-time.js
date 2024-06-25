const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Get users vs time data route
/*
    Return format:
    [
        {
            date: '2021-08-01',
            count: 5
        },
        {
            date: '2021-08-01',
            count: 10
        },
        ...
    ]
*/
router.get('/:userType', authMiddlewareAdmin, async(req, res) => {
    try{
        const userType = req.params.userType;

        // Check if all reqd fields are present
        if (!userType)
            return res.status(400).json({message: 'Path parameter userType is required'});

        // Fetch the users
        const usersData = await users.find({ userType });

        // Convert the user data to an array of objects with date and count
        const dateVSCount = {};
        usersData.forEach((user) => {
            const formattedDate = user.createdAt.toISOString().split('T')[0];
            const key = formattedDate;
            if (!dateVSCount[key]) {
                dateVSCount[key] = 1;
            } else {
                dateVSCount[key]++;
            }
        });

        // Convert the object to an array of objects
        const dateVSCountArray = [];
        Object.keys(dateVSCount).forEach((key) => {
            dateVSCountArray.push({
                date: key,
                count: dateVSCount[key],
            });
        });

        // Respond to the client with the user data
        res.status(200).json({
            message: 'Users vs time data fetched successfully',
            data: dateVSCountArray,
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;