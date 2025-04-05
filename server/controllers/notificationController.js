const moment = require('moment');
const HealthInfo = require("../models/healthInfoModel");
const Notification = require("../models/notificationModel");
const cron = require('node-cron');  // นำเข้า cron

// ฟังก์ชันที่ใช้ส่งการแจ้งเตือน
const sendReminder = async () => {
    console.log('Checking reminders...');  // เพิ่ม log ทุกครั้งที่ฟังก์ชันทำงาน

    try {
        const now = moment();
        const currentTime = now.format('HH:mm');  // เวลาปัจจุบัน
        const today = now.format('dddd').toLowerCase();  // วันปัจจุบัน (เปลี่ยนเป็น lowercase)

        console.log(`Current time: ${currentTime}, Today: ${today}`);

        // ค้นหาผู้ใช้ที่ตั้งเวลาการแจ้งเตือน
        const healthInfos = await HealthInfo.find({
            "regularpill.reminderTimes": {
                $in: [
                    "everyday/" + currentTime,  // เช็คเวลาที่ตั้งเป็น "everyday"
                    today + "/" + currentTime   // เช็ควัน + เวลา
                ]
            }
        }).populate("user");

        // สำหรับแต่ละผู้ใช้
        for (let healthInfo of healthInfos) {
            console.log(`Checking health info for user: ${healthInfo.user.username}`);

            // ตรวจสอบว่า healthInfo.regularpill มีข้อมูลหรือไม่
            if (!Array.isArray(healthInfo.regularpill) || healthInfo.regularpill.length === 0) {
                console.log(`No pills found for user: ${healthInfo.user.username}`);
                continue;  // ถ้าไม่มีข้อมูล pills ให้ข้ามไปยังผู้ใช้ถัดไป
            }

            // กรองเวลาที่ผู้ใช้ตั้งไว้ใน 'reminderTimes'
            const pills = healthInfo.regularpill.filter(pill => {
                console.log(`Checking pill: ${pill.pillName}, reminderTimes: ${pill.reminderTimes}`);
                return pill.reminderTimes && (
                    pill.reminderTimes.includes("everyday/" + currentTime) ||
                    pill.reminderTimes.includes(today + "/" + currentTime)
                );
            });

            // ตรวจสอบว่า pills ที่กรองออกมาไม่ว่าง
            if (pills.length === 0) {
                console.log(`No pills to remind for user: ${healthInfo.user.username} at ${currentTime}`);
            }

            for (let pill of pills) {
                console.log(`Reminder for pill: ${pill.pillName} at ${currentTime}`);

                try {
                    // ตรวจสอบว่ามีการแจ้งเตือนนี้อยู่ในฐานข้อมูลแล้วหรือยัง
                    const existingNotification = await Notification.findOne({
                        user: healthInfo.user,
                        title: 'แจ้งเตือนการทานยา',
                        detail: `ถึงเวลาทานยา ${pill.pillName} แล้ว`,
                        createdAt: { $gte: now.startOf('day'), $lt: now.endOf('day') }  // ตรวจสอบในวันที่เดียวกัน
                    });

                    if (existingNotification) {
                        console.log(`Notification already sent for user: ${healthInfo.user.username}, pill: ${pill.pillName}`);
                        continue; // ถ้ามีการแจ้งเตือนแล้ว ให้ข้ามไป
                    }

                    // สร้างการแจ้งเตือนเมื่อเวลาตรงกับเวลาที่ตั้งไว้
                    const notification = new Notification({
                        user: healthInfo.user,
                        title: 'แจ้งเตือนการทานยา',
                        detail: `อย่าลืมทานยา ${pill.pillName}`,
                        notificationType: 'general',
                    });

                    // บันทึกการแจ้งเตือนในฐานข้อมูล
                    await notification.save();
                    console.log(`Notification sent for user: ${healthInfo.user.username}`);
                } catch (error) {
                    console.error("Error saving notification:", error);  // เพิ่มการจับข้อผิดพลาดจากการบันทึก
                }
            }
        }
    } catch (error) {
        console.error("Error sending medication reminder:", error);
    }
};


const getAllNotification = async (req, res) => {
    try {
      const userId = req.auth._id;
      console.log(userId); 
  
      // Retrieve all notifications for the specific user
      const notifications = await Notification.find({ user: userId }).lean();
  
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No notifications found for this user",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        notifications,
      });
    } catch (error) {
      console.error("Error in getAllNotification:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving notifications",
        error: error.message,
      });
    }
  };
  
  
// ใช้ cron เพื่อเรียก `sendReminder` ทุกๆ นาที
cron.schedule('* * * * *', async () => {  // ทุกๆ นาที
    console.log("Running cron job to check medication reminders...");
    await sendReminder();
});

module.exports = { sendReminder, getAllNotification };
