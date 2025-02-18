import React from "react";
import { View, Text, Image } from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";

interface BloodSugarStatusProps {
  date: string;
  status?: "none" | "normal" | "risk" | "diabetes";
}

const BloodSugarStatus: React.FC<BloodSugarStatusProps> = ({
  date,
  status = "none", // 'none', 'normal', 'risk', 'diabetes'
}) => {
  const statusConfig = {
    none: {
      color: "text-secondary",
      text: "ไม่มีข้อมูล",
      message:
        "ยังไม่มีข้อมูลระดับน้ำตาลในเลือดของคุณ\nกรุณาบันทึกค่าน้ำตาลในเลือด\nเพื่อติดตามสุขภาพของคุณ",
      image: require("../../assets/Home/a1c-none.png"),
    },
    normal: {
      color: "text-normal",
      text: "สภาวะปกติ",
      message:
        "น้ำตาลในเลือดของคุณอยู่ในเกณฑ์ดีแล้ว!\nรักษาการกินที่สมดุล ออกกำลังกาย\nและตรวจสุขภาพสม่ำเสมอ\nเพื่อค่าน้ำตาลอยู่ในเกณฑ์ที่ดีต่อไป!",
      image: require("../../assets/Home/a1c-normal.png"),
    },
    risk: {
      color: "text-warning",
      text: "ภาวะเสี่ยง \nหรือเบาหวานแฝง",
      message:
        "ค่าน้ำตาลในเลือดของคุณอยู่ในเกณฑ์เสี่ยง\nควรปรับเปลี่ยนพฤติกรรมการกิน\nและออกกำลังกายอย่างสม่ำเสมอ",
      image: require("../../assets/Home/a1c-warning.png"),
    },
    diabetes: {
      color: "text-abnormal",
      text: "เสี่ยงเบาหวาน",
      message:
        "ค่าน้ำตาลในเลือดของคุณอยู่ในเกณฑ์เสี่ยงเบาหวาน\nควรพบแพทย์เพื่อรับคำแนะนำ\nและปรับเปลี่ยนพฤติกรรมโดยด่วน",
      image: require("../../assets/Home/a1c-abnormal.png"),
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card>
      {/* Title */}
      <Text className="text-body text-secondary text-center font-regular">
        ระดับน้ำตาลในเลือดล่าสุดของฉัน
      </Text>

      {/* Date */}
      <Text className="text-tag font-regular text-secondary text-center mt-2">
        บันทึกล่าสุด ณ {date}
      </Text>

      {/* Blood Sugar Display */}
      <View className="pt-8">
        <Image
          source={currentStatus.image}
          className="mx-auto w-[150px] h-[150px]"
          resizeMode="contain"
        />
        <Text
          className={`text-title font-bold text-center ${currentStatus.color}`}
        >
          {currentStatus.text}
        </Text>
      </View>

      {/* Divider */}
      <BreakLine />

      {/* Status Message */}
      <View className="bg-background p-4 rounded-lg ">
        <Text className="text-description font-regular text-secondary text-center">
          {currentStatus.message}
        </Text>
      </View>
    </Card>
  );
};

export default BloodSugarStatus;
