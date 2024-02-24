const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/authMiddleware');
const sessions = require('../models/sessions');

// Logout route
router.post('/', authMiddleware, async(req, res) => {
    try {
        const sessionID = req.sessionID;

        // Delete the respective session
        const deletionResult = await sessions.deleteOne({_id: sessionID});
        if (deletionResult.deletedCount !== 1)
            return res.status(404).json({message: 'Session not found'});

        // Respond with appropriate msg
        res.status(200).json({message: 'User successfully logged out!'});
    } catch(err) {
        // Error handling
        return res.status(401).json({message: err.message});
    }
});

module.exports = router;