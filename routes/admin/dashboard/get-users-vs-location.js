const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Get users vs location data route
/*
    Return format:
    [
        {
            date: '2021-08-01',
            location: 'location1',
            users: 5
        },
        {
            date: '2021-08-01',
            location: 'location2',
            users: 10
        },
        ...
    ]
*/
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try {
        const usersData = await users.find();

        // Convert the user data to an array of objects with date, location and count
        const dateLocationVSCount = {};
        usersData.forEach((user) => {
            const formattedDate = user.createdAt.toISOString().split('T')[0];
            const location = user.location;
            const key = `${formattedDate}_${location}`;
            if (!dateLocationVSCount[key]) {
                dateLocationVSCount[key] = 1;
            } else {
                dateLocationVSCount[key]++;
            }
        });

        // Convert the object to an array of objects
        const dateLocationVSCountArray = [];
        Object.keys(dateLocationVSCount).forEach((key) => {
            const [formattedDate, location] = key.split('_');
            dateLocationVSCountArray.push({
                date: formattedDate,
                location,
                users: dateLocationVSCount[key],
            });
        });

        // Respond to the client with the user data
        res.status(200).json({
            message: 'Users vs location data fetched successfully',
            data: dateLocationVSCountArray,
        });

    } catch (err) {
        // Error handling
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;