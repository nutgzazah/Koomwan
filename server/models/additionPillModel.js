const mongoose = require('mongoose');

const additionPillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record',
        required: true
    },
    pillName: {
        type: String,
        required: true,
        trim: true
    },
    pillType: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    reminderTimes: [{
        type: String,
        required: true,
        trim: true // รูปแบบเวลา เช่น "06:00" สำหรับ 6 โมงเช้าของทุกวัน
    }]
});

module.exports = mongoose.model('AdditionPill', additionPillSchema);
