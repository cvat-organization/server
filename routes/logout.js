const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const users = require('../models/users');

// Logout route
router.post('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;

        // set `isLoggedIn` to false for the respective user
        await users.updateOne(
            { _id },
            {$set: {isLoggedIn: false, updatedAt: Date.now()}}
        );

        // Respond with appropriate msg
        res.status(200).json({message: 'User successfully logged out!'});
    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;