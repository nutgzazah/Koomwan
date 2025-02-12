const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    healthinfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthInfo',
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
        required: false,
    },
    a1c: {
        type: Number,
        required: false,
    },
    bloodpressure: {
        systolic: {
            type: Number,
            required: false, // ความดันตัวบน
        },
        diastolic: {
            type: Number,
            required: false, // ความดันตัวล่าง
        }
    },
    moodstatus: {
        type: String,
        enum: ['laughing', 'happy', 'neutral', 'irritated', 'sick', 'crying', 'angry'],
        lowercase: true,
        required: false,
    },
    additionpill: [{
        pillName: {
            type: String,
            required: true,
            trim: true
        },
        pillImage: {
            type: String,
            required: false,
        },
        pillType: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: false,
            default: "",
            trim: true
        },
        takePillTimes: [{
            type: String,
            required: false,
            trim: true // รูปแบบเวลาที่ทานยา เช่น "06:00" 
        }]
    }],
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
