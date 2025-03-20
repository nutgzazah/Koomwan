import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import { useRouter } from "expo-router";
import { getEmotionImage } from "../../constant/emotion";
import { getBMICategory } from "../../util/bmi";

const Emotion = () => {
  const router = useRouter();

  // Function to get text color based on BMI value
  const getBMIColor = (bmi: string) => {
    if (!bmi || bmi === "-") return "text-gray";
    const bmiValue = parseFloat(bmi);
    const { color } = getBMICategory(bmiValue);
    return color;
  };

  // Mock data structure - API later
  type Mood =
    | "laughing"
    | "happy"
    | "neutral"
    | "irritated"
    | "sick"
    | "crying"
    | "angry"
    | "none";

  const mockData: { day: string; bmi: string; mood: Mood; hasPill: boolean }[] =
    [
      { day: "อา.", bmi: "22.14", mood: "laughing", hasPill: true },
      { day: "จ.", bmi: "23.14", mood: "happy", hasPill: false },
      { day: "อ.", bmi: "-", mood: "none", hasPill: false },
      { day: "พ.", bmi: "22.39", mood: "happy", hasPill: true },
      { day: "พฤ.", bmi: "22.87", mood: "crying", hasPill: false },
      { day: "ศ.", bmi: "23.86", mood: "irritated", hasPill: true },
      { day: "ส.", bmi: "25.61", mood: "crying", hasPill: true },
    ];

  return (
    <Card>
      <Text className="text-title text-secondary font-regular">ภาพรวม</Text>
      <BreakLine />

      {/* Emotion Grid */}
      <View className="flex-row justify-between w-full mb-8">
        {mockData.map((item, index) => (
          <View key={index} className="items-center">
            {/* Emotion Icon */}
            <View className="w-12 h-12 items-center justify-center mb-2">
              <Image
                source={getEmotionImage(item.mood)}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </View>

            {/* BMI Value */}
            <Text
              className={`text-tag font-regular mb-2`}
              style={{ color: getBMIColor(item.bmi) }}
            >
              {item.bmi}
            </Text>

            {/* Day */}
            <Text className="text-description font-regular text-secondary mb-2">
              {item.day}
            </Text>

            {/* Pill Indicator */}
            {item.hasPill && (
              <View className="w-6 h-6">
                <Image
                  source={require("../../assets/Home/medicine.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Calendar Button */}
      <TouchableOpacity
        className="w-full bg-primary py-4 rounded-lg flex-row justify-center items-center"
        onPress={() => router.push("/home/calendarView")}
      >
        <Text className="text-button font-bold text-card mr-2">
          มุมมองปฏิทิน
        </Text>
        <Image
          source={require("../../assets/Home/calendar.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Card>
  );
};

export default Emotion;
