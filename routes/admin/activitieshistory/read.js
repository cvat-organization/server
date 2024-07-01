const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const activitiesHistory = require('../../../models/activitiesHistory');

// Get complete activitieshistory collection route
router.get('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const aggregation = activitiesHistory.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userID',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 1,
                    userID: 1,
                    fullName: '$userDetails.fullName',
                    trackableActivitiesHistory: 1,
                    untrackableActivitiesHistory: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    isActive: 1,
                    __v: 1
                }
            }
        ]);
        
        const activitiesData = await aggregation.exec();

        // Respond to the client with the activities data
        res.status(200).json({
            message: 'Activities data fetched successfully',
            activitiesData
        });

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;