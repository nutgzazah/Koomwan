const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    healthinfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthInfo',
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    recordtime: {
        type: Date,
        default: Date.now,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    bloodsugar: {
        type: Number,
        required: true,
    },
    a1c: {
        type: Number,
        required: true,
    },
    bloodpressure: {
        type: Number,
        required: true,
    },
    moodstatus: {
        type: String,
        required: true,
    },
    medicineaddition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicineAddition',
    },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
