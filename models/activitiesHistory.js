const mongoose = require('mongoose');

const activitiesHistorySchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true,
    },
    trackableActivitiesHistory: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    index: true
                },
                activityName: String,
                subActivityTree: Object,
                startTime: Date,
                endTime: Date,
                parameters: Object,
                thumbnail: String,
                comments: String,
            }
        ],
    },
    untrackableActivitiesHistory: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    index: true
                },
                activityName: String,
                subActivityTree: Object,
                startTime: Date,
                endTime: Date,
                parameters: Object,
                comments: String
            }
        ],
    },

    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'activitiesHistory' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'activitiesHistory' },
});


// Pre-save middleware
activitiesHistorySchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
activitiesHistorySchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});


const activitiesHistory = mongoose.model('activitiesHistory', activitiesHistorySchema);

module.exports = activitiesHistory;