const axios = require("axios");
const Suggestion = require("../models/suggestionModel");

exports.predictFromAI = async (req, res) => {
  try {
    const flaskRes = await axios.post("http://127.0.0.1:5000/predict", req.body);

    const {
      health_score,
      diabetes_risk,
      diabetes_risk_percent,
      summary,
      healthAdvice,
    } = flaskRes.data;
    
    const suggestion = new Suggestion({
      user: req.body.userId,
      healthScore: health_score,
      riskScore: diabetes_risk_percent,
      healthResult: diabetes_risk,
      summary,
      healthAdvice: {
        food: healthAdvice.food,
        exercise: healthAdvice.exercise,
        blog: healthAdvice.blog
      },
    });
    

    await suggestion.save();

    res.status(200).json({ ...flaskRes.data, suggestionId: suggestion._id });
  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ error: "ไม่สามารถวิเคราะห์ AI ได้" });
  }
};