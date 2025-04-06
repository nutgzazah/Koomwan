const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  healthResult: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  healthAdvice: {
    food: [{ title: String, description: String }],
    exercise: [{ title: String, description: String }],
    
    //Blog
    blog: [{ category: String }]

  },
  motivation: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Suggestion", suggestionSchema);