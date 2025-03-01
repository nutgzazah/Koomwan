import React from "react";
import { View, Text, Image } from "react-native";
import BreakLine from "../../../global/components/BreakLine";

const BMISection = ({
  bmi,
  bmiCategory,
}: {
  bmi: number | null;
  bmiCategory: { text: string; color: string } | null;
}) => (
  <>
    <BreakLine />
    <View className="items-center mt-2">
      <Text className="text-headline text-secondary font-medium mb-4">
        ดัชนีมวลกายของฉัน
      </Text>
    </View>
    {bmi && bmiCategory ? (
      <View className="items-center mb-6 flex-row justify-center">
        <Image
          source={require("../../../assets/Home/body-blue.png")}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <View className="items-center px-3">
          <Text
            className="text-display font-bold mt-2"
            style={{ color: bmiCategory.color }}
          >
            {bmiCategory.text}
          </Text>
          <Text className="text-description text-secondary font-regular">
            {bmi.toFixed(2)} กก./ม.²
          </Text>
        </View>
      </View>
    ) : (
      <View className="items-center mb-6 flex-row justify-center">
        <Image
          source={require("../../../assets/Home/body.png")}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <View className="items-center px-3">
          <Text className="text-body font-regular mt-2">ไม่พบข้อมูล</Text>
          <Text className="text-tag text-secondary font-regular text-center">
            ยังไม่มีข้อมูลน้ำหนัก{"\n"}และส่วนสูง
          </Text>
        </View>
      </View>
    )}
  </>
);

export default BMISection;
