const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { getUserByUsername, getAllUser, getAllDoctor, getDoctorById, editStatusDoctor } = require('../controllers/adminController');
const { addBlog, getAllBlog, getBlogById, editBlog, deleteBlog } = require('../controllers/adminBlogController');
const { sentReport, getAllRequest, getReportById, editReport } = require('../controllers/adminReportController');
const { getAllReportedPosts, getReportedPostById, ApprovePost, deletePost } = require('../controllers/adminForumController');
const multer = require('multer');

// ตั้งค่าอัปโหลดไฟล์ (ใช้หน่วยความจำแทน disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.post("/addBlog", upload.single('image'), addBlog);
router.get("/blog", getAllBlog);
router.get("/blog/:id", getBlogById);
router.put("/editBlog/:id", upload.single('image'), editBlog);
router.delete("/deleteBlog/:id", upload.single('image') , deleteBlog);

// Forum
router.get("/forum/reported", getAllReportedPosts);
router.get("/forum/reported/:id", getReportedPostById);
router.put("/forum/approve/:id", ApprovePost);
router.delete("/forum/deletePost/:id", deletePost);

// report
router.post("/addReport",requireSignIn, sentReport);
router.get("/report", getAllRequest);
router.get("/report/:id", getReportById);
router.put("/editReport/response/:id", editReport);

//export
module.exports = router