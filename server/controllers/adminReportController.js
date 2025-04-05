
const helpRequestModel = require("../models/helpRequestModel");
const Notification = require("../models/notificationModel");

// Post new report
const sentReport = async (req, res) => {
    try {
        const { user, title, detail } = req.body;

        // Validate required fields
        if (!user || !title || !detail) {
            return res.status(400).json({ 
                success: false, 
                message: "User, Title and Detail are required." 
            });
        }

        // Create new report entry
        const reportData = { 
            user, 
            title, 
            detail,
        };

        const report = new helpRequestModel(reportData);
        await report.save();

        // Send response
        res.status(201).json({ 
            success: true, 
            message: "report posted successfully.", 
            data: report 
        });

    } catch (error) {
        console.error("Error in addReport:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

const getAllRequest = async (req, res) => {
    try {
        const reports = await helpRequestModel.find().populate('user', 'username');
        return res.status(200).send({
            success: true,
            data: reports,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error fetching reports",
            error,
        });
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await helpRequestModel.findById(id).populate('user', 'username role');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching report data",
            error: error.message,
        });
    }
};

const editReport = async (req, res) => { 
    try {
        const id = req.params.id;
        const { response } = req.body; 

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Report id is required",
            });
        }

        const report = await helpRequestModel.findById(id);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        // ถ้ามี response ที่ไม่ใช่ string เปล่าให้เปลี่ยน status จาก pending เป็น completed
        if (response && response.trim() !== "") {
            report.response = response;
            report.status = "completed";

            // สร้าง notification โดยใช้ข้อมูลจาก report
            const notification = new Notification({
                user: report.user, // ใช้ user จาก report
                title: report.title || 'Report Updated', // ใช้ title จาก report หรือใช้ชื่อเริ่มต้น
                detail: response, // ใช้ response เป็นรายละเอียดของ notification
                notificationType: 'general', // ประเภทของการแจ้งเตือน
                helpRequest: report._id,
            });

            // บันทึก notification
            await notification.save();
        }

        await report.save();

        return res.status(200).json({
            success: true,
            message: `Report updated successfully`,
            data: report,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating report status",
            error: error.message,
        });
    }
};





module.exports = { sentReport, getAllRequest, getReportById, editReport };
