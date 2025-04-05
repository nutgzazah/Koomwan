const mongoose = require("mongoose");

const regularPillTrackingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    healthinfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthInfo",
      required: true,
    },
    pillId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // References from regularpill array in HealthInfo
    },
    pillName: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      // The specific date for this scheduled medication
    },
    scheduledTime: {
      type: String,
      required: true,
      trim: true, // Format: "08:00 น."
    },
    isTaken: {
      type: Boolean,
      default: false,
    },
    takenAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "taken", "missed"],
      default: "pending",
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add indexes for efficient queries
regularPillTrackingSchema.index({ user: 1, scheduledDate: 1 });
regularPillTrackingSchema.index({ pillId: 1, scheduledDate: 1 });
regularPillTrackingSchema.index({ status: 1 });

module.exports = mongoose.model(
  "RegularPillTracking",
  regularPillTrackingSchema
);
