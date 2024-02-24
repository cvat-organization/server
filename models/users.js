const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
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
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    userType: {
        type: String,
        enum: ['Superuser', 'Customer', 'Vendor'],
        required: true
    }
});

const users = mongoose.model('users', usersSchema);

module.exports = users;
