const mongoose = require('mongoose');
const HealthInfo = require('../models/healthInfoModel'); // โมเดล healthinfo
const Record = require('../models/recordModel');         // โมเดล record
const User = require('../models/userModel'); // นำเข้า User Model
const Doctor = require('../models/doctorModel'); // นำเข้า Doctor Model
const Suggestion = require('../models/suggestionModel');
const Blog = require('../models/blogModel'); // สมมุติว่าโมเดลชื่อ Blog

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
      }).sort({ recordtime: -1 });
  
      // ตรวจสอบว่ามีค่าที่ต้องการหรือไม่
      const bloodSugarRecords = recentRecords.filter(r => r.bloodsugar !== undefined);
      const hasEnoughBloodSugar = bloodSugarRecords.length >= 5;
  
      const hasBP = recentRecords.some(r => r.bloodpressure?.systolic && r.bloodpressure?.diastolic);
      const a1cRecord = recentRecords.find(r => r.a1c !== undefined);
      const hasA1C = !!a1cRecord;
  
      // ถ้ายังไม่ครบทุกข้อมูลที่ต้องการ (ยกเว้น a1c)
      if (!(hasEnoughBloodSugar && hasBP)) {
        return res.status(400).json({
          message: 'ไม่พบข้อมูลสุขภาพครบทุกประเภทในช่วง 7 วันที่ผ่านมา',
          missing: {
            bloodsugar: !hasEnoughBloodSugar,
            bloodpressure: !hasBP,
          }
        });
      }
  
      // คำนวณ HbA1c โดยประมาณถ้าไม่มีค่า a1c
      let estimatedA1C = null;
      if (!hasA1C) {
        const avgBloodSugar = bloodSugarRecords.reduce((sum, r) => sum + r.bloodsugar, 0) / bloodSugarRecords.length;
        estimatedA1C = parseFloat(((avgBloodSugar + 46.7) / 28.7).toFixed(2)); // Official ADAG formula
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
        bloodsugar: bloodSugarRecords[0]?.bloodsugar,
        a1c: hasA1C ? a1cRecord.a1c : estimatedA1C,
        systolic: recentRecords.find(r => r.bloodpressure?.systolic)?.bloodpressure.systolic,
        diastolic: recentRecords.find(r => r.bloodpressure?.diastolic)?.bloodpressure.diastolic,
        moodstatus: moodStatuses
      };
  
      return res.json({
        message: 'ดึงข้อมูลสุขภาพใน 1 สัปดาห์ล่าสุดสำเร็จ',
        data: latestData,
        estimatedA1C: !hasA1C // บอก frontend ว่านี่คือค่าประมาณหรือจริง
      });
  
    } catch (error) {
      console.error('Error in getUserHealthLastWeek:', error);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
  };

// API getSuggestionData
exports.getSuggestionData = async (req, res) => {
  try {
    const userId = req.auth._id;

    const suggestion = await Suggestion.findOne({ user: userId })
      .sort({ createdAt: -1 }) // เอาอันล่าสุด
      .lean();

    if (!suggestion) {
      return res.status(404).json({
        message: 'ไม่พบข้อมูลคำแนะนำสุขภาพของคุณ'
      });
    }

    return res.status(200).json(suggestion);

  } catch (error) {
    console.error('Error fetching suggestion data:', error);
    return res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำแนะนำ',
      error: error.message
    });
  }
};

exports.getUserDiabetesType = async (req, res) => {
  try {
    const userId = req.auth._id;

    const healthInfo = await HealthInfo.findOne({ user: userId });

    if (!healthInfo) {
      return res.status(404).json({ message: 'Health info not found for this user' });
    }

    const diabetesType = healthInfo.diabetestype || 'none';

    return res.status(200).json({ diabetestype: diabetesType });
  } catch (error) {
    console.error('Error fetching diabetes type:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRandomBlogFromCategory = async (req, res) => {
  try {
    const category = req.params.category;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // ใช้ aggregate เพื่อสุ่ม blog จาก category ที่ระบุ
    const randomBlog = await Blog.aggregate([
      { $match: { category: category } },
      { $sample: { size: 1 } }
    ]);

    if (randomBlog.length === 0) {
      return res.status(404).json({ message: 'No blog found in this category' });
    }

    res.status(200).json(randomBlog[0]);
  } catch (error) {
    console.error('Error getting random blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};