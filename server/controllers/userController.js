const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const healthInfoModel = require("../models/healthInfoModel");
const regularPillTrackingModel = require("../models/regularPillTrackingModel");

//BEGINNER SETUp
// ฟังก์ชันเช็คว่า userId มี healthinfo แล้วหรือยัง (รองรับทั้ง userModel และ doctorModel)
const checkHealthInfoExists = async (userId) => {
  try {
    // ค้นหา userId จากทั้ง userModel และ doctorModel
    let user =
      (await userModel.findOne({ _id: userId })) ||
      (await doctorModel.findOne({ _id: userId }));
    let userType = user instanceof userModel ? "user" : "doctor";

    // ถ้าไม่พบทั้งใน userModel และ doctorModel
    if (!user) {
      return { status: 404, message: "User not found in system" };
    }

    // เช็คว่า user มี healthinfo หรือไม่
    if (user.healthinfo) {
      return {
        status: 400,
        message: `${userType} already has health information`,
      };
    } else {
      return {
        status: 200,
        message: `${userType} does not have health information`,
      };
    }
  } catch (error) {
    console.error("Error in checkHealthInfoExists:", error);
    return { status: 500, message: "Error checking health information" };
  }
};

// ฟังก์ชันบันทึก healthinfo ใหม่ (รองรับทั้ง userModel และ doctorModel)
const beginnerSetup = async (req, res) => {
  try {
    const {
      userId,
      diabetestype,
      gender,
      birthdate,
      height,
      weight,
      regularpill,
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // เช็คว่า userId มี healthinfo แล้วหรือยัง
    const healthInfoCheck = await checkHealthInfoExists(userId);
    if (healthInfoCheck.status !== 200) {
      return res
        .status(healthInfoCheck.status)
        .json({ success: false, message: healthInfoCheck.message });
    }

    // ถ้ายังไม่มี healthinfo ให้สร้างใหม่
    const newHealthInfo = new healthInfoModel({
      user: userId,
      diabetestype,
      gender,
      birthdate,
      height,
      weight,
      regularpill,
    });

    // บันทึก HealthInfo ใหม่
    const savedHealthInfo = await newHealthInfo.save();

    // ค้นหา user จากทั้ง userModel และ doctorModel
    let user = await userModel.findById(userId);
    if (!user) {
      user = await doctorModel.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found after saving health info",
      });
    }

    // อัปเดต healthinfo ObjectId ใน user หรือ doctor
    user.healthinfo = savedHealthInfo._id;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Health information saved successfully",
      healthInfoId: savedHealthInfo._id,
    });
  } catch (error) {
    console.error("Error in beginnerSetup:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving health information",
      error,
    });
  }
};

// ฟังก์ชันดึงข้อมูลโปรไฟล์ของ user จาก userId (รองรับทั้ง userModel และ doctorModel)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find user in either userModel or doctorModel
    let user = await userModel.findById(userId);
    if (!user) {
      user = await doctorModel.findById(userId);
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get health info if available
    let healthInfo = null;
    if (user.healthinfo) {
      healthInfo = await healthInfoModel.findById(user.healthinfo);
    }

    // Format response
    const profileData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      profileImage: user.image,
      healthinfo: healthInfo,
    };

    return res.status(200).json({
      success: true,
      user: profileData,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving user profile",
      error,
    });
  }
};

