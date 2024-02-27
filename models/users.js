const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    _id: {
        type: String
    },
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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['Superuser', 'Customer', 'Vendor'],
        required: true
    },
    incorrectAttemptsCount: {
        type: Number,
        default: 0,
    },
    suspendedTill: {
        type: Date,
        default: Date(0)
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
});

const users = mongoose.model('users', usersSchema);

module.exports = users;
