const mongoose = require('mongoose');

const passwordResetRequestsSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['Superuser', 'Customer', 'Vendor'],
        required: true
    },
    otp: {
        type: String,
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
    },

    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});


// Pre-save middleware
passwordResetRequestsSchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
passwordResetRequestsSchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});


const passwordResetRequests = mongoose.model('passwordResetRequests', passwordResetRequestsSchema);

module.exports = passwordResetRequests;