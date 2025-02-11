const express = require('express');
const upload = require('../middlewares/upload');
const router = express.Router();

// อัปโหลดรูปภาพหรือไฟล์ PDF ไปยัง R2
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    return res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        fileUrl: req.file.location, // URL ของไฟล์ที่อัปโหลด
    });
});

router.delete('/delete', async (req, res) => {
    const { fileKey } = req.body; // รับค่า key ของไฟล์ที่ต้องการลบ

    if (!fileKey) {
        return res.status(400).json({ success: false, message: 'File key is required' });
    }

    try {
        await deleteFile(fileKey);
        return res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting file', error });
    }
});


module.exports = router;
