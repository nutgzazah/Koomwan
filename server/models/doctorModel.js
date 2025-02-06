const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'กรุณาเพิ่ม Username'],
        lowercase: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true,'กรุณาเพิ่ม Email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'กรุณาใช้ Email ที่ถูกต้อง']
    },
    password: {
        type: String,
        required: [true,'กรุณาเพิ่ม Password'],
        minlength: 6,
        maxlength: 64
    },
    phone: {
        type: String,
        required: [true, 'กรุณาเพิ่มเบอร์โทรศัพท์'],
        unique: true,
        trim: true,
        match: /^[0-9]{10}$/, // เบอร์โทรศัพท์ 10 หลัก
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    expert: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    approval: {
        status: {
            type: String,
            enum: ['pending', 'approve', 'disapprove'],
            default: 'pending'
        },
        reason: {
            type: String,
            default: ''
        }
    },
    healthinfo: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['doctor', 'admin'],
        default: 'doctor',
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
