const express = require('express');
const multer = require('multer')
const path = require('path')
const { uploadToR2 } = require('../Services/uploadService')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "uploads/")
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const upload = multer({ storage: storage})

// อัปโหลดรูปภาพหรือไฟล์ PDF ไปยัง R2
router.post('/uploadFile', upload.single('file'), async (req, res) => {
    try{
        await uploadToR2(req.file.path, req.file.filename)
        res.send("File uploaded and processed successfully")
    }catch (error){
        res.status(500).send("Error processing file:"+ error.message)
    }
});

module.exports = router;
