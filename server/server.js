const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cron = require("node-cron");

//DOTENV
dotenv.config();

//MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//ROUTES
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/suggestion", require("./routes/suggestionRoutes"));
app.use("/api/v1/forum", require("./routes/forumRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/storage", require("./routes/storageRoutes"));
app.use("/api/v1/regular-pills", require("./routes/regularPillTrackingRoutes"));
app.use("/api/v1/ai", require("./routes/aiRoutes"))
app.use("/api/v1/otp", require("./routes/otpRoutes"))

// ตั้งค่า cron jobs สำหรับงานประจำ
const {
  updateMissedMedications,
  generateDailyPillTrackingsForAllUsers,
  createPillNotifications,
} = require("./controllers/regularPillTrackingController");

// อัพเดตสถานะยาที่ไม่ได้ทานให้เป็น 'missed' ทุกวันเวลา 00:05 น.
cron.schedule("5 0 * * *", async () => {
  console.log("Running daily job: updating missed medications");
  try {
    await updateMissedMedications(
      { body: {} },
      {
        status: () => ({
          json: (data) => {
            console.log("Updated missed medications:", data);
          },
        }),
      }
    );
  } catch (error) {
    console.error("Error updating missed medications:", error);
  }
});

// สร้างรายการยาสำหรับวันใหม่ทุกวันเวลา 00:01 น.
cron.schedule("1 0 * * *", async () => {
  console.log("Running daily job: generating pill trackings for all users");
  try {
    await generateDailyPillTrackingsForAllUsers();
  } catch (error) {
    console.error("Error generating pill trackings:", error);
  }
});

// สร้างการแจ้งเตือนสำหรับยาที่ถึงเวลาทานทุก 15 นาที
cron.schedule("*/15 * * * *", async () => {
  console.log("Running notification job");
  try {
    await createPillNotifications(
      { body: {} },
      {
        status: () => ({
          json: (data) => {
            console.log("Created pill notifications:", data);
          },
        }),
      }
    );
  } catch (error) {
    console.error("Error creating pill notifications:", error);
  }
});

// จัดการข้อผิดพลาด
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`.bgRed);
  server.close(() => process.exit(1));
});

//PORT
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`.bgGreen.white);
});
