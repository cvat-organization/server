const mongoose = require('mongoose');

const periodicSummariesSchema = new mongoose.Schema({
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
    stepsGoal: {
        type: Number,
        default: 10000,
    },
    goalAchieved: {
        type: Boolean,
        default: false,
    },
    daily: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                index: true
            },
            dates: Array,
            steps: Array,
            calories: Array,
            distance: Array,
        },
    },
    weekly: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                index: true
            },
            dates: Array,
            steps: Array,
            calories: Array,
            distance: Array,
        },
    },
    monthly: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                index: true
            },
            dates: Array,
            steps: Array,
            calories: Array,
            distance: Array,
        },
    },

    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'periodicSummaries' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'periodicSummaries' },
});


// Pre-save middleware
periodicSummariesSchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
periodicSummariesSchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});


const periodicSummaries = mongoose.model('periodicSummaries', periodicSummariesSchema);

module.exports = periodicSummaries;