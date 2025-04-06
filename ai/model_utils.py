import os
import joblib
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI

# Support weight + height and calculate BMI 
# Use default when input is missing
# There is a missing fields warning system 
# Calculate More Realistic health score 
# Call GPT with context + notes for easy understanding for general people

# Load environment variables
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '.env'))
load_dotenv(dotenv_path=env_path, override=True)

# Load model pipeline
base_dir = os.path.dirname(__file__)
model = joblib.load(os.path.join(base_dir, "rf_model.pkl"))

# Init OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def clean_input(user):
    defaults = {
        'gender': 'male',
        'age': 30,
        'blood_glucose_level': 90,
        'HbA1c_level': 5.4,
        'systolic_bp': 120,
        'diastolic_bp': 80,
    }
    for key, value in defaults.items():
        user.setdefault(key, value)

    if 'bmi' not in user:
        if 'weight' in user and 'height' in user:
            h_m = user['height'] / 100
            user['bmi'] = round(user['weight'] / (h_m ** 2), 1)
        else:
            user['bmi'] = 22

    if user['age'] <= 0 or user['age'] > 120:
        raise ValueError("Invalid age")
    if user['blood_glucose_level'] < 40 or user['bmi'] < 10:
        raise ValueError("Unrealistic input values")

    user['hypertension'] = 1 if user['systolic_bp'] >= 140 or user['diastolic_bp'] >= 90 else 0
    user['heart_disease'] = 1 if user['blood_glucose_level'] >= 180 or user['bmi'] >= 30 else 0
    user['gender'] = 0 if user['gender'].lower() == 'male' else 1

    return user

def calculate_health_score(user):
    user = clean_input(user)
    X_input = {
        'gender': user['gender'],
        'age': user['age'],
        'weight': user['weight'],
        'height': user['height'],
        'blood_glucose_level': user['blood_glucose_level'],
        'HbA1c_level': user['HbA1c_level'],
        'systolic_bp': user['systolic_bp'],
        'diastolic_bp': user['diastolic_bp'],
        'hypertension': user['hypertension'],
        'heart_disease': user['heart_disease']
    }
    X = np.array([list(X_input.values())])

    prediction = model.predict(X)[0]
    diabetes_proba = model.predict_proba(X)[0][1]
    diabetes_percent = round(diabetes_proba * 100)

    raw_score = 100

    hba1c = user['HbA1c_level']
    glucose = user['blood_glucose_level']  

    # ปรับความแม่นยำของความเสี่ยง (ถ้าค่าคลินิกดีแต่โมเดลสูงเกิน)
    if hba1c < 5.7 and glucose < 100 and diabetes_percent > 60:
        diabetes_percent = 10

    if hba1c >= 6.5 or glucose >= 200:
        diabetes_percent = max(diabetes_percent, 85)
        
    if hba1c >= 7.5 or glucose >= 240:
        diabetes_percent = max(diabetes_percent, 95)

    elif hba1c >= 5.7 or glucose >= 140:
        diabetes_percent = max(diabetes_percent, 60)

    # HbA1c deductions
    if hba1c >= 10:
        raw_score -= 40
    elif hba1c >= 8:
        raw_score -= 35
    elif hba1c >= 6.5:
        raw_score -= 30
    elif 5.7 <= hba1c < 6.5:
        raw_score -= 20

    # Blood glucose deductions
    if glucose >= 250:
        raw_score -= 40
    elif glucose >= 180:
        raw_score -= 30
    elif glucose >= 126:
        raw_score -= 25
    elif glucose >= 100:
        raw_score -= 15

    # Blood pressure
    if user['systolic_bp'] >= 140 or user['diastolic_bp'] >= 90:
        raw_score -= 15

    # BMI
    bmi = user['bmi']
    if bmi < 18.5:
        raw_score -= 5
    elif bmi >= 30:
        raw_score -= 15
    elif bmi > 25:
        raw_score -= 10

    # Risk label
    risk_label = "ความเสี่ยงต่ำ"
    if hba1c >= 6.5 or glucose >= 200:
        risk_label = "เบาหวาน"
    elif 5.7 <= hba1c < 6.5 or 140 <= glucose < 200:
        risk_label = "เสี่ยงเบาหวาน"
    elif diabetes_percent >= 70:
        risk_label = "เสี่ยงสูง"
    elif diabetes_percent >= 40:
        risk_label = "เฝ้าระวัง"
    else:
        risk_label = "เสี่ยงต่ำ"
        

    final_score = round(max(0, raw_score) / 10)

    return final_score, risk_label, diabetes_percent

def generate_advice(user, score, risk, diabetes_percent):
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

    missing = []
    for field in ["HbA1c_level", "blood_glucose_level", "weight", "height"]:
        if field not in user:
            missing.append(field)

    missing_note = ""
    if missing:
        missing_note = f"(หมายเหตุ: คุณไม่ได้ระบุ {', '.join(missing)} ระบบใช้ค่ามาตรฐานเพื่อประเมินเบื้องต้น)"

    prompt = f"""
    ผู้ใช้มีข้อมูลสุขภาพดังนี้:
    - เพศ: {'ชาย' if user['gender'] == 0 else 'หญิง'}
    - อายุ: {user['age']}
    - BMI: {user['bmi']}
    - น้ำตาลในเลือด: {user['blood_glucose_level']} mg/dl
    - HbA1c: {user['HbA1c_level']}
    - ความดันโลหิต: {user['systolic_bp']}/{user['diastolic_bp']}
    - คะแนนสุขภาพ: {score}/10
    - ความเสี่ยงเบาหวาน: {risk} ({diabetes_percent}%)
    - ความผิดปกติที่พบ: {issue_summary}
    {missing_note}

    กรุณาตอบกลับเป็น **JSON อย่างเดียวเท่านั้น**ให้ข้อมูลมาใน Format ที่ถูกต้องและที่ฉันต้องการทุกครั้ง ห้ามใส่เครื่องหมาย ``` หรือคำบรรยายอื่นนอกโครงสร้างดังนี้:
    {{
      "summary": "สรุปสุขภาพแบบกระชับ ระบุจุดเด่นและเตือนจุดอันตราย โดยไม่ทวนข้อมูล เช่น ระดับน้ำตาล ความดัน หรือ BMI ถ้าอยู่ในเกณฑ์ดีให้ชม แนะนำโดยรวม เช่น 'สุขภาพโดยรวมดี แต่ควรเฝ้าระวังน้ำตาลในเลือด'",
      "healthAdvice": {{
        "food": [{{ "title": "...", "description": "..." }}],
        "exercise": [{{ "title": "...", "description": "..." }}],
        "blog": [{{ "title": "...", "description": "..." }}]
      }},
      "motivation": "ข้อความสร้างแรงบันดาลใจให้เหมาะกับแต่ละบุคคลสั้นกระชับ"
    }}
    - คำอธิบายต้องใช้ภาษาคนทั่วไป ไม่วิชาการเกินไป
    healthAdvice คำอธิบายต้องกระชับ ไม่เกิน 2 บรรทัด ห้ามเกิน 3 รายการต่อหมวด ห้ามขาด 3 เท่านั้น ห้ามซ้ำ ห้ามมี key อื่น
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "คุณเป็นนักโภชนาการผู้เชี่ยวชาญ"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=550
    )

    return response.choices[0].message.content
