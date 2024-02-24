const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = require('../models/users');
const sessions = require('../models/sessions');
const config = require('../config/config');
const secretKey = config.jwtSecret;

// Login route
router.post('/', async(req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        // Check if all reqd fields are present
        if (!(username && password))
            return res.status(400).json({message: 'Required field cannot be left blank'});

        // Check if username is present in db
        const user = await users.findOne({username});
        if (!user || !user.isActive)
            return res.status(404).json({message: 'User not found'});

        // Compare pwd with the hashed pwd in the db
        const isPwdValid = await bcrypt.compare(password,user.password);
        if (!isPwdValid)
            return res.status(401).json({message: 'Invalid password'});

        // If a session is already open for this user, respond with the token
        const existingSession = await sessions.findOne({username: user.username});
        if (existingSession && existingSession.isActive)
            return res.status(200).json({ token: existingSession.token });

        // Else, generate a JWT token for the user
        const token = jwt.sign({userID: user._id}, secretKey);

        // Store the token in the `sessions` collection
        const session = new sessions({
            createdBy: user.username,
            updatedBy: user.username,
            userID: user._id,
            username: user.username,
            token: token,
            userType: user.userType,
        });
        await session.save();
        
        // Respond to the client with the token
        res.status(200).json({ token });
    } catch(err){
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;