const mongoose = require('mongoose');

const generateTrackerID = () => 'u' + Date.now();

const usersSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    trackerID: {
        type: String,
        default: generateTrackerID,
        unique: true,
    },
    fullName: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
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
        default: new Date(0)
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    friends: {
        type: Array,
    },
    incomingFriendRequests: {
        type: Array,
    },

    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});


// Pre-save middleware
usersSchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
usersSchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});

const users = mongoose.model('users', usersSchema);

module.exports = users;
