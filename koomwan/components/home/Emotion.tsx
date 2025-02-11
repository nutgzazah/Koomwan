import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";

const Emotion = () => {
  // Function to get emotion image based on mood
  const getEmotionImage = (
    mood: "laugh" | "happy" | "none" | "cried" | "frustrated"
  ) => {
    const emotionMap: {
      [key in "laugh" | "happy" | "none" | "cried" | "frustrated"]: any;
    } = {
      laugh: require("../../assets/Home/emotion-laugh.png"),
      happy: require("../../assets/Home/emotion-happy.png"),
      none: require("../../assets/Home/emotion-none.png"),
      cried: require("../../assets/Home/emotion-cried.png"),
      frustrated: require("../../assets/Home/emotion-frustrated.png"),
    };
    return emotionMap[mood] || emotionMap.none;
  };

  // Function to get text color based on BMI value
  const getBMIColor = (bmi: string) => {
    if (!bmi || bmi === "-") return "text-gray";
    const bmiValue = parseFloat(bmi);

    if (bmiValue < 18.5) return "text-abnormal"; // Underweight
    if (bmiValue <= 22.9) return "text-primary"; // Normal
    if (bmiValue <= 24.9) return "text-warning"; // Overweight
    return "text-abnormal"; // Obese
  };

  // Mock data structure - API later
  type Mood = "laugh" | "happy" | "none" | "cried" | "frustrated";

  const mockData: { day: string; bmi: string; mood: Mood; hasPill: boolean }[] =
    [
      {
        day: "อา.",
        bmi: "22.14",
        mood: "laugh",
        hasPill: true,
      },
      {
        day: "จ.",
        bmi: "23.14",
        mood: "happy",
        hasPill: false,
      },
      {
        day: "อ.",
        bmi: "-",
        mood: "none",
        hasPill: false,
      },
      {
        day: "พ.",
        bmi: "22.39",
        mood: "happy",
        hasPill: true,
      },
      {
        day: "พฤ.",
        bmi: "22.87",
        mood: "cried",
        hasPill: false,
      },
      {
        day: "ศ.",
        bmi: "23.86",
        mood: "frustrated",
        hasPill: true,
      },
      {
        day: "ส.",
        bmi: "25.61",
        mood: "cried",
        hasPill: true,
      },
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
              className={`text-tag font-regular ${getBMIColor(item.bmi)} mb-2`}
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
      <TouchableOpacity className="w-full bg-primary py-4 rounded-lg flex-row justify-center items-center">
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
