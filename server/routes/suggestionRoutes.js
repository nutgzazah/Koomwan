const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const multer = require('multer');
const { getUserHealthLastWeek, getSuggestionData, getUserDiabetesType, getRandomBlogFromCategory } = require('../controllers/suggestionController');

// ตั้งค่าอัปโหลดไฟล์ (ใช้หน่วยความจำแทน disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//router object
const router = express.Router()

//ROUTES

//GETUserHealthLastWeek || GET
router.get('/getUserHealthLastWeek',requireSignIn , getUserHealthLastWeek)
router.get('/getSuggestionData',requireSignIn , getSuggestionData)
router.get('/getUserDiabetesType',requireSignIn , getUserDiabetesType)
router.get('/getRandomBlogFromCategory/:category', getRandomBlogFromCategory)

//export
module.exports = router