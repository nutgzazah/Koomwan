import React from "react";
import { View, Image, Text, SafeAreaView } from "react-native";

type EmotionType =
  | "happy"
  | "angry"
  | "crying"
  | "sad"
  | "worried"
  | "fun"
  | "none";

interface EmotionData {
  image: any;
  label: string;
}

interface EmoteDisplayProps {
  mood: EmotionType;
}

const EMOTION_DATA: Record<EmotionType, EmotionData> = {
  happy: {
    image: require("../../assets/Home/emotion-happy.png"),
    label: "วันนี้ฉันรู้สึกสดใส อารมณ์ดี\nและเต็มไปด้วยพลังบวก!",
  },
  angry: {
    image: require("../../assets/Home/emotion-angry.png"),
    label: "วันนี้ฉันรู้สึกหงุดหงิด\nและโมโหกับหลายเรื่อง",
  },
  crying: {
    image: require("../../assets/Home/emotion-cried.png"),
    label: "วันนี้ฉันรู้สึกเสียใจมาก\nจนอยากร้องไห้",
  },
  sad: {
    image: require("../../assets/Home/emotion-frustrated.png"),
    label: "วันนี้ฉันรู้สึกเศร้า\nและท้อแท้กับชีวิต",
  },
  worried: {
    image: require("../../assets/Home/emotion-ill.png"),
    label: "วันนี้ฉันรู้สึกกังวลใจ\nกับหลายสิ่งรอบตัว",
  },
  fun: {
    image: require("../../assets/Home/emotion-laugh.png"),
    label: "วันนี้ฉันรู้สึกสนุกสนาน\nและมีความสุขกับทุกอย่าง",
  },
  none: {
    image: require("../../assets/Home/emotion-none.png"),
    label: "วันนี้ยังไม่มีข้อมูลอารมณ์เลย",
  },
};

const EmoteDisplay: React.FC<EmoteDisplayProps> = ({ mood }) => {
  const emotionData = EMOTION_DATA[mood];

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 bg-white justify-evenly my-8">
        <Image
          source={emotionData.image}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <Text className="text-description font-regular text-center text-secondary ml-3">
          {emotionData.label}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EmoteDisplay;
