const mongoose = require('mongoose');
const blogModel = require("../models/blogModel");
const { uploadToR2v2, deleteFromR2 } = require('../Services/uploadService');

// Post new blog
const addBlog = async (req, res) => {
    try {
        const { title, content, category, ref } = req.body;
        let imageUrl = '';

        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, content, and category are required." 
            });
        }

        // ถ้ามีไฟล์แนบ ให้ทำการอัปโหลดไปยัง R2
        if (req.file) {
            imageUrl = await uploadToR2v2(req.file.buffer, req.file.originalname, 'blogImage');
        }

        // Create new blog entry
        const blogData = { 
            title, 
            content, 
            image: imageUrl, 
            category, 
            ref 
        };

        const blog = new blogModel(blogData);
        await blog.save();

        // Send response
        res.status(201).json({ 
            success: true, 
            message: "Blog posted successfully.", 
            data: blog 
        });

    } catch (error) {
        console.error("Error in addBlog:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

const getAllBlog = async (req, res) => {
    try {
        const blogs = await blogModel.find()
        return res.status(200).send({
            success: true,
            data: blogs,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error fetching blogs",
            error,
        });
    }
};

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await blogModel.findById(id)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching blog data",
            error: error.message,
        });
    }
};

const editBlog = async (req, res) => { 
    try {
        const id = req.params.id;
        const updateBlog = req.body; 
        let imageUrl = '';

        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // ถ้ามีอัปโหลดไฟล์ใหม่ ให้ลบไฟล์เก่าจาก R2 ก่อน
        if (req.file) {
            if (blog.image) {
                const oldImageName = blog.image.split('/').pop(); // Extract old filename
                await deleteFromR2('blogImage', oldImageName);
            }
            imageUrl = await uploadToR2v2(req.file.buffer, req.file.originalname, 'blogImage');
            updateBlog.image = imageUrl; // Update new image URL in update data
        }

        // อัปเดตข้อมูล Blog
        blog.set(updateBlog);

        await blog.save();
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }  
};


const deleteBlog = async (req, res) => { 
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID." });
        }

        const blog = await blogModel.findById( id );

        if(!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
                
        // ลบรูปจาก R2 ถ้ามี
        if (blog.image) {
            const imageName = blog.image.split('/').pop();
            await deleteFromR2('blogImage', imageName);
        }
      
        const deletedBlog = await blogModel.findByIdAndDelete(id);
      
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found." });
        }

        res.status(200).json({ success: true, message: "Blog deleted successfully.", blog: deletedBlog });

    } catch (err) {
        console.error("Error in deleteBlog:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

module.exports = { addBlog, getAllBlog, getBlogById, editBlog, deleteBlog };
