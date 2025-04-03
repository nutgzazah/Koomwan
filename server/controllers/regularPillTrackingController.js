const regularPillTrackingModel = require("../models/regularPillTrackingModel");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const healthInfoModel = require("../models/healthInfoModel");
const notificationModel = require("../models/notificationModel");

/**
 * แปลงวันที่เป็นรูปแบบ YYYY-MM-DD
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * ฟังก์ชันดึงวันในสัปดาห์ (เป็นภาษาอังกฤษย่อ)
 */
const getDayOfWeek = (date) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
};

/**
 * ฟังก์ชันตรวจสอบว่าวันที่อยู่ในอดีตหรือไม่
 */
const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

/**
 * ใช้สร้างข้อมูลย้อนหลัง
 */
const generateEntriesForDate = async (userId, healthInfo, trackingDate) => {
  try {
    // วันในสัปดาห์ของวันที่ระบุ
    const dayOfWeek = getDayOfWeek(trackingDate);
    const formattedDate = formatDate(trackingDate);

    // จำนวนรายการที่สร้าง
    let createdCount = 0;

    // เก็บ key ของรายการที่มีการสร้างแล้ว เพื่อป้องกันข้อมูลซ้ำ
    const createdEntries = new Set();

    // ประมวลผลยาประจำแต่ละรายการ
    for (const pill of healthInfo.regularpill) {
      // ตรวจสอบว่ายาถูกเพิ่มก่อนหรือในวันที่กำลังสร้างรายการหรือไม่
      if (pill.addedAt) {
        const pillAddedDate = new Date(pill.addedAt);
        pillAddedDate.setHours(0, 0, 0, 0);

        const trackingDateCopy = new Date(trackingDate);
        trackingDateCopy.setHours(0, 0, 0, 0);

        // ถ้ายาถูกเพิ่มหลังจากวันที่กำลังสร้างรายการ ให้ข้ามไป
        if (pillAddedDate > trackingDateCopy) {
          continue;
        }
      }

      // ข้ามถ้าไม่มีเวลาเตือน
      if (!pill.reminderTimes || pill.reminderTimes.length === 0) {
        continue;
      }

      // สร้าง Set เพื่อตรวจสอบเวลาที่ซ้ำกัน
      const processedTimes = new Set();

      // ประมวลผลเวลาเตือนแต่ละรายการ
      for (const reminderTime of pill.reminderTimes) {
        // รูปแบบ: "everyday/08:00" หรือ "monday/20:00"
        let dayPattern = "everyday";
        let timeStr = reminderTime;

        if (reminderTime.includes("/")) {
          const parts = reminderTime.split("/");
          dayPattern = parts[0].toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อรองรับทั้งรูปแบบเก่าและใหม่
          timeStr = parts[1];
        }

        // ตรวจสอบว่าเป็นวันที่ต้องทานยาหรือไม่
        if (dayPattern !== "everyday" && dayPattern !== dayOfWeek) {
          continue;
        }

        // เพิ่ม "น." ถ้าไม่มี
        const displayTime = timeStr.endsWith(" น.") ? timeStr : `${timeStr} น.`;

        // สร้าง unique key สำหรับรายการน
        const entryKey = `${pill._id.toString()}_${displayTime}`;

        // ตรวจสอบว่าได้ประมวลผลเวลานี้แล้วหรือไม่
        if (processedTimes.has(displayTime) || createdEntries.has(entryKey)) {
          console.log(
            `Skipping duplicate reminder time: ${pill.pillName} at ${displayTime}`
          );
          continue;
        }

        // เพิ่มเวลานี้เข้าไปในเวลาที่ประมวลผลแล้ว
        processedTimes.add(displayTime);

        // ตรวจสอบว่ามีรายการติดตามนี้แล้วหรือไม่
        const existingTrackings = await regularPillTrackingModel.find({
          user: userId,
          healthinfo: healthInfo._id,
          pillId: pill._id,
          pillName: pill.pillName,
          scheduledDate: {
            $gte: new Date(new Date(trackingDate).setHours(0, 0, 0, 0)),
            $lt: new Date(
              new Date(trackingDate).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
            ),
          },
          scheduledTime: displayTime,
        });

        // ข้ามถ้ามีรายการติดตามแล้ว
        if (existingTrackings && existingTrackings.length > 0) {
          /* console.log(
            `Entry already exists for ${pill.pillName} at ${displayTime}`
          ); */

          // ถ้ามีมากกว่า 1 รายการ ลบรายการซ้ำที่เกินมา
          if (existingTrackings.length > 1) {
            console.log(
              `Found ${existingTrackings.length} duplicate entries, removing extras`
            );

            // เก็บรายการแรกไว้ ลบรายการที่เหลือ
            for (let i = 1; i < existingTrackings.length; i++) {
              await regularPillTrackingModel.findByIdAndDelete(
                existingTrackings[i]._id
              );
              console.log(
                `Removed duplicate tracking: ${existingTrackings[i]._id}`
              );
            }
          }

          continue;
        }

        // กำหนดสถานะเริ่มต้น ถ้าเป็นวันในอดีต กำหนดเป็น 'missed'
        let initialStatus = "pending";
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const trackingDateCopy = new Date(trackingDate);
        trackingDateCopy.setHours(0, 0, 0, 0);

        if (trackingDateCopy < today) {
          initialStatus = "missed";
        }

        // สร้างรายการติดตามใหม่
        const newTracking = new regularPillTrackingModel({
          user: userId,
          healthinfo: healthInfo._id,
          pillId: pill._id,
          pillName: pill.pillName,
          scheduledDate: new Date(trackingDate),
          scheduledTime: displayTime,
          status: initialStatus,
          isTaken: false,
        });

        await newTracking.save();

        // เพิ่มรายการที่สร้างแล้วเข้าไปใน Set
        createdEntries.add(entryKey);

        createdCount++;
      }
    }

    return createdCount;
  } catch (error) {
    console.error("Error in generateEntriesForDate:", error);
    return 0;
  }
};

