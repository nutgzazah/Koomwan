const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId, // เก็บข้อมูลผู้ใช้ที่ยื่นคำขอ
      ref: 'User',
      required: true, // จำเป็นต้องระบุผู้ใช้
    },
    date: {
        type: Date,
        default: Date.now, // เวลาในรูปแบบ ISO ซึ่งจะเก็บวันที่และเวลา
    },
    title: {
        type: String,
        required: true, // ต้องการให้ผู้ใช้กรอกหัวข้อรายงาน
    },
    detail: {
        type: String,
        required: true, // ต้องการให้ผู้ใช้กรอกรายละเอียด
    },
    status: {
        type: String,
        enum: ['pending', 'completed'], // ค่าสถานะสามารถเป็น pending หรือ completed เท่านั้น
        default: 'pending', // กำหนดสถานะเริ่มต้นเป็น pending
    },
    }, {
    timestamps: true, // เก็บข้อมูลเกี่ยวกับเวลาที่สร้างและแก้ไข
});

// สร้างและส่งออกโมเดล
const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

module.exports = HelpRequest;
