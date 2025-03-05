const blogModel = require("../models/blogModel");

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

module.exports = { getAllBlog, getBlogById };