/**
 * สร้างรายการติดตามการทานยาประจำวันสำหรับผู้ใช้
 * ควรถูกเรียกเมื่อเข้าสู่วันใหม่ หรือเมื่อผู้ใช้เพิ่มยาประจำใหม่
 */
const generateDailyPillTrackings = async (req, res) => {
  try {
    const { userId, date, generateHistory } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ใช้วันที่ปัจจุบันถ้าไม่ได้ระบุวัน
    const trackingDate = date ? new Date(date) : new Date();
    trackingDate.setHours(0, 0, 0, 0);

    // ดึงข้อมูลผู้ใช้และข้อมูลสุขภาพ
    let user = await userModel.findById(userId);
    if (!user) {
      user = await doctorModel.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.healthinfo) {
      return res.status(404).json({
        success: false,
        message: "User has no health information",
      });
    }

    // ดึงข้อมูลสุขภาพของผู้ใช้
    const healthInfo = await healthInfoModel.findById(user.healthinfo);

    if (
      !healthInfo ||
      !healthInfo.regularpill ||
      healthInfo.regularpill.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "User has no regular medications",
      });
    }

    // สร้างข้อมูลสำหรับวันที่ระบุ
    let createdCount = await generateEntriesForDate(
      userId,
      healthInfo,
      new Date(trackingDate)
    );
    let totalCreated = createdCount;

    // ถ้าต้องการสร้างข้อมูลย้อนหลัง
    if (generateHistory) {
      // จำนวนวันย้อนหลังที่ต้องการ (เริ่มจาก 1 เพราะวันที่ระบุได้สร้างไปแล้ว)
      const backfillDays = 30;
      const backfillResults = [];

      // สร้างข้อมูลย้อนหลัง
      for (let i = 1; i <= backfillDays; i++) {
        const pastDate = new Date(trackingDate);
        pastDate.setDate(pastDate.getDate() - i);

        // ใช้ Promise เพื่อให้ทำงานพร้อมกันได้
        backfillResults.push(
          generateEntriesForDate(userId, healthInfo, pastDate)
        );
      }

      // รอให้การสร้างข้อมูลย้อนหลังทั้งหมดเสร็จสิ้น
      const results = await Promise.all(backfillResults);

      // รวมจำนวนรายการที่สร้างทั้งหมด
      totalCreated += results.reduce((sum, count) => sum + count, 0);
    }

    return res.status(200).json({
      success: true,
      message: `Generated ${createdCount} medication tracking records for ${formatDate(
        trackingDate
      )}${
        generateHistory
          ? ` and ${totalCreated - createdCount} historical records`
          : ""
      }`,
      count: totalCreated,
    });
  } catch (error) {
    console.error("Error in generateDailyPillTrackings:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating medication tracking records",
      error: error.message,
    });
  }
};

