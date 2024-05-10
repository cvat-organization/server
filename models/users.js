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
    followers: {
        type: Array,
    },
    incomingFollowRequests: {
        type: Array,
    },
    following: {
        type: Array,
    },
    bio: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    gender: {
        type: String,
    },
    birthYear: {
        type: Number,
    },
    metric: {
        type: String,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    stepLengthCM: {
        type: Number,
    },
    subscriptionStatus: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    
    // Vendor fields
    businessWebsite: {
        type: String,
    },
    businessAddress: {
        type: String,
    },
    businessDomain: {
        type: String,
    },
    subCategories: {
        type: Array,
    },
    businessDescription: {
        type: String,
    },
    businessLogo: {
        type: String,
    },
    serviceType: {
        type: String,
    },
    contactPersonName: {
        type: String,
    },
    contactPersonEmail: {
        type: String,
    },
    contactPersonPhoneNo: {
        type: String,
    },
    contactPersonDesignation: {
        type: String,
    },
    isContactPersonDecisionMaker: {
        type: Boolean,
    },
    incorporationCertificate: {
        type: String,
    },
    gst: {
        type: String,
    },
    pan: {
        type: String,
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
