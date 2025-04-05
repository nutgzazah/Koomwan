const mongoose = require('mongoose');
const Forum = require('../models/forumModel'); // นำเข้า Forum Model
const User = require('../models/userModel'); // นำเข้า User Model
const Doctor = require('../models/doctorModel'); // นำเข้า Doctor Model
const Notification = require('../models/notificationModel'); 
const { uploadToR2v2, deleteFromR2 } = require('../Services/uploadService');

// Create a new forum post
exports.createForumPost = async (req, res) => {
    try {
        const { title, image } = req.body;
        const postedBy = req.auth._id; // รับ _id ของผู้ใช้ที่ล็อกอิน
        let imageUrl = '';
        
        // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
        if (!req.auth || !req.auth._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // ถ้ามีไฟล์แนบ ให้ทำการอัปโหลดไปยัง R2
        if (req.file) {
            imageUrl = await uploadToR2v2(req.file.buffer, req.file.originalname, 'forumImage');
        }


        const newPost = new Forum({
            postedBy,
            title,
            image: imageUrl
        });

        await newPost.save();
        res.status(201).json({ message: "Forum post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// ดึงโพสต์ทั้งหมด
exports.getDoctorInfo = async (req, res) => {
    try {
        const { doctorId } = req.query;
    
        if (!doctorId) {
          return res.status(400).json({ error: "Doctor ID is required" });
        }
    
        const doctor = await Doctor.findById(doctorId).select("firstname lastname image hospital expert occupation email document");
    
        if (!doctor) {
          return res.status(404).json({ error: "Doctor not found" });
        }
    
        res.status(200).json({
            firstname: doctor.firstname,
            lastname: doctor.lastname,
            image: doctor.image,
            hospital: doctor.hospital,
            expert: doctor.expert,
            occupation: doctor.occupation,
            email: doctor.email,
            document: doctor.document
          });
  
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};



// ดึงโพสต์ทั้งหมด
exports.getAllPost = async (req, res) => {
    try {
        const posts = await Forum.find().populate('postedBy', 'username image')
        .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params; // รับค่า id จาก URL parameters
        const post = await Forum.findById(id).populate('postedBy', 'username image');
        
        if (!post) {
            return res.status(404).json({ error: "Post not found "+id });
        }
        
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get all forums created by the authenticated user
exports.getMyForum = async (req, res) => {
    try {
        
        const userId = req.auth._id; // ใช้ userId จาก req.auth._id
        console.log(userId)
        // ค้นหาโพสต์ที่ถูกโพสต์โดย userId นี้
        const forums = await Forum.find({ postedBy: userId })
            .sort({ createdAt: -1 }) // เรียงจากใหม่ไปเก่า
            .populate('postedBy', 'name') // ดึงชื่อของผู้โพสต์

        if (forums.length === 0) {
            return res.status(404).json({ message: 'No forums found' });
        }

        res.status(200).json({
            message: 'My forums retrieved successfully',
            forums
        });
    } catch (error) {
        console.error('Error fetching my forums:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// อัปเดตโพสต์
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title } = req.body;
        let imageUrl = '';

        const post = await Forum.findById(postId);
        console.log(post)
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // ถ้ามีอัปโหลดไฟล์ใหม่ ให้ลบไฟล์เก่าจาก R2 ก่อน
        if (req.file) {
            if (post.image) {
                const oldImageName = post.image.split('/').pop(); // ดึงชื่อไฟล์เก่า
                console.log("this is old img name: ",oldImageName)
                await deleteFromR2('forumImage', oldImageName);
            }
            imageUrl = await uploadToR2v2(req.file.buffer, req.file.originalname, 'forumImage');
        }

        post.title = title || post.title;
        if (imageUrl) post.image = imageUrl;

        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// ลบโพสต์
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // ลบรูปจาก R2 ถ้ามี
        if (post.image) {
            const imageName = post.image.split('/').pop();
            await deleteFromR2('forumImage', imageName);
        }

        await Forum.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

//ตรวจสอบว่า userId ได้กดไลค์ postId หรือไม่
exports.isLiked = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.auth._id;

        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const isLiked = post.likes.users.includes(userId);
        const likes = post.likes.users.length; // ดึงจำนวนไลค์ทั้งหมด
        return res.json({ isLiked, likes });
    } catch (error) {
        console.error("Error checking like status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


//กดไลค์/ลบไลค์
exports.toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.auth._id;

        // Find the forum post
        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has already liked the post
        const hasLiked = post.likes.users.includes(userId);

        if (hasLiked) {
            // Unlike the post
            post.likes.users = post.likes.users.filter(id => id.toString() !== userId.toString());
            post.likes.count -= 1;
        } else {
            // Like the post
            post.likes.users.push(userId);
            post.likes.count += 1;
        }

        // Save changes
        await post.save();

        res.status(200).json({
            message: hasLiked ? 'Like removed' : 'Post liked',
            likes: post.likes.count,
            users: post.likes.users
        });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// เพิ่มคอมเมนต์
exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.auth._id; 
        const { answer } = req.body;

        if (!answer || answer.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        // ค้นหาโพสต์
        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ตรวจสอบว่ามี `postedBy` หรือไม่
        if (!post.postedBy) {
            return res.status(500).json({ message: 'Post owner not found' });
        }

        // ตรวจสอบว่า user เป็นเจ้าของโพสต์หรือไม่
        const isPostOwner = post.postedBy.toString() === userId;

        // ตรวจสอบว่า user เป็นหมอหรือไม่ (ถ้าใช้ `Doctor` collection)
        const isDoctor = req.auth.role === 'doctor';

        // ถ้าไม่ใช่เจ้าของโพสต์ และไม่ใช่หมอ → ห้ามคอมเมนต์
        if (!isPostOwner && !isDoctor) {
            return res.status(403).json({ message: 'You are not allowed to comment on this post' });
        }

        // เพิ่มคอมเมนต์
        const newComment = {
            commenter: userId,
            commenterModel: isPostOwner ? 'User' : 'Doctor', // เจ้าของโพสต์เป็น 'User'
            role: isPostOwner ? 'owner' : 'doctor',
            answer,
            date: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        // ✅ ถ้าคนคอมเมนต์เป็นหมอ → ส่ง noti ให้เจ้าของโพสต์
        if (isDoctor) {
            await Notification.create({
                user: post.postedBy,
                title: "หมอได้ตอบคำถามของคุณแล้ว",
                detail: answer.length > 100 ? answer.slice(0, 100) + '...' : answer,
                notificationType: "forum",
                forum: post._id, // ✅ เพิ่มตรงนี้เพื่อเชื่อมกับ Forum post
                isRead: false
            });
        }

        res.status(201).json({
            message: 'Comment added successfully',
            comments: post.comments
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// ลบคอมเมนต์
exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.auth._id; // ใช้ req.auth._id เป็น userId

        // ค้นหาโพสต์
        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ค้นหาคอมเมนต์
        const commentIndex = post.comments.findIndex(
            (comment) => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comment = post.comments[commentIndex];

        // ตรวจสอบว่าเป็นเจ้าของคอมเมนต์หรือไม่
        if (comment.commenter.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        // ลบคอมเมนต์
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({
            message: 'Comment deleted successfully',
            comments: post.comments
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Report a post
exports.reportPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { reason } = req.body;
        const userId = req.auth._id;

        // ตรวจสอบว่า postId เป็น ObjectId ที่ถูกต้องหรือไม่
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Post not found / Invalid post ID format' });
        }

        // ค้นหาโพสต์
        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ตรวจสอบว่าผู้ใช้เคย report โพสต์นี้แล้วหรือไม่
        if (post.reports.users.includes(userId)) {
            return res.status(400).json({ message: 'You have already reported this post' });
        }

        // เพิ่มการ report
        post.reports.count += 1;
        post.reports.users.push(userId);
        post.reports.reasons.push({ user: userId, reason });

        await post.save();

        res.status(200).json({
            message: 'Post reported successfully',
            reports: post.reports
        });
    } catch (error) {
        console.error('Error reporting post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove all reports from a post
exports.removeReports = async (req, res) => {
    try {
        const { postId } = req.params;

        // ตรวจสอบว่า postId เป็น ObjectId ที่ถูกต้องหรือไม่
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Post not found / Invalid post ID format' });
        }

        // ค้นหาโพสต์
        const post = await Forum.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ล้างข้อมูล report ทั้งหมด
        post.reports = {
            count: 0,
            users: [],
            reasons: []
        };

        await post.save();

        res.status(200).json({
            message: 'Reports removed successfully',
            reports: post.reports
        });
    } catch (error) {
        console.error('Error removing reports:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//เอารูปออกจาก Post