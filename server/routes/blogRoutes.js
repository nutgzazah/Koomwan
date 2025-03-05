const express = require('express')
const { getAllBlog, getBlogById } = require('../controllers/adminBlogController');

//router object
const router = express.Router()

//routes

// Blog data
router.get("/allBlog", getAllBlog);
router.get("/:id", getBlogById);


//export
module.exports = router