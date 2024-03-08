const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const users = require('../models/users');
const passwordResetRequests = require('../models/passwordResetRequests');
const sendEmail = require('../utils/email');

const otpExpiryDuration = 5 * 60 * 1000;

// OTP Request Route
router.post('/', async(req, res) => {
    try {
        const email = req.body.email;
        const userType = req.body.userType;

        // Check if all reqd fields are present
        if (!(email && userType))
            return res.status(400).json({message: 'Email field cannot be left blank'});

        // Ensure user exists in database
        const user = await users.findOne({email, userType});
        if (!(user && user.isActive))
            return res.status(404).json({message: 'User not found'});

        // Check if user is temporarily suspended
        if (Date.now() <= user.suspendedTill.getTime())
            return res.status(403).json({message: `Account is temporarily suspended! Try again in ${user.suspendedTill.getTime() - Date.now()} seconds`});

        // If a pwd reset request already exists, delete it
        await passwordResetRequests.deleteOne({email, userType});

        // Generate a One-Time Verification code & hash it
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Store the pwd reset request along with the verification code in the database
        const newPasswordResetRequest = new passwordResetRequests({
            userID: user._id,
            email,
            userType,
            otp: hashedOTP,
            expiresAt: Date.now() + otpExpiryDuration,
        });
        await newPasswordResetRequest.save();

        // Send email of OTP to user
        const emailSuccess = await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `<h2> Hi ${user.fullName},</h2>
            <br> <p> A password reset request has been received for your CV - Activity Tracker account with trackerID:
            ${user.trackerID}
            <br> In order to reset your password, enter the following OTP in the App: </p>
            <br> <h2> <strong> ${otp} </strong> </h2>
            <br> <br> <p> Don't remember requesting for a password reset? Don't worry, just ignore this email. </p>`
        });

        // Respond to client w/ appropriate msg
        if (emailSuccess)
            res.status(200).json({message: 'An email has been sent to your registered Mail ID containing an OTP. Please enter the OTP to continue'})
        else
            res.status(500).json({message: 'Error sending email. Please try again later'});

    } catch(err) {
        // Error Handling
        res.status(500).json({message: err.message});
        console.log(err);
    }
});

module.exports = router;