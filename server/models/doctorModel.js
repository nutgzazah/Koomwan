const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Add Username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true,'Please Add Email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true,'Please Add Password'],
        minlength: 6,
        maxlength: 64
    },
    phone: {
        type: String,
        required: [true, 'Please Add Phone Number'],
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
