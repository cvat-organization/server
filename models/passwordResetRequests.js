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
    userID: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
});

const passwordResetRequests = mongoose.model('passwordResetRequests', passwordResetRequestsSchema);

module.exports = passwordResetRequests;