const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const users = require('../models/users');

// Registration route
router.post('/', async(req, res) => {
    try{
        const fullName = req.body.fullName;
        const displayName = req.body.displayName;
        const phoneNo = req.body.phoneNo;
        const email = req.body.email;
        const password = req.body.password;
        const userType = req.body.userType;
        
        // Check if all reqd fields are present
        if (!(fullName && displayName && password && userType && email && phoneNo))
            return res.status(400).json({message: 'Required field (*) cannot be left blank'});

        // Check if user already exists
        const existingUser = await users.findOne({email, userType});
        if (existingUser)
            return res.status(409).json({message: 'A user with this email already exists'});

        // Hash the pwd before writing to db
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new users({
            fullName,
            displayName,
            phoneNo,
            email,
            password: hashedPwd,
            userType,
        });

        // Write the user object to the db
        const savedUser = await newUser.save();

        // Respond w/ success msg
        // Respond to client w/ success msg
        res.status(201).json({message: 'User registered successfully!'});
    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;