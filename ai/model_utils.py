import joblib
import numpy as np
import os
from dotenv import load_dotenv, dotenv_values
from openai import OpenAI

# Load environment variables
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '.env'))
load_dotenv(dotenv_path=env_path, override=True)

print(">> ENV Path:", env_path)
print(">> API KEY Loaded:", os.getenv("OPENAI_API_KEY"))

api_key = os.getenv("OPENAI_API_KEY")

# Load AI Model & Scaler
base_dir = os.path.dirname(__file__)
model = joblib.load(os.path.join(base_dir, "rf_model.pkl"))
scaler = joblib.load(os.path.join(base_dir, "scaler.pkl"))

# Init OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def calculate_health_score(user):
    sbp = user['systolic_bp']
    dbp = user['diastolic_bp']
    bmi = user['bmi']
    glucose = user['blood_glucose_level']
    hba1c = user['HbA1c_level']

    user['hypertension'] = 1 if sbp >= 140 or dbp >= 90 else 0
    user['heart_disease'] = 1 if glucose >= 180 or bmi >= 30 else 0
    gender = 0 if user['gender'].lower() == 'male' else 1
    X = np.array([[gender, user['age'], user['hypertension'],user['heart_disease'],bmi,hba1c,  glucose, sbp, dbp]])
    X_scaled = scaler.transform(X)

    #ทำนายแบบมีความน่าจะเป็น
    prediction = model.predict(X_scaled)[0]
    diabetes_proba = model.predict_proba(X_scaled)[0][1]  # ความเสี่ยงเบาหวาน (class 1)
    print("user:", user)
    print("Prediction:", prediction)
    print("Diabetes Probability:", diabetes_proba)

    #แปลงความเสี่ยงเป็น %
    diabetes_percent = round(diabetes_proba * 100)

    #ให้คะแนนสุขภาพ
    score = 10
    risk = "ต่ำ"
    if hba1c >= 6.5 or glucose >= 180 or prediction == 1:
        risk = "เสี่ยงสูง"
        score -= 4
    elif 5.7 <= hba1c < 6.5 or 140 <= glucose < 180:
        risk = "ปานกลาง"
        score -= 2
    elif 100 <= glucose < 140:
        risk = "เฝ้าระวัง"
        score -= 1

    if sbp >= 140 or dbp >= 90:
        score -= 2
    if bmi < 18.5:
        score -= 1
    elif bmi > 24.9:
        score -= 2
    if bmi > 30:
        score -= 1

    return max(0, score), risk, diabetes_percent


def generate_advice(user, score, risk, diabetes_percent):
    # ตรวจสอบความผิดปกติ
    issues = []
    if user['blood_glucose_level'] >= 140:
        issues.append("ระดับน้ำตาลในเลือดสูง")
    if user['HbA1c_level'] >= 5.7:
        issues.append("HbA1c สูง")
    if user['systolic_bp'] >= 140 or user['diastolic_bp'] >= 90:
        issues.append("ความดันโลหิตสูง")
    if user['bmi'] < 18.5:
        issues.append("น้ำหนักต่ำกว่าเกณฑ์")
    elif user['bmi'] > 30:
        issues.append("น้ำหนักเกิน (อ้วน)")

    issue_summary = ", ".join(issues) if issues else "ไม่มีความเสี่ยงที่ชัดเจน"

    prompt = f"""
    คุณเป็นนักโภชนาการผู้เชี่ยวชาญ กำลังวิเคราะห์สุขภาพของผู้ใช้จากข้อมูลต่อไปนี้:
    - เพศ: {user['gender']}
    - อายุ: {user['age']}
    - BMI: {user['bmi']}
    - น้ำตาลในเลือด: {user['blood_glucose_level']} mg/dl
    - HbA1c: {user['HbA1c_level']}
    - ความดันโลหิต: {user['systolic_bp']}/{user['diastolic_bp']}
    - คะแนนสุขภาพ: {score}/10
    - เป็น/ไม่เป็นเบาหวาน: {user['diabetestype']}
    - ความเสี่ยงเบาหวาน: {risk} ({diabetes_percent}%)
    - ความผิดปกติที่พบ: {issue_summary}
    - อารมณ์ช่วงนี้: {user['moodstatus']}

    กรุณาตอบกลับเป็น **JSON อย่างเดียวเท่านั้น** ห้ามใส่เครื่องหมาย ``` หรือคำบรรยายอื่นนอกโครงสร้างดังนี้:
    {{
      "summary": "สรุปสุขภาพโดยรวมอย่างกระชับแต่มีความลึกมากขึ้น ไม่ต้องทวนตัวเลข แต่ให้ระบุภาพรวมสุขภาพว่าอยู่ในเกณฑ์ดีหรือควรระวัง พร้อมคำแนะนำภาพรวม เช่น 'สุขภาพโดยรวมถือว่าอยู่ในเกณฑ์ปานกลาง มีบางส่วนที่ควรเฝ้าระวัง โดยเฉพาะระดับน้ำตาลและความดัน ควรใส่ใจการดูแลอาหารและการออกกำลังกายให้สม่ำเสมอ'",
      "healthAdvice": {{ 
        "food": [{{ "title": "...", "description": "..." }}], 
        "exercise": [{{ "title": "...", "description": "..." }}],
        "blog": [{{ "category": "..." }}]
    }}
    }}
        healthAdvice คำอธิบายต้องกระชับ ไม่เกิน 2-3 บรรทัด ห้ามเกิน 3 รายการต่อหมวด ห้ามขาด 3 เท่านั้น ห้ามซ้ำ ห้ามมี key อื่น
        blog ต้องเลือกจาก category ต่อไปนี้เท่านั้น และเลือกมาให้เหมาะสมกับผู้ใช้ตอนนี้มากที่สุด 3 ประเภท ซ้ำได้: 
        1.ความรู้ 2.โภชนาการ 3.โรค 4.ออกกำลังกาย 5.แรงบันดาลใจ 6.ข่าวสาร
        """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "คุณเป็นนักโภชนาการผู้เชี่ยวชาญ"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    

    return response.choices[0].message.content

