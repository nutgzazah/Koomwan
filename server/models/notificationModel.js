const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    notificationType: {
        type: String,
        // enum: ['forum', 'general', 'medication', 'system'],
        required: true
    },
    medicationDetails: {
        pillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RegularPill'
        },
        pillName: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
