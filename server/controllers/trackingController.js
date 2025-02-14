const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const healthInfoModel = require("../models/healthInfoModel");
const recordModel = require('../models/recordModel');

//TRACKING
//GET
const getRecord = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // ค้นหาข้อมูล healthinfo จาก userModel หรือ doctorModel
        let user = await userModel.findById(userId);
        if (!user) {
            user = await doctorModel.findById(userId);
        }

        if (!user || !user.healthinfo) {
            return res.status(404).json({ success: false, message: "User health information not found" });
        }

        // ค้นหา Record ทั้งหมดที่เกี่ยวข้องกับ healthinfo ของผู้ใช้
        const records = await recordModel.find({ healthinfo: user.healthinfo });

        if (!records.length) {
            return res.status(404).json({ success: false, message: "No health records found" });
        }

        return res.status(200).json({ success: true, records });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error retrieving health records", error });
    }
};


//ADD
const addRecord = async (req, res) => {
    try {
        const { userId, height, weight, bloodsugar, a1c, bloodpressure, moodstatus, additionpill, recordtime } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // ค้นหาผู้ใช้จาก userModel หรือ doctorModel
        let user = await userModel.findById(userId);
        if (!user) {
            user = await doctorModel.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ตรวจสอบว่า user มี healthinfo หรือไม่
        if (!user.healthinfo) {
            return res.status(400).json({ success: false, message: "User does not have health information" });
        }

        // หากไม่มี recordtime ให้ใช้เวลาปัจจุบัน
        const recordTime = recordtime || new Date();

        // สร้าง Record ใหม่
        const newRecord = new recordModel({
            healthinfo: user.healthinfo, // เชื่อมโยงกับ HealthInfo ของ user
            height,
            weight,
            bloodsugar,
            a1c,
            bloodpressure,
            moodstatus,
            additionpill,
            recordtime: recordTime // บันทึกเวลา
        });

        // บันทึก Record
        const savedRecord = await newRecord.save();

        // อัปเดต height และ weight ใน healthInfoModel
        try {
            await healthInfoModel.findByIdAndUpdate(user.healthinfo, {
                $set: { height, weight }
            });
        } catch (updateError) {
            console.error("Error updating healthInfoModel:", updateError);
            // ไม่ต้อง return error ตรงนี้ เพื่อให้ API ยังคงตอบกลับ success ได้
        }

        return res.status(201).json({ success: true, message: "Health record saved successfully", record: savedRecord });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error saving health record", error });
    }
};

//UPDATE
const updateRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { height, weight, bloodsugar, a1c, bloodpressure, moodstatus, additionpill, recordtime } = req.body;

        if (!recordId) {
            return res.status(400).json({ success: false, message: "Record ID is required" });
        }

        // ค้นหา Record ที่ต้องการอัปเดต
        const record = await recordModel.findById(recordId);
        if (!record) {
            return res.status(404).json({ success: false, message: "Health record not found" });
        }

        // อัปเดตค่าต่างๆ ถ้ามีการส่งมาใน request
        if (height !== undefined) record.height = height;
        if (weight !== undefined) record.weight = weight;
        if (bloodsugar !== undefined) record.bloodsugar = bloodsugar;
        if (a1c !== undefined) record.a1c = a1c;
        if (bloodpressure !== undefined) record.bloodpressure = bloodpressure;
        if (moodstatus !== undefined) record.moodstatus = moodstatus;
        if (additionpill !== undefined) record.additionpill = additionpill;

        // ถ้ามีการส่ง recordtime มาให้ อัปเดตเวลา
        if (recordtime !== undefined) record.recordtime = recordtime;

        // บันทึกการเปลี่ยนแปลง
        const updatedRecord = await record.save();

        return res.status(200).json({ success: true, message: "Health record updated successfully", record: updatedRecord });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error updating health record", error });
    }
};

//DELETE
const deleteRecord = async (req, res) => {
    try {
        const { recordId } = req.params;

        if (!recordId) {
            return res.status(400).json({ success: false, message: "Record ID is required" });
        }

        // ค้นหาและลบ Record
        const deletedRecord = await recordModel.findByIdAndDelete(recordId);
        if (!deletedRecord) {
            return res.status(404).json({ success: false, message: "Health record not found" });
        }

        return res.status(200).json({ success: true, message: "Health record deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error deleting health record", error });
    }
};


module.exports = { getRecord ,addRecord, updateRecord, deleteRecord };