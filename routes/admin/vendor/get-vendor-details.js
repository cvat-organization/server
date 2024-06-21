const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Get all vendor rows from users collection route
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const vendorsData = await users.find({userType: 'Vendor'})

        // Respond to the client with the user data
        res.status(200).json({
            message: 'Users data fetched successfully',
            vendorsData
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;