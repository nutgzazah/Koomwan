import React from "react";
import { View, Text, Image } from "react-native";
import Card from "../../global/components/Card";

const BMIScale = () => {
  const indicators = [
    { range: 6, color: "bg-primary" }, // Underweight < 18.5
    { range: 6, color: "bg-normal" }, // Normal 18.6-24
    { range: 6, color: "bg-warning" }, // Overweight 25-29.9
    { range: 6, color: "bg-abnormal" }, // Obese > 30
  ];

  return (
    <View className="w-full mt-4">
      <View className="flex flex-row justify-between w-full gap-0">
        {indicators.map((section, sectionIndex) =>
          Array(section.range)
            .fill(0)
            .map((_, i) => (
              <View
                key={`${sectionIndex}-${i}`}
                className={`h-8 w-2.5 rounded-[7px] mb-1 ${section.color}`}
              />
            ))
        )}
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-xs text-secondary font-regular">16.2</Text>
        <Text className="text-xs text-secondary font-regular">18.6</Text>
        <Text className="text-xs text-secondary font-regular">25.1</Text>
        <Text className="text-xs text-secondary font-regular">33.4</Text>
        <Text className="text-xs text-secondary font-regular">42.8</Text>
      </View>
    </View>
  );
};

const UserInfo = () => {
  const info = [
    { label: "น้ำหนัก", value: "65 กก." },
    { label: "ส่วนสูง", value: "168 ซม." },
    { label: "อายุ", value: "26 ปี" },
    { label: "เพศ", value: "ชาย" },
  ];

  return (
    <View className="flex flex-row justify-between w-full mt-6 bg-background p-4 rounded-[10px]">
      {info.map((item, index) => (
        <View key={index} className="items-center">
          <Text className="text-description font-regular text-secondary">
            {item.value}
          </Text>
          <Text className="text-tag font-regular text-secondary">
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const BMIDisplay = () => {
  const bmiValue = 30;

  // Function to determine BMI status and color
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) {
      return { status: "ผอมเกินไป", colorClass: "text-primary" };
    } else if (bmi >= 18.5 && bmi < 25) {
      return { status: "สมส่วน", colorClass: "text-normal" };
    } else if (bmi >= 25 && bmi < 30) {
      return { status: "อ้วน", colorClass: "text-warning" };
    } else {
      return { status: "อ้วนมาก", colorClass: "text-abnormal" };
    }
  };

  const { status, colorClass } = getBMIStatus(bmiValue);

  return (
    <View className="items-center flex-row">
      <Image
        source={require("../../assets/Home/body.png")}
        className="w-[80px] h-[80px] mr-1"
      />
      <View className="px-2 py-2 rounded-full items-center">
        <Text className={`${colorClass} text-display font-bold mb-2`}>
          {status}
        </Text>
        <Text className="text-tag font-regular text-secondary mb-2">
          {bmiValue} กก./ม.²
        </Text>
      </View>
    </View>
  );
};

export default function BMI() {
  return (
    <Card>
      <View className="p-4 items-center">
        <Text className="text-title font-regular text-secondary mb-2">
          ดัชนีมวลกายของฉัน
        </Text>
        <Text className="text-tag text-secondary font-regular mb-2">
          บันทึกล่าสุด ณ วันนี้ เวลา 13.32 น.
        </Text>

        <BMIDisplay />
        <BMIScale />
        <UserInfo />
      </View>
    </Card>
  );
}
