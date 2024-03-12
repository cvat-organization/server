const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = require('../models/users');
const config = require('../config/config');
const secretKey = config.jwtSecret;

// Duration for which to suspend a user (in ms)
const suspendDuration = 60 * 1000;

// Login route
router.post('/', async(req, res) => {
    try{
        const phoneNo = req.body.phoneNo;
        const email = req.body.email;
        const password = req.body.password;
        const userType = req.body.userType;

        // Check if all reqd fields are present
        if (!((phoneNo || email) && password && userType))
            return res.status(400).json({message: 'Required field cannot be left blank'});

        // Ensure user exists
        const user = await users.findOne(phoneNo? {phoneNo, userType} : {email, userType});
        if (!user || !user.isActive)
            return res.status(404).json({message: 'User not found'});

        // Check if user is suspended
        const remainingSuspensionTime = Math.floor((user.suspendedTill.getTime() - Date.now())/1000);
        if (remainingSuspensionTime > 0)
            return res.status(403).json({message: `Account is temporarily suspended! Try again in ${remainingSuspensionTime} seconds`})

        // Compare pwd with the hashed pwd in the db
        const isPwdValid = user.password ? await bcrypt.compare(password,user.password) : false;
        if (!isPwdValid){
            // If `incorrectAttemptsCount` is already at 3, suspend the user
            if (user.incorrectAttemptsCount >= 3){
                user.suspendedTill = Date.now() + suspendDuration;
                await user.save();
                return res.status(403).json({message: `Too many incorrect login attempts. Please try again after ${suspendDuration/1000} seconds`});
            }

            // Else, increment `incorrectAttemptsCount`
            user.incorrectAttemptsCount++;
            await user.save();
            return res.status(401).json({message: 'Invalid password'});
        }

        // Credentials are valid
        // Reset `incorrectAttemptsCount` to 0, suspendedTill to 0, set `isLoggedIn` to true
        user.incorrectAttemptsCount = 0;
        user.suspendedTill = 0;
        user.isLoggedIn = true;
        await user.save();

        // Generate & sign a JWT and send it to the client
        const token = jwt.sign({_id: user._id}, secretKey);
        res.status(200).json({ token });
    
    } catch(err){
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;