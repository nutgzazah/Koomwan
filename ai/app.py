import json
from flask import Flask, request, jsonify
from model_utils import calculate_health_score, generate_advice
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    score, risk, diabetes_percent = calculate_health_score(data)

    # เรียก OpenAI
    advice_raw = generate_advice(data, score, risk, diabetes_percent)

    # ล้าง markdown ของ GPT
    cleaned = advice_raw.strip().removeprefix("```json").removesuffix("```").strip()

    try:
        # แปลงจากข้อความเป็น JSON
        advice_json = json.loads(cleaned)

        # ตรวจสอบโครงสร้างว่าครบ
        health_advice = advice_json.get("healthAdvice", {})
        if not isinstance(health_advice, dict):
            raise ValueError("healthAdvice missing or not a dict")

        # บังคับให้มี key ที่ต้องใช้ และตัดให้เหลือไม่เกิน 3
        advice_json["healthAdvice"]["food"] = health_advice.get("food", [])[:3]
        advice_json["healthAdvice"]["exercise"] = health_advice.get("exercise", [])[:3]
        advice_json["healthAdvice"]["blog"] = health_advice.get("blog", [])[:3]

    except Exception as e:
        print("JSON Decode Error:", e)
        print("===== RAW AI RESPONSE =====")
        print(advice_raw)
        print("===========================")
        return jsonify({"error": "ไม่สามารถอ่านคำแนะนำจาก AI ได้"}), 500

    return jsonify({
        "health_score": score,
        "diabetes_risk": risk,
        "diabetes_risk_percent": diabetes_percent,
        **advice_json
    })

if __name__ == "__main__":
    app.run(debug=True)
