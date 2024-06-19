const express = require('express');
const router = express.Router();

const authMiddlewareAdmin = require('../../../middleware/authMiddlewareAdmin');
const users = require('../../../models/users');

// Delete user from users collection route
router.delete('/', authMiddlewareAdmin, async(req, res) => {
    try{
        const _id = req.body._id;

        // Check if all reqd fields are present
        if (!_id)
            return res.status(400).json({message: '_id is required'});

        // Delete the user
        const deletedUser = await users.findByIdAndDelete(_id);

        // Respond to the client w/ appropriate msg
        if (deletedUser)
            res.status(200).json({message: 'User deleted successfully'});
        else
            res.status(404).json({message: 'User not found'});

    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;