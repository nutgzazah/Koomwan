const express = require('express');
const multer = require('multer')
const path = require('path')
const { uploadToR2, deleteFromR2, generateSignedUrl } = require('../Services/uploadService')
const fs = require('fs'); // เพิ่มการ import fs
const crypto = require('crypto'); // เพิ่มการใช้ crypto สำหรับการสร้างอักษรสุ่ม

const router = express.Router();

// ฟังก์ชันสำหรับสร้างชื่อไฟล์
const generateFileName = (file) => {
    const randomString = crypto.randomBytes(3).toString('hex'); // สร้างตัวอักษรสุ่ม 5 ตัว (3 ไบต์ = 6 ตัวอักษร Hex)
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const originalName = path.basename(file.originalname, fileExtension); // เอาชื่อไฟล์เดิมที่ไม่รวมส่วนขยาย

    // กำหนด pattern สำหรับชื่อไฟล์ตามประเภท
    if (fileExtension === '.pdf') {
        return `koomwan-${originalName}-${timestamp}-${randomString}-doc${fileExtension}`;
    } else if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
        return `koomwan-${originalName}-${timestamp}-${randomString}-img${fileExtension}`;
    } else {
        return `koomwan-${originalName}-${timestamp}-${randomString}${fileExtension}`; // กรณีอื่นๆ
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

// อัปโหลดรูปภาพหรือไฟล์ PDF ไปยัง R2 to uploads
router.post('/uploadFile', upload.single('file'), async (req, res) => {
    try{
        const R2filePath = await uploadToR2(req.file.path, req.file.filename, req.body.folder)

        // ลบไฟล์หลังจากอัปโหลดไป R2 เสร็จแล้ว
        fs.unlinkSync(req.file.path);

        // ส่งข้อมูล path ที่อัปโหลดไปกลับไปยัง client
        res.json({ R2filePath: R2filePath });
    }catch (error){
        res.status(500).send("Error processing file:"+ error.message)
    }
});

// ลบไฟล์จาก Cloudflare R2
router.delete('/deleteFile', async (req, res) => {
    const { folder,fileName } = req.body;

    try {
        await deleteFromR2(folder,fileName); // ลบไฟล์จาก R2
        res.send("File deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting file: " + error.message);
    }
});

//รับ url file
router.get("/getFileUrl", async (req, res) => {
    try {
      const { fileName, folder } = req.query;
      const bucket = process.env.R2_BUCKET_NAME;
      const fileKey = `${folder}/${fileName}`;
      
      const signedUrl = await generateSignedUrl(bucket, fileKey);
      res.json({ success: true, url: signedUrl });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;
