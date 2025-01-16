const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Please Add Username'],
        unique:true,
        trim: true,
    },
    email:{
        type:String,
        required:[true,'Please Add Email'],
        unique:true,
        trim: true,
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
        match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number']
    },
    healthinfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthInfo', // อ้างอิงไปยังโมเดล HealthInfo
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
},{ timestamps: true })

module.exports = mongoose.model('User', userSchema)