/**
 * สร้างรายการติดตามการทานยาประจำวันสำหรับผู้ใช้ทุกคน
 * ควรถูกเรียกโดย cron job ทุกวัน
 */
const generateDailyPillTrackingsForAllUsers = async () => {
  try {
    // ดึงรายการผู้ใช้ทั้งหมดที่มีข้อมูลสุขภาพ
    const allUsers = await userModel
      .find({ healthinfo: { $exists: true } })
      .select("_id");
    const allDoctors = await doctorModel
      .find({ healthinfo: { $exists: true } })
      .select("_id");

    // รวมรายการผู้ใช้ทั้งหมด
    const allUserIds = [...allUsers, ...allDoctors].map((user) => user._id);

    // วันที่ปัจจุบัน
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // สร้างรายการยาสำหรับผู้ใช้ทุกคน
    let totalCreated = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const userId of allUserIds) {
      try {
        // ดึงข้อมูลสุขภาพของผู้ใช้
        let user = await userModel.findById(userId);
        if (!user) {
          user = await doctorModel.findById(userId);
        }

        if (!user || !user.healthinfo) {
          continue;
        }

        const healthInfo = await healthInfoModel.findById(user.healthinfo);

        if (
          !healthInfo ||
          !healthInfo.regularpill ||
          healthInfo.regularpill.length === 0
        ) {
          continue;
        }

        // สร้างรายการยาสำหรับวันนี้
        const createdCount = await generateEntriesForDate(
          userId,
          healthInfo,
          today
        );
        totalCreated += createdCount;
        successCount++;
      } catch (error) {
        console.error(
          `Error generating pill trackings for user ${userId}:`,
          error
        );
        errorCount++;
      }
    }

    console.log(
      `Daily pill tracking generation completed: ${totalCreated} records created for ${successCount} users. Errors: ${errorCount}`
    );
    return { totalCreated, successCount, errorCount };
  } catch (error) {
    console.error("Error in generateDailyPillTrackingsForAllUsers:", error);
    throw error;
  }
};

/**
 * อัปเดตสถานะการทานยา
 */
