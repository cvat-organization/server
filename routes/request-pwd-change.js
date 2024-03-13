const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/authMiddleware');
const config = require('../config/config');
const secretKey = config.jwtSecret;

const users = require('../models/users');
const passwordResetRequests = require('../models/passwordResetRequests');

// Request for PWD Change Route
router.post('/', authMiddleware, async (req, res) => {
    try {
        const password = req.body.password;
        const _id = req._id;

        // Check if all reqd fields are present
        if (!password)
            return res.status(400).json({message: 'Field cannot be left blank'});

        // Ensure that pwd is correct
        const user = await users.findOne({ _id });
        const isPwdValid = user.password ? await bcrypt.compare(password, user.password) : false;
        if (!isPwdValid)
            return res.status(401).json({message: 'Invalid password'});

        // Generate a JWT Token
        const token = jwt.sign({email: user.email, userType: user.userType}, secretKey);

        // Store the password change request in the database
        const newPasswordResetRequest = new passwordResetRequests({
            userID: _id,
            email: user.email,
            userType: user.userType,
        });
        await newPasswordResetRequest.save();

        // Respond to the client with the Token
        res.status(200).json({ token });

    } catch(err) {
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;