const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = require('../models/users');
const sendEmail = require('../utils/email');
const config = require('../config/config');
const secretKey = config.jwtSecret;

// Set New Password Route
router.post('/', async(req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const password = req.body.password;

        // Check if all reqd fields are present
        if (!(token && password))
            return res.status(400).json({message: 'Field cannot be left empty'});

        // Verify the token
        const decodedToken = jwt.verify(token, secretKey);
        
        // Hash the new password
        const hashedPwd = await bcrypt.hash(password, 10);
        
        // Update the password in the database
        const updateResult = await users.updateOne(
            {
                email: decodedToken.email,
                userType: decodedToken.userType
            }, {$set: {
                    password: hashedPwd,
                    isLoggedIn: false
            }}
        );

        // Respond to the client w/ appropriate msg
        if (updateResult.modifiedCount > 0)
            res.status(201).json({message: 'Password has been successfully changed'});
        else
            res.status(401).json({message: 'Unauthorized. Token has been modified'});

        // Send an email to the user notifying them of the pwd change
        await sendEmail({
            to: decodedToken.email,
            subject: 'Password Reset',
            html: `<p> This email is to notify you that the password for your CV - Activity Tracker account linked with 
            ${decodedToken.email} has been changed.
            <br> Not you? Contact the Care Vigil Suport Team </p>`
        });

    } catch (err) {
        // Error handling
        return res.status(401).json({message: 'Unauthorized. Token is invalid'});
    }
});

module.exports = router;