const express = require("express");
const { requireSignIn } = require("../controllers/authController");
const {
  generateDailyPillTrackings,
  updatePillStatus,
  getPillTrackingsByDate,
  getPillTrackingsByDateRange,
  updateMissedMedications,
  createPillNotifications,
  getPillAdherenceStats,
} = require("../controllers/regularPillTrackingController");

const router = express.Router();

//ROUTES

// สร้างรายการติดตามการทานยาประจำวัน
router.post("/generate", requireSignIn, generateDailyPillTrackings);

// อัปเดตสถานะการทานยา
router.post("/update-status", requireSignIn, updatePillStatus);

// ดึงรายการติดตามการทานยาตามวันที่
router.get("/daily/:userId", requireSignIn, getPillTrackingsByDate);

// ดึงรายการติดตามการทานยาสำหรับช่วงวันที่
router.get("/range/:userId", requireSignIn, getPillTrackingsByDateRange);

// อัปเดตสถานะยาที่ไม่ได้ทานให้เป็น 'missed' (เรียกโดย cron job)
router.post("/update-missed", updateMissedMedications);

// สร้างการแจ้งเตือนสำหรับยาที่ถึงเวลาทาน (เรียกโดย cron job)
router.post("/create-notifications", createPillNotifications);

// ดึงสถิติการทานยา
router.get("/adherence/:userId", requireSignIn, getPillAdherenceStats);

module.exports = router;
