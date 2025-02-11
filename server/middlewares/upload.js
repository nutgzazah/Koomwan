require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// ตั้งค่า AWS SDK
const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 Endpoint
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
    signatureVersion: 'v4',
});

// กำหนดการอัปโหลดไฟล์ด้วย Multer
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.R2_BUCKET_NAME,
        acl: 'public-read', // ให้ไฟล์สามารถเข้าถึงได้แบบสาธารณะ
        contentType: multerS3.AUTO_CONTENT_TYPE, // กำหนด MIME Type อัตโนมัติ
        key: (req, file, cb) => {
            const fileName = `uploads/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // จำกัดขนาดไฟล์ที่ 10MB
});

const deleteFile = async (fileKey) => {
    try {
        await s3.deleteObject({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileKey
        }).promise();
        console.log('File deleted:', fileKey);
    } catch (error) {
        console.error('Delete failed:', error);
    }
};


module.exports = {upload, deleteFile};
