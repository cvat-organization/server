const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const users = require('../models/users');

// Registration route
router.post('/', async(req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const phoneNo = req.body.phoneNo;
        const email = req.body.email;
        const userType = req.body.userType;
        
        // Check if all reqd fields are present
        if (!(username && password && phoneNo && userType))
            return res.status(400).json({message: 'Required field (*) cannot be left blank'});

        // Check if phoneNo already exists
        const existingPhoneNo = await users.findOne({ phoneNo });
        if (existingPhoneNo)
            return res.status(409).json({message: 'A user with this phone number already exists'});
        
        // Check if username already exists
        const existingUsername = await users.findOne({ username });
        if (existingUsername)
            return res.status(409).json({message: 'This username is aready taken'});

        // Validate pwd
        const pwdRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!pwdRegex.test(password))
            return res.status(400).json({message: 'Password must be an 8 character (min) alphanumeric with atleast 1 special character'});

        // Hash the pwd before writing to db
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new users({
            createdBy: username,
            updatedBy: username,
            username,
            password: hashedPwd,
            phoneNo,
            email,
            userType,
        });

        // Write the user object to the db
        await newUser.save();

        // Respond w/ success msg
        res.status(201).json({message: 'User registered successfully!'});
    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;