// Dummy route - in development

const express = require('express');
const router = express.Router();

const users = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');

// Homepage route
router.get('/', authMiddleware, async(req, res) => {
    try {
        const _id = req._id;

        // Respond with homepage data
        const user = await users.findOne({ _id });
        res.status(200).json({message: `Welcome to ${user.userType} homepage`});
    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;