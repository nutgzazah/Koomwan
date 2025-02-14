const blogModel = require("../models/blogModel");

// Post new blog
const addBlog = async (req, res) => {
    try {
        const { title, content, image, category, ref } = req.body;

        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, content, and category are required." 
            });
        }

        // Create new blog entry
        const blogData = { 
            title, 
            content, 
            image, 
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
            message: "Error fetching users",
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
  
      const updatedBlog = await blogModel.findByIdAndUpdate( 
        id,
        updateBlog,
        { new: true, runValidators: true }
      );
  
      res.json({ message: 'Update Blog complete!', menu: updatedBlog }); 
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const deleteBlog = async (req, res) => { 
    try {
        const { id } = req.params;
      
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
