// routes/api/auth/send-otp.ts
const { Router } = require('express');
const dotenv = require('dotenv');
const twilio = require('twilio')
const Otp = require('../models/otpModel');

dotenv.config();

const router = Router();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function normalizeThaiPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, ''); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
    if (cleaned.startsWith('0')) {
      return '+66' + cleaned.slice(1);
    } else if (cleaned.startsWith('66')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('+66')) {
      return cleaned;
    } else {
      throw new Error('Invalid Thai phone number format.');
    }
  }
  

  router.post('/send-otp', async (req, res) => {
    let { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required.' });
  
    try {
      phoneNumber = normalizeThaiPhoneNumber(phoneNumber); // ✅ แปลงเบอร์ก่อนใช้งาน
  
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
      const existingOtp = await Otp.findOne({ phoneNumber, verified: false });
      if (existingOtp) await existingOtp.deleteOne();

      console.log('Sending SMS to:', phoneNumber);
  
      await twilioClient.messages.create({
        body: `Your verification code is ${otpCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
  
      await Otp.create({ phoneNumber, otp: otpCode, expiresAt });
  
      res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ message: 'Failed to send OTP.' });
    }
  });
  
  router.post('/verify-otp', async (req, res) => {
    let { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) return res.status(400).json({ message: 'Phone number and OTP are required.' });
  
    try {
      phoneNumber = normalizeThaiPhoneNumber(phoneNumber); // ✅ แปลงเบอร์ก่อนใช้งาน
  
      const record = await Otp.findOne({ phoneNumber, otp, verified: false });
  
      if (!record) return res.status(400).json({ message: 'Invalid OTP.' });
      if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired.' });
  
      record.verified = true;
      await record.save();
      await record.deleteOne();
  
      res.json({ message: 'OTP verified successfully.' });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ message: 'Failed to verify OTP.' });
    }
  });

//export
module.exports = router
