const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { createForumPost, getAllPost, updatePost, deletePost } = require('../controllers/forumController')
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
//CREATE POST || POST
router.post('/createPost' ,requireSignIn, upload.single('image') , createForumPost)
//UPDATE POST || PUT
router.put('/updatePost/:postId',upload.single('image') , updatePost)
//DELETE POST || DELETE
router.delete('/deletePost/:postId',upload.single('image') , deletePost)

//export
module.exports = router