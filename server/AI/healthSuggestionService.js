const OpenAI = require("openai"); 
const dotenv = require('dotenv')
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

const getHealthSuggestion = async (userHealthData) => {
    const prompt = `
    ผู้ใช้มีข้อมูลสุขภาพดังนี้:
    - อายุ: ${userHealthData.age}
    - น้ำหนัก: ${userHealthData.weight} kg
    - ส่วนสูง: ${userHealthData.height} cm
    - เพศ: ${userHealthData.gender}
    - เป็นโรคเบาหวาน: ${userHealthData.diabetestype}

    กรุณาประเมินสุขภาพของผู้ใช้ให้คะแนนเต็ม 10 คำนวณความเสี่ยงเป็นโรคเบาหวานเป็นเปอร์เซ็นต์
    แนะนำอาหารที่ดีต่อสุขภาพ แนะนำการออกกำลังกายที่เหมาะสม และแนะนำบทความสุขภาพที่น่าสนใจ
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a health expert." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching health suggestions:", error);
        return null;
    }
};

module.exports = { getHealthSuggestion };