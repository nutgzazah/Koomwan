const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { createForumPost, getAllPost, updatePost, deletePost, toggleLikePost, addComment, deleteComment, reportPost, removeReports, getMyForum, getUsernameAndPicByObjId, getDoctorInfoByObjId, getDoctorInfo, getPostById, isLiked } = require('../controllers/forumController')
const multer = require('multer');

// ตั้งค่าอัปโหลดไฟล์ (ใช้หน่วยความจำแทน disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//router object
const router = express.Router()

//ROUTES


//POST
//GETALL POST || GET
router.get('/getAllPost' , getAllPost)
router.get('/getMyPost' ,requireSignIn, getMyForum)
router.get('/getDoctorInfo' , getDoctorInfo)
router.get('/getPostById/:id' , getPostById)
router.get('/isLiked/:postId' ,requireSignIn, isLiked)

//CREATE POST || POST
router.post('/createPost' ,requireSignIn, upload.single('image') , createForumPost)

//UPDATE POST || PUT
router.put('/updatePost/:postId',upload.single('image') , updatePost)

//DELETE POST || DELETE
router.delete('/deletePost/:postId',upload.single('image') , deletePost)


//Comment
//กดไลค์ || POST
router.post('/like/:postId', requireSignIn, toggleLikePost);

//เพิ่มคอมเม้น || POST
router.post('/comment/:postId', requireSignIn, addComment);

//ลบคอมเม้น || DELETE
router.delete('/comment/:postId/:commentId', requireSignIn, deleteComment);

//Report
// Report a post || POST
router.post('/report/:postId', requireSignIn, reportPost);
// Remove All Reports || POST
router.post('/report/removeReport/:postId', requireSignIn, removeReports);

//export
module.exports = router