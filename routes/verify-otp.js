const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const secretKey = config.jwtSecret;

const passwordResetRequests = require('../models/passwordResetRequests');

// OTP Verification Route
router.post('/', async (req, res) => {
    try {
        const email = req.body.email;
        const userType = req.body.userType;
        const otp = req.body.otp;

        // Check if all reqd  fields are present
        if (!(email && userType && otp))
            return res.status(400).json({message: 'Field cannot be left blank'});

        // Check if user has requested for OTP
        const passwordResetRequest = await passwordResetRequests.findOne({email, userType});
        if (!passwordResetRequest)
            return res.status(404).json({message: 'OTP request not found'});

        // Check if OTP is valid
        const isOTPValid = await bcrypt.compare(otp, passwordResetRequest.otp);
        if (!isOTPValid)
            return res.status(401).json({message: 'Invalid OTP'});

        // Check if OTP has expired
        else if (Date.now() >= passwordResetRequest.expiresAt.getTime())
            return res.status(401).json({message: 'OTP has expired'});

        // If valid, generate a JWT Token
        const token = jwt.sign({ email, userType }, secretKey);

        // Respond to the client with the Token
        res.status(200).json({ token });

    } catch (err) {
        // Error Handling
        res.status(500).json({messsage: err.message});
    }
});

module.exports = router;