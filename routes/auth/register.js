const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const users = require('../../models/users');
const sendEmail = require('../../utils/email');

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
        const existingUser = await users.findOne({$or: [{phoneNo}, {email}], userType});
        if (existingUser)
            return res.status(409).json({message: 'A user with this email or phone number already exists'});

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

        // Respond to client w/ success msg
        res.status(201).json({message: 'User registered successfully!'});

        // Send email to user confirming registration
        sendEmail({
            to: savedUser.email,
            subject: 'Successful Account Registration',
            html: `<h2> Hi ${savedUser.fullName},</h2>
            <br> <p> Your account with CV - Activity Tracker App has been successfully registered and assigned the following trackerID:</p>
            <br> <h2> <strong> ${savedUser.trackerID} </strong> </h2>`,
        });

    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;