// ฟังก์ชันดึงข้อมูล healthinfo จาก healthInfoId
/**
 * Retrieves health information by healthInfoId.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.healthInfoId - The ID of the health information to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const getHealthInfo = async (req, res) => {
  try {
    const { healthInfoId } = req.params;
    const healthInfo = await healthInfoModel.findById(healthInfoId).lean();

    if (!healthInfoId) {
      return res.status(400).json({
        success: false,
        message: "Health Info ID is required",
      });
    }

    if (!healthInfo) {
      return res.status(404).json({
        success: false,
        message: "Health information not found",
      });
    }

    return res.status(200).json({
      success: true,
      healthInfo,
    });
  } catch (error) {
    console.error("Error in getHealthInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving health information",
      error,
    });
  }
};

// ฟังก์ชันอัปเดตข้อมูลพื้นฐานของ user (อีเมล, เบอร์โทรศัพท์)
/**
 * Updates a user's basic information (email, phone).
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The ID of the user to update.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The updated email.
 * @param {string} req.body.phone - The updated phone number.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const updateUserBasicInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, phone, image } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find user in either userModel or doctorModel
    let user = await userModel.findById(userId);
    let userType = "user";

    if (!user) {
      user = await doctorModel.findById(userId);
      userType = "doctor";
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare update object with only valid fields
    const updateObj = {};

    if (email !== undefined && email !== user.email) {
      // Check if email is already in use by another user
      const emailExists =
        (await userModel.findOne({ email, _id: { $ne: userId } })) ||
        (await doctorModel.findOne({ email, _id: { $ne: userId } }));

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }

      updateObj.email = email;
    }

    if (phone !== undefined && phone !== user.phone) {
      // Check if phone is already in use by another user
      const phoneExists =
        (await userModel.findOne({ phone, _id: { $ne: userId } })) ||
        (await doctorModel.findOne({ phone, _id: { $ne: userId } }));

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already in use",
        });
      }

      updateObj.phone = phone;
    }

    if (image !== undefined && image !== user.image) {
      updateObj.image = image;
    }

    // Only update if there are changes
    if (Object.keys(updateObj).length > 0) {
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, updateObj);
      } else {
        await doctorModel.findByIdAndUpdate(userId, updateObj);
      }
    }

    return res.status(200).json({
      success: true,
      message: "User information updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserBasicInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating user information",
      error: error.message,
    });
  }
};

// ฟังก์ชันอัปเดตข้อมูล healthinfo ของ user
/**
 * Updates a user's health information.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.healthInfoId - The ID of the health information to update.
 * @param {Object} req.body - The request body containing health information fields to update.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const updateHealthInfo = async (req, res) => {
  try {
    const { healthInfoId } = req.params;
    const { gender, diabetestype, birthdate, height, weight } = req.body;

    if (!healthInfoId) {
      return res.status(400).json({
        success: false,
        message: "Health Info ID is required",
      });
    }

    const healthInfo = await healthInfoModel.findById(healthInfoId).lean();

    if (!healthInfo) {
      return res.status(404).json({
        success: false,
        message: "Health information not found",
      });
    }

    // Prepare update object with only provided fields
    const updateObj = {};

    if (gender !== undefined) {
      updateObj.gender = gender;
    }

    if (diabetestype !== undefined) {
      updateObj.diabetestype = diabetestype;
    }

    if (birthdate !== undefined) {
      updateObj.birthdate = birthdate;
    }

    if (height !== undefined) {
      updateObj.height = height;
    }

    if (weight !== undefined) {
      updateObj.weight = weight;
    }

    // Only update if there are changes
    if (Object.keys(updateObj).length > 0) {
      await healthInfoModel.findByIdAndUpdate(healthInfoId, updateObj);
    }

    return res.status(200).json({
      success: true,
      message: "Health information updated successfully",
    });
  } catch (error) {
    console.error("Error in updateHealthInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating health information",
      error: error.message,
    });
  }
};

// ฟังก์ชันลบยาประจำจาก healthinfo และลบใน tracking
/**
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.healthInfoId - The ID of the health information to update.
 * @param {Object} req.body - The request body.
 * @param {Array<string>} req.body.removePills - Array of pill IDs to remove.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const removeRegularPills = async (req, res) => {
  try {
    const { healthInfoId } = req.params;
    const { removePills } = req.body;

    if (!healthInfoId) {
      return res.status(400).json({
        success: false,
        message: "Health Info ID is required",
      });
    }

    if (!Array.isArray(removePills) || removePills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "removePills array is required and cannot be empty",
      });
    }

    const healthInfo = await healthInfoModel.findById(healthInfoId);

    if (!healthInfo) {
      return res.status(404).json({
        success: false,
        message: "Health information not found",
      });
    }

    // Filter out the pills that should be removed
    const updatedPills = healthInfo.regularpill.filter(
      (pill) => pill._id && !removePills.includes(pill._id.toString())
    );

    // Update the health info with the filtered pills
    healthInfo.regularpill = updatedPills;
    await healthInfo.save();

    // Delete tracking records for each removed pill
    const userId = healthInfo.user.toString();
    const deleteResults = [];

    for (const pillId of removePills) {
      try {
        // ลบรายการติดตามที่เกี่ยวข้องกับยาที่ถูกลบ
        const result = await regularPillTrackingModel.deleteMany({
          user: userId,
          pillId: pillId,
        });

        deleteResults.push({
          pillId,
          deletedCount: result.deletedCount,
        });

        console.log(
          `Deleted ${result.deletedCount} tracking records for pill ${pillId}`
        );
      } catch (error) {
        console.error(
          `Error deleting tracking records for pill ${pillId}:`,
          error
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Medications removed successfully",
      deletedTrackings: deleteResults,
    });
  } catch (error) {
    console.error("Error in removeRegularPills:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing medications",
      error: error.message,
    });
  }
};

// ฟังก์ชันสำหรับเพิ่มยาประจำใน healthinfo
/**
 * Adds a new regular medication to user's health information.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.healthInfoId - The ID of the health information to update.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.pillName - The name of the medication.
 * @param {string} req.body.pillType - The type of the medication.
 * @param {string} req.body.description - The description of the medication.
 * @param {string} req.body.pillImage - The image URL of the medication.
 * @param {Array<string>} req.body.reminderTimes - Array of reminder times for the medication.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const addRegularPill = async (req, res) => {
  try {
    const { healthInfoId } = req.params;
    const { pillName, pillType, description, pillImage, reminderTimes } =
      req.body;

    if (!healthInfoId) {
      return res.status(400).json({
        success: false,
        message: "Health Info ID is required",
      });
    }

    if (!pillName) {
      return res.status(400).json({
        success: false,
        message: "Pill name is required",
      });
    }

    const healthInfo = await healthInfoModel.findById(healthInfoId);

    if (!healthInfo) {
      return res.status(404).json({
        success: false,
        message: "Health information not found",
      });
    }

    // Create a new pill object
    const newPill = {
      pillName,
      pillType: pillType || "",
      description: description || "",
      pillImage: pillImage || null,
      reminderTimes: reminderTimes || [],
      addedAt: new Date(),
    };

    // Add the new pill to the regularpill array
    healthInfo.regularpill.push(newPill);
    await healthInfo.save();

    return res.status(201).json({
      success: true,
      message: "Medication added successfully",
      pill: newPill,
    });
  } catch (error) {
    console.error("Error in addRegularPill:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding medication",
      error: error.message,
    });
  }
};

module.exports = {
  beginnerSetup,
  checkHealthInfoExists,
  getUserProfile,
  getHealthInfo,
  updateUserBasicInfo,
  updateHealthInfo,
  removeRegularPills,
  addRegularPill,
};
