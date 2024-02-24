const mongoose = require('mongoose');

const sessionsSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
    },
    userType: {
        type: String,
        enum: ['Superuser', 'Customer', 'Vendor'],
        required: true,
    },
});

const sessions = mongoose.model('sessions', sessionsSchema);

module.exports = sessions;