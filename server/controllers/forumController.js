const Forum = require('../models/forumModel'); // นำเข้า Forum Model
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
exports.getAllPost = async (req, res) => {
    try {
        const posts = await Forum.find().populate('postedBy', 'name').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
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

//เอารูปออกจาก Post