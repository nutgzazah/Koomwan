const userModel = require("../models/userModel");
const healthInfoModel = require("../models/healthInfoModel");

// ฟังก์ชันเช็คว่า userId มี healthinfo แล้วหรือยัง
const checkHealthInfoExists = async (userId) => {
    try {
        // ค้นหาผู้ใช้จาก userId
        const user = await userModel.findById(userId);

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        // เช็คว่า user มี healthinfo หรือไม่
        if (user.healthinfo) {
            return { status: 400, message: "Health information already exists for this user" };
        } else {
            return { status: 200, message: "No health information found for this user" };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error checking health information" };
    }
};

// beginnerSetup
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

        // อัปเดต userModel ด้วย healthinfo ObjectId
        const userExists = await userModel.findById(userId);
        userExists.healthinfo = savedHealthInfo._id;
        await userExists.save();

        return res.status(201).json({ success: true, message: "Health information saved successfully", healthInfoId: savedHealthInfo._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error saving health information", error });
    }
};

module.exports = { beginnerSetup, checkHealthInfoExists };
