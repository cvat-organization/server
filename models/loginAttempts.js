const mongoose = require('mongoose');

const loginAttemptsSchema = new mongoose.Schema({
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
    success: {
        type: Boolean,
        default: true,
    },
    errorMsg: {
        type: String,
    },
    incorrectAttemptsCount: {
        type: Number,
        default: 0,
    }
});

const loginAttempts = mongoose.model('loginAttempts', loginAttemptsSchema);

module.exports = loginAttempts;