const updatePillStatus = async (req, res) => {
  try {
    const { medicationId, userId, status, actualTime } = req.body;

    if (!medicationId || !userId || !status) {
      return res.status(400).json({
        success: false,
        message: "Medication ID, user ID, and status are required",
      });
    }

    // หา Tracking จาก pillId, userId, และวันที่ปัจจุบัน
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ถ้า actualTime ถูกส่งมาในรูปแบบ "08:00" หรือ "08:00 น."
    let scheduledTime = null;
    if (actualTime) {
      scheduledTime = actualTime.endsWith(" น.")
        ? actualTime
        : `${actualTime} น.`;
    }

    // สร้างเงื่อนไขการค้นหา
    const findCondition = {
      user: userId,
      pillId: medicationId,
      scheduledDate: {
        $gte: today,
        $lt: tomorrow,
      },
    };

    // ถ้ามีเวลาที่ชัดเจน ใส่ลงในเงื่อนไข
    if (scheduledTime) {
      findCondition.scheduledTime = scheduledTime;
    }

    // ค้นหา Tracking
    const tracking = await regularPillTrackingModel.findOne(findCondition);

    if (!tracking) {
      // ถ้าไม่พบรายการติดตาม สร้างใหม่
      // ต้องดึงข้อมูลผู้ใช้และข้อมูลสุขภาพ
      let user = await userModel.findById(userId);
      if (!user) {
        user = await doctorModel.findById(userId);
      }

      if (!user || !user.healthinfo) {
        return res.status(404).json({
          success: false,
          message: "User not found or has no health information",
        });
      }

      // ดึงข้อมูลสุขภาพของผู้ใช้
      const healthInfo = await healthInfoModel.findById(user.healthinfo);

      // หายาจาก pillId
      let pill = null;
      for (const p of healthInfo.regularpill) {
        if (p._id.toString() === medicationId) {
          pill = p;
          break;
        }
      }

      if (!pill) {
        return res.status(404).json({
          success: false,
          message: "Medication not found in user's regular medications",
        });
      }

      // สร้าง Tracking ใหม่
      const newTracking = new regularPillTrackingModel({
        user: userId,
        healthinfo: healthInfo._id,
        pillId: medicationId,
        pillName: pill.pillName,
        scheduledDate: today,
        scheduledTime: scheduledTime || "00:00 น.", // ถ้าไม่มีเวลา ตั้งเป็นเที่ยงคืน
        status: status === "taken" ? "taken" : "pending",
        isTaken: status === "taken",
        takenAt: status === "taken" ? new Date() : null,
      });

      await newTracking.save();

      return res.status(201).json({
        success: true,
        message: "Created new medication tracking record",
        tracking: newTracking,
      });
    }

    // อัปเดตรายการติดตาม
    tracking.status = status === "taken" ? "taken" : "pending";
    tracking.isTaken = status === "taken";

    if (status === "taken") {
      tracking.takenAt = new Date();
    } else {
      tracking.takenAt = null;
    }

    await tracking.save();

    return res.status(200).json({
      success: true,
      message: "Medication status updated successfully",
      tracking,
    });
  } catch (error) {
    console.error("Error in updatePillStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating medication status",
      error: error.message,
    });
  }
};

/**
 * ดึงรายการติดตามการทานยาประจำวันตามวันที่
 */
const getPillTrackingsByDate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ใช้วันที่ปัจจุบันถ้าไม่ได้ระบุวัน
    const trackingDate = date ? new Date(date) : new Date();
    trackingDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(trackingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // ดึงรายการติดตามตามวันที่
    const trackings = await regularPillTrackingModel
      .find({
        user: userId,
        scheduledDate: {
          $gte: trackingDate,
          $lt: nextDay,
        },
      })
      .sort({ scheduledTime: 1 });

    // จัดกลุ่มรายการติดตามตามเวลา
    const groupedTrackings = {};

    trackings.forEach((tracking) => {
      if (!groupedTrackings[tracking.scheduledTime]) {
        groupedTrackings[tracking.scheduledTime] = [];
      }

      groupedTrackings[tracking.scheduledTime].push({
        id: tracking._id,
        pillId: tracking.pillId,
        pillName: tracking.pillName,
        isTaken: tracking.isTaken,
        status: tracking.status,
        takenAt: tracking.takenAt,
      });
    });

    // แปลงเป็นรูปแบบที่ตรงกับ MedicationLog[] ใน frontend
    const medicationLogs = Object.keys(groupedTrackings).map((time) => ({
      time,
      medications: groupedTrackings[time],
    }));

    return res.status(200).json({
      success: true,
      date: formatDate(trackingDate),
      medicationLogs,
    });
  } catch (error) {
    console.error("Error in getPillTrackingsByDate:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving medication trackings",
      error: error.message,
    });
  }
};

/**
 * ดึงรายการติดตามการทานยาประจำวันสำหรับช่วงวันที่
 */
const getPillTrackingsByDateRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // กำหนดช่วงวันที่ ถ้าไม่ได้ระบุ ใช้ 30 วันล่าสุด
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(start.getDate() - 30); // 30 วันล่าสุด
    }
    start.setHours(0, 0, 0, 0);

    // ดึงรายการติดตามตามช่วงวันที่
    const trackings = await regularPillTrackingModel
      .find({
        user: userId,
        scheduledDate: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    // จัดกลุ่มรายการติดตามตามวันที่
    const groupedByDate = {};

    trackings.forEach((tracking) => {
      const dateKey = formatDate(tracking.scheduledDate);

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          medications: [],
          healthLogs: [],
        };
      }

      // ตรวจสอบว่ามีรายการเวลานี้แล้วหรือไม่
      let timeIndex = groupedByDate[dateKey].medications.findIndex(
        (m) => m.time === tracking.scheduledTime
      );

      if (timeIndex === -1) {
        // ถ้ายังไม่มีรายการเวลานี้ สร้างใหม่
        groupedByDate[dateKey].medications.push({
          time: tracking.scheduledTime,
          medications: [
            {
              id: tracking.pillId.toString(),
              name: tracking.pillName,
              taken: tracking.isTaken,
              status: tracking.status,
              takenAt: tracking.takenAt,
              isPastMedication: isDateInPast(tracking.scheduledDate),
            },
          ],
        });
      } else {
        // ถ้ามีรายการเวลานี้แล้ว เพิ่มยาเข้าไป
        groupedByDate[dateKey].medications[timeIndex].medications.push({
          id: tracking.pillId.toString(),
          name: tracking.pillName,
          taken: tracking.isTaken,
          status: tracking.status,
          takenAt: tracking.takenAt,
          isPastMedication: isDateInPast(tracking.scheduledDate),
        });
      }
    });

    return res.status(200).json({
      success: true,
      startDate: formatDate(start),
      endDate: formatDate(end),
      data: groupedByDate,
    });
  } catch (error) {
    console.error("Error in getPillTrackingsByDateRange:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving medication trackings",
      error: error.message,
    });
  }
};

/**
 * อัปเดตสถานะยาที่ไม่ได้ทานให้เป็น 'missed'
 * ควรถูกเรียกโดย cron job ทุกวัน
 */
const updateMissedMedications = async (req, res) => {
  try {
    // หาวันที่เมื่อวาน
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // หารายการติดตามที่ยังไม่ได้ทาน
    const trackings = await regularPillTrackingModel.find({
      scheduledDate: {
        $gte: yesterday,
        $lt: today,
      },
      status: "pending",
    });

    // อัปเดตสถานะเป็น 'missed'
    let updatedCount = 0;
    for (const tracking of trackings) {
      tracking.status = "missed";
      await tracking.save();
      updatedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Updated ${updatedCount} medications to missed status`,
      count: updatedCount,
    });
  } catch (error) {
    console.error("Error in updateMissedMedications:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating missed medications",
      error: error.message,
    });
  }
};

/**
 * สร้างการแจ้งเตือนสำหรับยาที่ถึงเวลาทาน
 * ควรถูกเรียกโดย cron job ทุกๆ 5 นาที
 */
const createPillNotifications = async (req, res) => {
  try {
    // หาเวลาปัจจุบันและช่วงเวลาที่จะแจ้งเตือน
    const now = new Date();
    const notificationWindow = new Date(now.getTime() + 15 * 60 * 1000); // 15 นาทีข้างหน้า

    // หารายการติดตามที่ถึงเวลาทานและยังไม่ได้แจ้งเตือน
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // หารายการติดตามที่ถึงเวลาทานและยังไม่ได้แจ้งเตือน
    const trackings = await regularPillTrackingModel.find({
      scheduledDate: {
        $gte: today,
        $lt: tomorrow,
      },
      status: "pending",
      notificationSent: false,
    });

    // กรองรายการที่อยู่ในช่วงเวลาที่จะแจ้งเตือน
    const trackingsToNotify = trackings.filter((tracking) => {
      const timeStr = tracking.scheduledTime.replace(" น.", ""); // ตัด "น." ออก
      const [hours, minutes] = timeStr.split(":").map(Number);

      const scheduledDateTime = new Date(tracking.scheduledDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // แจ้งเตือนถ้าเวลาอยู่ในช่วงปัจจุบันถึง 15 นาทีข้างหน้า
      return (
        scheduledDateTime >= now && scheduledDateTime <= notificationWindow
      );
    });

    // สร้างการแจ้งเตือน
    let notificationCount = 0;
    for (const tracking of trackingsToNotify) {
      // สร้างการแจ้งเตือน
      const newNotification = new notificationModel({
        user: tracking.user,
        title: "เตือนการทานยา",
        detail: `ถึงเวลาทานยา ${tracking.pillName} เวลา ${tracking.scheduledTime} แล้ว`,
        notificationType: "medication",
        medicationDetails: {
          pillId: tracking.pillId,
          pillName: tracking.pillName,
        },
      });

      await newNotification.save();

      // อัปเดตสถานะการแจ้งเตือน
      tracking.notificationSent = true;
      await tracking.save();

      notificationCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Created ${notificationCount} medication notifications`,
      count: notificationCount,
    });
  } catch (error) {
    console.error("Error in createPillNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating medication notifications",
      error: error.message,
    });
  }
};

