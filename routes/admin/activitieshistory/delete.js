const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const activitiesHistory = require('../../../models/activitiesHistory');

// Delete document in activitieshistory collection route
router.delete('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const _id = req.body._id;

        // Check if all reqd fields are present
        if (!_id)
            return res.status(400).json({message: '_id is required'});

        // Delete the document
        const deletedActivitiesHistory = await activitiesHistory.findByIdAndDelete(_id);

        // Respond to the client with appropriate msg
        if (deletedActivitiesHistory)
            res.status(200).json({message: 'Document deleted successfully'});
        else
            res.status(404).json({message: 'Document not found. _id is invalid'});

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;