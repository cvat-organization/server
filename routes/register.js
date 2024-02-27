const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const users = require('../models/users');

// Registration route
router.post('/', async(req, res) => {
    try{
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNo = req.body.phoneNo;
        const email = req.body.email;
        const password = req.body.password;
        const userType = req.body.userType;
        
        // Check if all reqd fields are present
        if (!(firstName && password && userType && (email || phoneNo)))
            return res.status(400).json({message: 'Required field (*) cannot be left blank'});

        // Check if user already exists
        const existingUser = await users.findOne({$or: [{phoneNo}, {email}], userType});
        if (existingUser)
            return res.status(409).json({message: 'A user with this email or phone number already exists'});

        // Validate pwd
        const pwdRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!pwdRegex.test(password))
            return res.status(400).json({message: 'Password must be an 8 character (min) alphanumeric with atleast 1 special character'});

        // Hash the pwd before writing to db
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create a new user object
        const _id = "USR" + phoneNo + userType[0];
        const newUser = new users({
            _id,
            createdBy: _id,
            updatedBy: _id,
            firstName,
            lastName,
            phoneNo,
            email,
            password: hashedPwd,
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