/**
 * ดึงสถิติการทานยาสำหรับช่วงวันที่
 */
const getPillAdherenceStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // กำหนดช่วงวันที่ ถ้าไม่ได้ระบุ ใช้ 30 วันล่าสุด
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(start.getDate() - 30); // 30 วันล่าสุด
    }
    start.setHours(0, 0, 0, 0);

    // ดึงรายการติดตามตามช่วงวันที่
    const trackings = await regularPillTrackingModel.find({
      user: userId,
      scheduledDate: {
        $gte: start,
        $lte: end,
      },
    });

    // คำนวณสถิติ
    const total = trackings.length;
    const taken = trackings.filter((t) => t.status === "taken").length;
    const missed = trackings.filter((t) => t.status === "missed").length;
    const pending = trackings.filter((t) => t.status === "pending").length;

    // คำนวณอัตราการทานยาตามกำหนด (adherence rate)
    const completedTotal = taken + missed; // จำนวนรายการที่จบแล้ว (ทานหรือพลาด)
    const adherenceRate =
      completedTotal > 0 ? ((taken / completedTotal) * 100).toFixed(1) : 100; // ถ้ายังไม่มีรายการที่จบ ถือว่าอัตรา 100%

    // คำนวณอัตราการทานยาตามเวลา (ทานยาภายในเวลาที่กำหนด)
    const takenOnTime = trackings.filter((t) => {
      if (t.status !== "taken" || !t.takenAt) return false;

      const timeStr = t.scheduledTime.replace(" น.", ""); // ตัด "น." ออก
      const [hours, minutes] = timeStr.split(":").map(Number);

      const scheduledDateTime = new Date(t.scheduledDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // ทานยาภายใน 30 นาทีหลังจากเวลาที่กำหนด
      const lateThreshold = new Date(
        scheduledDateTime.getTime() + 30 * 60 * 1000
      );

      return t.takenAt <= lateThreshold;
    }).length;

    const onTimeRate =
      taken > 0 ? ((takenOnTime / taken) * 100).toFixed(1) : 100; // ถ้ายังไม่มีรายการที่ทาน ถือว่าอัตรา 100%

    return res.status(200).json({
      success: true,
      stats: {
        total,
        taken,
        missed,
        pending,
        adherenceRate: parseFloat(adherenceRate),
        onTimeRate: parseFloat(onTimeRate),
        startDate: formatDate(start),
        endDate: formatDate(end),
      },
    });
  } catch (error) {
    console.error("Error in getPillAdherenceStats:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving medication adherence stats",
      error: error.message,
    });
  }
};

module.exports = {
  generateDailyPillTrackings,
  updatePillStatus,
  getPillTrackingsByDate,
  getPillTrackingsByDateRange,
  updateMissedMedications,
  createPillNotifications,
  getPillAdherenceStats,
  generateDailyPillTrackingsForAllUsers,
  generateEntriesForDate,
};
