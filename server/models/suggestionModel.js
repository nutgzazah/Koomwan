const mongoose = require("mongoose");

const motivationalQuotes = [
  "คุณทำได้!",
  "อย่าหยุดเดิน แม้จะช้า",
  "ความพยายามไม่เคยทรยศใคร",
  "พรุ่งนี้จะดีกว่าวันนี้",
  "เริ่มต้นใหม่ได้เสมอ",
  "อดทนไว้ ผลลัพธ์กำลังมา",
  "สู้ๆ นะ อย่ายอมแพ้",
  "ทุกความสำเร็จเริ่มจากความเชื่อ",
  "ใจสู้หรือเปล่า",
  "เหนื่อยก็พักได้ แต่อย่าหยุด",
  "ท้อได้ แต่อย่าถอย",
  "วันนี้คุณเก่งมากแล้ว",
  "คุณมีค่ามากกว่าที่คิด",
  "แค่พยายามก็คือความสำเร็จแล้ว",
  "เปลี่ยนแค่ความคิด ชีวิตก็เปลี่ยน",
  "ยิ้มไว้ โลกยังสวย",
  "ไม่มีอะไรที่เป็นไปไม่ได้",
  "จงเชื่อในตัวเอง",
  "อย่ากลัวที่จะเริ่มต้นใหม่",
  "หนึ่งก้าวของวันนี้ คือความเปลี่ยนแปลงของวันพรุ่งนี้"
];

const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

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
  }
}, { timestamps: true });

module.exports = mongoose.model("Suggestion", suggestionSchema);