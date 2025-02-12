const express = require('express');
const multer = require('multer')
const path = require('path')
const { uploadToR2, deleteFromR2 } = require('../Services/uploadService')
const fs = require('fs'); // เพิ่มการ import fs
const crypto = require('crypto'); // เพิ่มการใช้ crypto สำหรับการสร้างอักษรสุ่ม

const router = express.Router();

// ฟังก์ชันสำหรับสร้างชื่อไฟล์
const generateFileName = (file) => {
    const randomString = crypto.randomBytes(3).toString('hex'); // สร้างตัวอักษรสุ่ม 5 ตัว (3 ไบต์ = 6 ตัวอักษร Hex)
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // กำหนด pattern สำหรับชื่อไฟล์ตามประเภท
    if (fileExtension === '.pdf') {
        return `koomwan-${timestamp}-${randomString}-doc${fileExtension}`;
    } else if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
        return `koomwan-${timestamp}-${randomString}-img${fileExtension}`;
    } else {
        return `koomwan-${timestamp}-${randomString}${fileExtension}`; // กรณีอื่นๆ
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "uploads/")
    },
    filename: function (req, file, cb){
        const newFileName = generateFileName(file); // ใช้ฟังก์ชัน generateFileName
        cb(null, newFileName); // ตั้งชื่อไฟล์ใหม่
    },
})

const upload = multer({ storage: storage})

// อัปโหลดรูปภาพหรือไฟล์ PDF ไปยัง R2
router.post('/uploadFile', upload.single('file'), async (req, res) => {
    try{
        await uploadToR2(req.file.path, req.file.filename)

        // ลบไฟล์หลังจากอัปโหลดไป R2 เสร็จแล้ว
        fs.unlinkSync(req.file.path);

        res.send("File uploaded and processed successfully")
    }catch (error){
        res.status(500).send("Error processing file:"+ error.message)
    }
});

// ลบไฟล์จาก Cloudflare R2
router.delete('/deleteFile', async (req, res) => {
    const { fileName } = req.body;

    try {
        await deleteFromR2(fileName); // ลบไฟล์จาก R2
        res.send("File deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting file: " + error.message);
    }
});

module.exports = router;
