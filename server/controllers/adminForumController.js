const Forum = require('../models/forumModel');

// ดึงโพสต์ที่ reportCount > 0
const getAllReportedPosts = async (req, res) => {
    try {
        const reportedPosts = await Forum.find({ "reports.count": { $gt: 0 } })
            .populate('postedBy', 'username') // ✅ ใช้ username จาก User Model
            .populate('reports.reasons.user', 'username') // ✅ แก้ populate ให้ถูกต้อง
            .sort({ createdAt: -1 });
        
        res.status(200).json(reportedPosts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getReportedPostById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Forum ID is required",
            });
        }

        const forumPost = await Forum.findById(id)
            .populate('postedBy', 'username') // ✅ ดึง username ของผู้โพสต์
            .populate('reports.reasons.user', 'username'); // ✅ ดึง username ของผู้รายงาน

        if (!forumPost) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: forumPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching forum data",
            error: error.message,
        });
    }
};

module.exports = { getAllReportedPosts, getReportedPostById };
