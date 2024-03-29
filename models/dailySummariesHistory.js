const mongoose = require('mongoose');

const dailySummariesSchema = new mongoose.Schema({
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
    daily: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    index: true
                },
                date: Date,
                steps: Number,
                calories: Number,
                distance: Number,
                stepsGoal: Number,
                goalAchieved: Boolean,
            },
        ],
    },

    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'dailySummaries' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'dailySummaries' },
});


// Pre-save middleware
dailySummariesSchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
dailySummariesSchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});


const dailySummaries = mongoose.model('dailySummariesHistory', dailySummariesSchema);

module.exports = dailySummaries;