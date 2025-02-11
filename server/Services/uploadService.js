const dotenv = require('dotenv');
const fs = require("fs")
const AWS = require('aws-sdk');

dotenv.config()
// ตั้งค่า AWS SDK
const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 Endpoint
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
    region: "auto",
    signatureVersion: 'v4',
});

module.exports = {
    uploadToR2: async (filePath, fileName) => {
        const fileStats = fs.statSync(filePath)

        if (fileStats.size > 52428800){
            const file = fs.readFileSync(filePath)
            const params = {
                Bucket: "koomwan-storage",
                Key: fileName,
                Body: file,
            }
            s3.putObject(params, (err,data) =>{
                if (err) {
                    console.error(err)
                }else{
                    console.log(data)
                }
            })
        }else {
            const params = {
                Bucket: "koomwan-storage",
                Key: fileName,
                Body: fs.createReadStream(filePath),
            }
            const data = await s3.upload(params).promise()
            console.log(data)
        }
    }
}