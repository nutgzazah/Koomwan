export const EMOTION_DATA: Record<
  | "laughing"
  | "happy"
  | "neutral"
  | "irritated"
  | "sick"
  | "crying"
  | "angry"
  | "none",
  { image: any; label: string }
> = {
  happy: {
    image: require("../assets/Home/emotion-happy.png"),
    label: "วันนี้ฉันรู้สึกสดใส อารมณ์ดี\nและเต็มไปด้วยพลังบวก!",
  },
  angry: {
    image: require("../assets/Home/emotion-angry.png"),
    label: "วันนี้ฉันรู้สึกหงุดหงิด\nและโมโหกับหลายเรื่อง",
  },
  crying: {
    image: require("../assets/Home/emotion-cried.png"),
    label: "วันนี้ฉันรู้สึกเสียใจมาก\nจนอยากร้องไห้",
  },
  sick: {
    image: require("../assets/Home/emotion-frustrated.png"),
    label: "วันนี้ฉันรู้สึกเศร้า\nและท้อแท้กับชีวิต",
  },
  irritated: {
    image: require("../assets/Home/emotion-ill.png"),
    label: "วันนี้ฉันรู้สึกกังวลใจ\nกับหลายสิ่งรอบตัว",
  },
  laughing: {
    image: require("../assets/Home/emotion-laugh.png"),
    label: "วันนี้ฉันรู้สึกสนุกสนาน\nและมีความสุขกับทุกอย่าง",
  },
  neutral: {
    image: require("../assets/Home/emotion-smile.png"),
    label: "วันนี้ฉันรู้สึกเฉยๆ\nไม่มีอารมณ์อะไรเป็นพิเศษ",
  },
  none: {
    image: require("../assets/Home/emotion-none.png"),
    label: "วันนี้ยังไม่มีข้อมูลอารมณ์เลย",
  },
};

export const getEmotionImage = (
  mood:
    | "laughing"
    | "happy"
    | "neutral"
    | "irritated"
    | "sick"
    | "crying"
    | "angry"
    | "none"
) => {
  return EMOTION_DATA[mood]?.image || EMOTION_DATA.none.image;
};

export const getEmotionLabel = (
  mood:
    | "laughing"
    | "happy"
    | "neutral"
    | "irritated"
    | "sick"
    | "crying"
    | "angry"
    | "none"
) => {
  return EMOTION_DATA[mood]?.label || EMOTION_DATA.none.label;
};