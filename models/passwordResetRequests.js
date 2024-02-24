const mongoose = require('mongoose');

const passwordResetRequestsSchema = new mongoose.Schema({
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
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
    },
});

const passwordResetRequests = mongoose.model('passwordResetRequests', passwordResetRequestsSchema);

module.exports = passwordResetRequests;