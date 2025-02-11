const dotenv = require('dotenv');
const fs = require("fs");
const { S3Client, PutObjectCommand, DeleteObjectCommand,  HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage'); // นำเข้า Upload

dotenv.config();

const s3 = new S3Client({
    endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 Endpoint
    region: 'auto',
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
    },
});

module.exports = {
    uploadToR2: async (filePath, fileName) => {
        const fileStats = fs.statSync(filePath);

        const params = {
            Bucket: 'koomwan-storage',
            Key: fileName,
            Body: fs.createReadStream(filePath),  // ใช้ Stream
        };

        // ใช้ Upload สำหรับทั้งไฟล์ขนาดเล็กและขนาดใหญ่
        try {
            const upload = new Upload({
                client: s3,
                params: params,
            });
            const data = await upload.done(); // ทำการอัปโหลดไฟล์
            console.log(data);
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    },

    deleteFromR2: async (fileName) => {
        const params = {
            Bucket: "koomwan-storage",
            Key: fileName,
        };

        try {
            // ตรวจสอบว่าไฟล์มีอยู่ใน Cloudflare R2 ก่อนที่จะลบ
            const headParams = {
                Bucket: "koomwan-storage",
                Key: fileName,
            };

            // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
            await s3.send(new HeadObjectCommand(headParams)); // ถ้าไฟล์ไม่มีจะเกิด error

            // ถ้าไฟล์มีอยู่ ก็สามารถลบได้
            const data = await s3.send(new DeleteObjectCommand(params));
            console.log("File deleted successfully:", data);
            return data;

        } catch (error) {
            if (error.name === 'NotFound') {
                console.error(`File not found: ${fileName}`);
                throw new Error(`File ${fileName} not found in R2`);
            } else {
                console.error("Error deleting file:", error);
                throw new Error("Error deleting file from R2");
            }
        }
    }
};
