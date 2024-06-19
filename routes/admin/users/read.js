const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Get complete users collection route
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const usersData = await users.find();

        // Respond to the client with the user data
        res.status(200).json({
            message: 'Users data fetched successfully',
            usersData: usersData
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;