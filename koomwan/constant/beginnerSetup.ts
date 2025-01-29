import { DateModalType } from "../hooks/useBeginnerSetup";

export const steps = [
  {
    id: 0,
    title: "ฉันเป็น",
    options: [
      {
        id: "new_user",
        icon: require("../assets/BeginnerSetup/normal.png"),
        label: "ผู้ใช้ทั่วไป",
      },
      {
        id: "diabetic",
        icon: require("../assets/BeginnerSetup/diabete.png"),
        label: "ผู้ป่วยเบาหวาน",
      },
    ],
  },
  {
    id: 1,
    title: "เพศของฉัน",
    options: [
      {
        id: "male",
        icon: require("../assets/BeginnerSetup/gender-male.png"),
        label: "ชาย",
      },
      {
        id: "female",
        icon: require("../assets/BeginnerSetup/gender-female.png"),
        label: "หญิง",
      },
    ],
  },
  {
    id: 2,
    title: "วันเกิดของฉัน",
    options: [],
  },
];

export const getStepMessage = (currentStep: number) => {
  switch (currentStep) {
    case 0:
      return "เลือกประเภทผู้ใช้เพื่อให้คำแนะนำ\nและการวิเคราะห์สุขภาพที่เหมาะ\nกับความต้องการของคุณมากที่สุด!";
    case 1:
      return "การเลือกเพศของคุณจะใช้สำหรับวิเคราะห์\nและสุขภาพที่ได้มีประสิทธิภาพมากขึ้น";
    case 2:
      return "การระบุวันเกิดจะช่วยให้เราสามารถ\nวิเคราะห์สุขภาพได้ถูกต้องแม่นยำมากขึ้น";
    case 3:
      return "ส่วนสูงของคุณเป็นข้อมูลสำคัญที่ช่วยในการประเมินดัชนีมวลกาย";
    case 4:
      return "น้ำหนักของคุณเป็นข้อมูลสำคัญที่ช่วยในการประเมินดัชนีมวลกาย";
    case 5:
      return "เพิ่มยาที่คุณใช้ประจำเพื่อช่วยเตือนการทานยาและวิเคราะห์สุขภาพที่แม่นยำยิ่งขึ้น";
    default:
      return "";
  }
};

export const getModalTitle = (modalType: DateModalType) => {
  switch (modalType) {
    case "day":
      return "วันที่";
    case "month":
      return "เดือน";
    case "year":
      return "ปี";
    default:
      return "";
  }
};

export const getStepTitle = (currentStep: number) => {
  if (currentStep === 3) return "ส่วนสูงของฉัน";
  if (currentStep === 4) return "น้ำหนักของฉัน";
  if (currentStep === 5) return "ยาประจำของฉัน";
  return steps[currentStep]?.title || "";
};

export const getModalOptions = (modalType: DateModalType) => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const currentYear = new Date().getFullYear() + 543;
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  switch (modalType) {
    case "day":
      return days;
    case "month":
      return months;
    case "year":
      return years;
    default:
      return [];
  }
};