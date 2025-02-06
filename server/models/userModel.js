const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'กรุณาเพิ่ม Username'],
        unique:true,
        lowercase: true,
        trim: true,
    },
    email:{
        type:String,
        required:[true,'กรุณาเพิ่ม Email'],
        unique:true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'กรุณาใช้ Email ที่ถูกต้อง']
    },
    password:{
        type:String,
        required:[true,'กรุณาเพิ่ม Password'],
        minlength: 6,
        maxlength: 64,
    },
    phone: {
        type: String,
        required: [true, 'กรุณาเพิ่มเบอร์โทรศัพท์'],
        unique: true,
        trim: true,
        match: /^[0-9]{10}$/, // เบอร์โทรศัพท์ 10 หลัก
    },
    image: {
        type: String,
        required: false,
        default:'koomwanAvatar01.png'
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