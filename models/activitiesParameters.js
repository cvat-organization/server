const mongoose = require('mongoose');

const activitiesParametersSchema = new mongoose.Schema({
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'activitiesParameters' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'activitiesParameters' },
});


// Pre-save middleware
activitiesParametersSchema.pre('save', async function(next) {
    this.isNew ? this.createdBy = this._id : this.updatedAt = Date.now();
    this.updatedBy = this._id;
    next();
});

// Pre-update middleware
activitiesParametersSchema.pre(/^update/, function(next) {
    this._update.updatedAt = new Date();
    this._update.updatedBy = this.getQuery()._id;
    next();
});


const activitiesParameters = mongoose.model('activitiesParameters', activitiesParametersSchema);

module.exports = activitiesParameters;