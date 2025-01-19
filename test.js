Database Design

#User
{
  "username": "string",
  "password": "string", // Hashed password
  "phone": "string",
  "email": "string",
  "role": "string", // e.g., "user", "doctor", "admin"
  "userhealthinfo": "ObjectId",

  "created_at": "timestamp",
  "updated_at": "timestamp"
}

#HealthInfo
{
  "user": "ObjectId", // ref จาก user

  "diabetestype": "string", // บอกว่า user เป็น Type 1, Type 2, หรือหากไม่เป็นโรคเบาหวานก็ให้เป็น none
  "birthdate": "date",
  "gender": "string",
  "height": "number", // ให้เป็น default
  "weight": "number", // ให้เป็น default

  "record": 
  {
    "id": "number" //อยากให้มี ID เผื่อมีการอัพเดต ลบ จะได้ค้นหาง่ายๆ หรือมีวิธีที่เหมาะสมเสนอได้เลยครับ
    "recordtime": "timestamp",
    "height": "number", //หากไม่ได้บันทึกก็ดึงค่า default แต่หากมีบันทึกค่าก็ไปอัพเดตตค่า default
    "weight": "number", //หากไม่ได้บันทึกก็ดึงค่า default แต่หากมีบันทึกค่าก็ไปอัพเดตตค่า default
    "bloodsugar": "number", //ค่าน้ำตาลในเลือด
    "a1c": "float",
    "bloodpressure": "number",
    "moodstatus": "string", //ค่าอารมณ์ ณ ขณะนั้น เช่น ความสุข เฉยๆ โกรธ เศร้า
    "medicineaddition": "ObjectId",// บันทึกว่ามีใช้ยาเพิ่มเติมไหม
  }
  "medicinecollection": "ObjectId",// เก็บข้อมูลยาประจำที่ user บันทึกไว้

  //timestamp ด้วย
}

#HealthRecordsCollection
{
  "_id": "ObjectId",
  "healthinfo": "ObjectId", // Reference to HealthInfo

  "record": 
  {
    "recordtime": "timestamp",
    "height": "number",
    "weight": "number",
    "bloodsugar": "number",
    "a1c": "float",
    "bloodpressure": "number",
    "moodstatus": "string",
    "medicineaddition": "ObjectId",
  },
  "created_at": "timestamp"
  "updated_at": "timestamp"
}


#MedicationsCollection
{
  "_id": "ObjectId",
  "userhealthinfo": "ObjectId", // Reference to UserHealthInfo
  "medicine": 
    {
    "medicinename": "string",
    "medicinetype": "string",
    "medicineimage": "string",
    "note": "date",
    },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}