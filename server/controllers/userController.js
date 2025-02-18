const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const healthInfoModel = require("../models/healthInfoModel");


//BEGINNER SETUp
// ฟังก์ชันเช็คว่า userId มี healthinfo แล้วหรือยัง (รองรับทั้ง userModel และ doctorModel)
const checkHealthInfoExists = async (userId) => {
    try {
        // ค้นหา userId จากทั้ง userModel และ doctorModel
        let user = await userModel.findById(userId);
        let userType = "user";

        if (!user) {
            user = await doctorModel.findById(userId);
            userType = "doctor";
        }

        // ถ้าไม่พบทั้งใน userModel และ doctorModel
        if (!user) {
            return { status: 404, message: "User not found in system" };
        }

        // เช็คว่า user มี healthinfo หรือไม่
        if (user.healthinfo) {
            return { status: 400, message: `${userType} already has health information` };
        } else {
            return { status: 200, message: `${userType} does not have health information` };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error checking health information" };
    }
};

// ฟังก์ชันบันทึก healthinfo ใหม่ (รองรับทั้ง userModel และ doctorModel)
const beginnerSetup = async (req, res) => {
    try {
        const { userId, diabetestype, gender, birthdate, height, weight, regularpill } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // เช็คว่า userId มี healthinfo แล้วหรือยัง
        const healthInfoCheck = await checkHealthInfoExists(userId);
        if (healthInfoCheck.status !== 200) {
            return res.status(healthInfoCheck.status).json({ success: false, message: healthInfoCheck.message });
        }

        // ถ้ายังไม่มี healthinfo ให้สร้างใหม่
        const newHealthInfo = new healthInfoModel({
            user: userId,
            diabetestype,
            gender,
            birthdate,
            height,
            weight,
            regularpill,
        });

        // บันทึก HealthInfo ใหม่
        const savedHealthInfo = await newHealthInfo.save();

        // ค้นหา user จากทั้ง userModel และ doctorModel
        let user = await userModel.findById(userId);
        if (!user) {
            user = await doctorModel.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found after saving health info" });
        }

        // อัปเดต healthinfo ObjectId ใน user หรือ doctor
        user.healthinfo = savedHealthInfo._id;
        await user.save();

        return res.status(201).json({ success: true, message: "Health information saved successfully", healthInfoId: savedHealthInfo._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error saving health information", error });
    }
};


module.exports = { beginnerSetup, checkHealthInfoExists };
