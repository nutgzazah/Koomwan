const mongoose = require('mongoose');
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

// กดอนุมัติแล้ว reportCount จะถูกรีใหม่เป็น 0 และลบข้อมูล users กับ reasons ที่ report ออก
const ApprovePost = async (req, res) => {
    try {
        const { id } = req.params; // รับ id จาก URL parameter

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const updatedPost = await Forum.findByIdAndUpdate(
            id,
            { 
                $set: { "reports.count": 0 }, // reportCount จะถูกรีใหม่เป็น 0
                $unset: { "reports.reasons": "", "reports.users": "" }  // ลบข้อมูล users กับ reasons ที่ report ออก
            }, 
            { new: true } 
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post approved successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error approving post",
            error: error.message,
        });
    }
};


const deletePost = async (req, res) => { 
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid post ID." });
        }
      
        const deletedPost = await Forum.findByIdAndDelete(id);
      
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        res.status(200).json({ success: true, message: "Post deleted successfully.", post: deletedPost });

    } catch (err) {
        console.error("Error in deletePost:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

module.exports = { getAllReportedPosts, getReportedPostById, ApprovePost, deletePost };
