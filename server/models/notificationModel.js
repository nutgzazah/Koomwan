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
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ลบใน 7 วัน
        index: { expires: 0 }, // TTL index, ลบทันทีที่เลยเวลา
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
    forum: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Forum',
        required: false
    },
    helpRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HelpRequest',  // เชื่อมโยงไปยัง HelpRequest model
        required: false,
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
