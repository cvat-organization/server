const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Update users collection route
router.put('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const _id = req.body._id;
        const fullName = req.body.fullName;
        const displayName = req.body.displayName;
        const email = req.body.email;
        const password = req.body.password;
        const phoneNo = req.body.phoneNo;
        const userType = req.body.userType;
        const subCategories = req.body.subCategories;
        const isActive = req.body.isActive;
        const incorrectAttemptsCount = req.body.incorrectAttemptsCount;
        const suspendedTill = req.body.suspendedTill;
        const isLoggedIn = req.body.isLoggedIn;
        const followers = req.body.followers;
        const incomingFollowRequests = req.body.incomingFollowRequests;
        const following = req.body.following;
        const trackerID = req.body.trackerID;
        const createdAt = req.body.createdAt;
        const updatedAt = req.body.updatedAt;
        const createdBy = req.body.createdBy;
        const updatedBy = req.body.updatedBy;
        const __v = req.body.__v;
        const bio = req.body.bio;
        const birthYear = req.body.birthYear;
        const gender = req.body.gender;
        const height = req.body.height;
        const metric = req.body.metric;
        const profilePicture = req.body.profilePicture;
        const stepLengthCM = req.body.stepLengthCM;
        const website = req.body.website;
        const weight = req.body.weight;
        const location = req.body.location;
        const subscriptionStatus = req.body.subscriptionStatus;
        const businessWebsite = req.body.businessWebsite;
        const businessAddress = req.body.businessAddress;
        const businessDescription = req.body.businessDescription;
        const businessDomain = req.body.businessDomain;
        const businessLogo = req.body.businessLogo;
        const serviceType = req.body.serviceType;
        const contactPersonName = req.body.contactPersonName;
        const contactPersonEmail = req.body.contactPersonEmail;
        const contactPersonPhoneNo = req.body.contactPersonPhoneNo;
        const contactPersonDesignation = req.body.contactPersonDesignation;
        const isContactPersonDecisionMaker = req.body.isContactPersonDecisionMaker;

        // Check if all reqd fields are present
        if (!_id)
            return res.status(400).json({message: '_id is required'});

        // Type checking
        if(subCategories && !Array.isArray(subCategories))
            return res.status(400).json({message: 'subCategories must be an array'});
        if(isActive !== undefined && typeof isActive !== 'boolean')
            return res.status(400).json({message: 'isActive must be a boolean'});
        if(incorrectAttemptsCount !== undefined && typeof incorrectAttemptsCount !== 'number')
            return res.status(400).json({message: 'incorrectAttemptsCount must be an integer'});
        if (isLoggedIn !== undefined && typeof isLoggedIn !== 'boolean')
            return res.status(400).json({message: 'isLoggedIn must be a boolean'});
        if (isContactPersonDecisionMaker !== undefined && typeof isContactPersonDecisionMaker !== 'boolean')
            return res.status(400).json({message: 'isContactPersonDecisionMaker must be a boolean'});
        if(followers !== undefined && !Array.isArray(followers))
            return res.status(400).json({message: 'followers must be an array'});
        if(incomingFollowRequests !== undefined && !Array.isArray(incomingFollowRequests))
            return res.status(400).json({message: 'incomingFollowRequests must be an array'});
        if( following !== undefined && !Array.isArray(following))
            return res.status(400).json({message: 'following must be an array'});
        if(createdAt !== undefined && isNaN(Date.parse(createdAt))) 
            return res.status(400).json({message: "Invalid date format for createdAt"});
        if(updatedAt !== undefined && isNaN(Date.parse(updatedAt)))
            return res.status(400).json({message: "Invalid date format for updatedAt"});
        if(suspendedTill !== undefined && isNaN(Date.parse(suspendedTill)))
            return res.status(400).json({message: "Invalid date format for suspendedTill"});
        if (__v !== undefined && typeof __v !== 'number')
            return res.status(400).json({message: "__v must be an integer"});
        if (birthYear !== undefined && typeof birthYear !== 'number')
            return res.status(400).json({message: "birthYear must be an integer"});
        if (height !== undefined && typeof height !== 'number')
            return res.status(400).json({message: "height must be an integer"});
        if (stepLengthCM !== undefined && typeof stepLengthCM !== 'number')
            return res.status(400).json({message: "stepLengthCM must be an integer"});
        if (weight !== undefined && typeof weight !== 'number')
            return res.status(400).json({message: "weight must be a number"});

        // Update the user document
        const updatedUser = await users.findOneAndUpdate({_id}, {
            fullName,
            displayName,
            email,
            password,
            phoneNo,
            userType,
            subCategories,
            isActive,
            incorrectAttemptsCount,
            suspendedTill,
            isLoggedIn,
            followers,
            incomingFollowRequests,
            following,
            trackerID,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
            __v,
            bio,
            birthYear,
            gender,
            height,
            metric,
            profilePicture,
            stepLengthCM,
            website,
            weight,
            location,
            subscriptionStatus,
            businessWebsite,
            businessAddress,
            businessDescription,
            businessDomain,
            businessLogo,
            serviceType,
            contactPersonName,
            contactPersonEmail,
            contactPersonPhoneNo,
            contactPersonDesignation,
            isContactPersonDecisionMaker,
        }, {new: true});


        // Respond w/ appropriate msg
        if(updatedUser)
            res.status(200).json({message: 'User updated successfully'});
        else
            res.status(404).json({message: 'User not found. _id is invalid'});

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;