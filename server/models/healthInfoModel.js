const mongoose = require('mongoose');

const healthInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    diabetestype: {
        type: String,
        enum: ['Type 1', 'Type 2', 'none'],
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    regularpill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegularPill',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('HealthInfo', healthInfoSchema);
