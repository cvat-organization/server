const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');
const sendEmail = require('../../../utils/email');

// Vendor Registration route
router.post('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const businessName = req.body.businessName;
        const businessDisplayName = req.body.businessDisplayName;
        const businessEmail = req.body.businessEmail;
        const businessContactNo = req.body.businessContactNo;
        const businessWebsite = req.body.businessWebsite;
        const businessAddress = req.body.businessAddress;
        const businessDomain = req.body.businessDomain;
        const subCategories = req.body.subCategories;
        const businessDescription = req.body.businessDescription;
        const businessLogo = req.body.businessLogo;
        const serviceType = req.body.serviceType;
        const contactPersonName = req.body.contactPersonName;
        const contactPersonEmail = req.body.contactPersonEmail;
        const contactPersonPhoneNo = req.body.contactPersonPhoneNo;
        const contactPersonDesignation = req.body.contactPersonDesignation;
        const isContactPersonDecisionMaker = req.body.isContactPersonDecisionMaker;
        const userType = "Vendor";
        
        // Check if all reqd fields are present
        if (!(businessName && businessDisplayName && businessEmail && businessContactNo))
            return res.status(400).json({message: 'Required field (*) cannot be left blank'});

        // Check if vendor already exists
        const existingUser = await users.findOne({$or: [{phoneNo: businessContactNo}, {email: businessEmail}], userType});
        if (existingUser)
            return res.status(409).json({message: 'A vendor with this business email or business contact number already exists'});

        // Create a password for the vendor
        const password = Math.random().toString(36).slice(-8);

        // Hash the pwd before writing to db
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new users({
            fullName: businessName,
            displayName: businessDisplayName,
            phoneNo: businessContactNo,
            email: businessEmail,
            password: hashedPwd,
            userType,
            businessWebsite,
            businessAddress,
            businessDomain,
            subCategories,
            businessDescription,
            serviceType,
            contactPersonName,
            contactPersonEmail,
            contactPersonPhoneNo,
            contactPersonDesignation,
            isContactPersonDecisionMaker,
        });

        // Write the user object to the db
        const savedUser = await newUser.save();

        // Accept businessLogo as a base64 String and save it in the `assets/business-logos` folder
        if (businessLogo) {
            const base64Image = (businessLogo).replace(/^data:image\/png;base64,/, "");
            const base64ImageBuffer = Buffer.from(base64Image, 'base64');
            const businessLogoPath = `assets/business-logos/${savedUser._id}.png`;

            // Save the image
            fs.writeFileSync(businessLogoPath, base64ImageBuffer);
            savedUser.businessLogo = businessLogoPath;
            await savedUser.save();
        }

        // Respond to client w/ success msg
        res.status(201).json({message: 'Vendor registered successfully! An email has been sent to the vendor with the login credentials.'});

        // Send email to vendor confirming registration
        sendEmail({
            to: savedUser.email,
            subject: 'Successful Account Registration',
            html: `<h2> Hi ${savedUser.fullName},</h2>
            <br> <p> Your account with CV - Activity Tracker App has been successfully registered and has been assigned the following trackerID:</p>
            <br> <h2> <strong> ${savedUser.trackerID} </strong> </h2>
            <br> <p> Your login credentials are as follows:</p>
            <br> <p> Email: ${savedUser.email}</p>
            <p> Password: ${password}</p>
            <br> <p> Please login to your account and change your password immediately.`,
        });

    } catch(err){
        // Error handling
        res.status(500).json({message: err.message});
    }
});

module.exports = router;