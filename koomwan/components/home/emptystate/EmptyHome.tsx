import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
interface EmptyStateProps {
  header?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  navigateTo?: string;
  icon?: any; // Optional icon source
}

const EmptyHomeCard = ({
  header = "สุขภาพโดยรวม",
  title = "ยังไม่มีข้อมูลสุขภาพ",
  subtitle = "กรุณาบันทึกข้อมูลสุขภาพเพื่อแสดงผลการวิเคราะห์",
  buttonText = "บันทึกข้อมูลสุขภาพ",
  navigateTo = "/(tabs)/tracking",
  icon = require("../../../assets/Home/none.png"), // Default icon
}: EmptyStateProps) => {
  const router = useRouter();

  return (
    <Card>
      <View className="w-full justify-center items-center">
        <Text className="text-title font-bold text-secondary text-center">
          {header}
        </Text>
        <BreakLine />

        <View className="py-6 px-6 items-center">
          <Image
            source={icon}
            className="w-[150px] h-[150px] mb-2"
            resizeMode="contain"
          />
          <Text className="text-body font-medium text-secondary mb-2 text-center">
            {title}
          </Text>
          <Text className="text-description font-regular text-secondary mb-6 text-center">
            {subtitle}
          </Text>

          <TouchableOpacity
            className="bg-primary py-3 px-6 rounded-md"
            onPress={() => router.push(navigateTo)}
          >
            <Text className="text-button font-bold text-card">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default EmptyHomeCard;
