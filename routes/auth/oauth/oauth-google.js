const express = require('express');
const router = express.Router();
const fs = require('fs');
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const sendEmail = require('../../../utils/email');
const config = require('../../../config/config');
const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
const secretKey = config.jwtSecret;

const users = require('../../../models/users');

// Signin with Google Route
router.post('/', async (req, res) => {
    try{
        const idToken = req.headers.authorization.split(' ')[1];
        const userType = req.body.userType;

        // Check if all reqd fields are present
        if (!(idToken && userType))
            return res.status(400).json({message: 'Invalid request headers/body'});

        // Decode google's token and obtain the payload
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();

        const fullName = payload.name;
        const displayName = payload.given_name;
        const email = payload.email;

        // Check if the payload contains all the reqd fields
        if (!(fullName && displayName && email))
            return res.status(400).json({message: 'Payload does not contain required field'});

        // If profile picture URL is present, download the image from the google URL
        let buffer = null;
        if (payload.picture) {
            const response = await fetch(payload.picture);
            buffer = await response.buffer();
        }
        
        // Check if user exists
        const existingUser = await users.findOne({ email, userType });

        // If user already exists, log them in
        if (existingUser){
            // Reset incorrect attempts count, suspenstion timer, and set login status to true
            existingUser.incorrectAttemptsCount = 0;
            existingUser.suspendedTill = 0;
            existingUser.isLoggedIn = true;
            await existingUser.save();

            // Generate a JWT Token and respond to the client with the Token
            let token = jwt.sign({_id: existingUser._id}, secretKey);
            return res.status(200).json({ token });
        }

        // If the user doesn't exist, register them
        // Save the user in the database, set login status to true
        const newUser = new users({
            fullName,
            displayName,
            email,
            userType,
            isLoggedIn: true    // Log in the user
        });
        const savedUser = await newUser.save();

        // Save the user's profilePicture in the `assets/profile-pictures` folder using their `_id` as the filename
        if (buffer) {
            const profilePicturePath = `assets/profile-pictures/${savedUser._id}.png`;
            fs.writeFileSync(profilePicturePath, buffer);
            savedUser.profilePicture = profilePicturePath;
            await savedUser.save();
        }

        // Send email to user confirming registration
        sendEmail({
            to: savedUser.email,
            subject: 'Successful Account Registration',
            html: `<h2> Hi ${savedUser.fullName},</h2>
            <br> <p> Your account with CV - Activity Tracker App has been successfully registered and has been assigned the following trackerID:</p>
            <br> <h2> <strong> ${savedUser.trackerID} </strong> </h2>`,
        });

        // Generate a JWT token for the sesion
        let token = jwt.sign({_id: savedUser._id}, secretKey);

        // Respond to the client with the token
        res.status(201).json({
            message: 'User registered successfully!',
            token
        });

    } catch(err) {
        // Error handling
        if (err.message.toLowerCase().includes('token'))
            res.status(401).json({message: 'Unauthorized. Expired or invalid token '});
        else
            res.status(500).json({message: err.message});
    }
});

module.exports = router;