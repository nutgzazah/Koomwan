const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diabetestype: {
      type: String,
      enum: ["none", "diabetes"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    regularpill: [
      {
        pillName: {
          type: String,
          required: false,
          trim: true,
        },
        pillImage: {
          type: String,
          required: false,
        },
        pillType: {
          type: String,
          required: false,
          trim: true,
        },
        description: {
          type: String,
          required: false,
          default: "",
          trim: true,
        },
        reminderTimes: [
          {
            type: String,
            required: false,
            trim: true, // รูปแบบเวลา เช่น "06:00" สำหรับ 6 โมงเช้า
          },
        ],
        addedAt: {
          // เพิ่มฟิลด์บอกวันเวลาที่เพิ่มยา
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthInfo", healthInfoSchema);
