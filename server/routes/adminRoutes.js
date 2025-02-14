const express = require('express')
const { getUserByUsername, getAllUser, getAllDoctor, getDoctorById, editStatusDoctor } = require('../controllers/adminController')
const { addBlog, getAllBlog, getBlogById, editBlog, deleteBlog } = require('../controllers/adminBlogController')

//router object
const router = express.Router()

//routes

//USER data|| GET
router.get("/user", getAllUser);
router.get("/doctor", getAllDoctor);
router.get("/user/:username", getUserByUsername);
router.get("/doctor/:id", getDoctorById);
router.put('/doctor/status/:id', editStatusDoctor);

// Blog data
router.post("/addBlog", addBlog);
router.get("/blog", getAllBlog);
router.get("/blog/:id", getBlogById);
router.put("/editBlog/:id", editBlog);
router.delete("/deleteBlog/:id", deleteBlog);


//export
module.exports = router