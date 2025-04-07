const mongoose = require('mongoose');
const HealthInfo = require('../models/healthInfoModel'); // โมเดล healthinfo
const Record = require('../models/recordModel');         // โมเดล record
const User = require('../models/userModel'); // นำเข้า User Model
const Doctor = require('../models/doctorModel'); // นำเข้า Doctor Model

exports.getUserHealthLastWeek = async (req, res) => {
  try {
    const userId = req.auth._id;

    // หา healthinfo ล่าสุดของ user
    const healthInfo = await HealthInfo.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!healthInfo) return res.status(404).json({ message: 'Health info not found' });

    const healthInfoId = healthInfo._id;

    // คำนวณวันย้อนหลัง 7 วัน
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // ดึง records ที่สร้างใน 7 วันที่ผ่านมา
    const recentRecords = await Record.find({
      healthinfo: healthInfoId,
      recordtime: { $gte: oneWeekAgo }
    }).sort({ recordtime: -1 });;

    // ตรวจสอบว่าข้อมูลครบหรือไม่
    let hasBloodSugar = false;
    let hasA1C = false;
    let hasBP = false;

    recentRecords.forEach(record => {
      if (record.bloodsugar !== undefined) hasBloodSugar = true;
      if (record.a1c !== undefined) hasA1C = true;
      if (record.bloodpressure?.systolic && record.bloodpressure?.diastolic) hasBP = true;
    });

    // ถ้ายังไม่ครบทุกข้อมูลที่ต้องการ
    if (!(hasBloodSugar && hasA1C && hasBP)) {
      return res.status(400).json({
        message: 'ไม่พบข้อมูลสุขภาพครบทุกประเภทในช่วง 7 วันที่ผ่านมา',
        missing: {
          bloodsugar: !hasBloodSugar,
          a1c: !hasA1C,
          bloodpressure: !hasBP,
        }
      });
    }

    // ดึง moodstatus ล่าสุด 3 ค่า
    const moodStatuses = recentRecords
      .filter(r => r.moodstatus)
      .slice(0, 3)
      .map(r => r.moodstatus);

    // เตรียมข้อมูลเพื่อนำไปใช้กับ AI
    const latestData = {
      gender: healthInfo.gender,
      diabetestype: healthInfo.diabetestype,
      birthdate: healthInfo.birthdate,
      height: healthInfo.height,
      weight: healthInfo.weight,
      bloodsugar: recentRecords.find(r => r.bloodsugar !== undefined)?.bloodsugar,
      a1c: recentRecords.find(r => r.a1c !== undefined)?.a1c,
      systolic: recentRecords.find(r => r.bloodpressure?.systolic)?.bloodpressure.systolic,
      diastolic: recentRecords.find(r => r.bloodpressure?.diastolic)?.bloodpressure.diastolic,
      moodstatus: moodStatuses
    };

    return res.json({
      message: 'ดึงข้อมูลสุขภาพใน 1 สัปดาห์ล่าสุดสำเร็จ',
      data: latestData
    });

  } catch (error) {
    console.error('Error in getUserHealthLastWeek:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
};