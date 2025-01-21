const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Please Add Username'],
        unique:true,
        lowercase: true,
        trim: true,
    },
    email:{
        type:String,
        required:[true,'Please Add Email'],
        unique:true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,'Please Add Password'],
        minlength: 6,
        maxlength: 64,
    },
    phone: {
        type: String,
        required: [true, 'Please Add Phone Number'],
        unique: true,
        trim: true,
        match: /^[0-9]{10}$/, // เบอร์โทรศัพท์ 10 หลัก
    },
    healthinfo: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
},{ timestamps: true })

module.exports = mongoose.model('User', userSchema)