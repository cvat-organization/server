const express = require('express');
const router = express.Router();

const activitiesParameters = require('../../models/activitiesParameters');
const authMiddleware = require('../../middleware/authMiddleware');

// Retrieve All Defined Activities & their Parameters Route
router.get('/', authMiddleware, async(req, res) => {
    try {
        const definedActivitiesParameters = await activitiesParameters.find({isActive: true});

        // Ensure that the activities parameters collection is not empty
        if(!definedActivitiesParameters)
            return res.status(404).json({message: 'No predefined activities found'});

        // Return the defined activities & their parameters
        res.status(200).json({ definedActivitiesParameters });

    } catch(err) {
        // Error handling
        return res.status(500).json({message: err.message});
    }
});

module.exports = router;
