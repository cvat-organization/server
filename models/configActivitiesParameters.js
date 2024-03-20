const mongoose = require('mongoose');

const configActivitiesParametersSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    activityName: {
        type: String,
        required: true,
        unique: true,
    },
    isTrackable: {
        type: Boolean,
        required: true,
    },
    activityParameters: {
        type: Object,
        required: true,
    },
    subActivities: {
        type: Array,
    },

    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'configActivitiesParameters' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'configActivitiesParameters' },
});


// Pre-save middleware
configActivitiesParametersSchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
configActivitiesParametersSchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});


const configActivitiesParameters = mongoose.model('configActivitiesParameters', configActivitiesParametersSchema);

module.exports = configActivitiesParameters;