import React from "react";
import { View, Text, Image } from "react-native";
import { getEmotionImage, getEmotionLabel } from "../../../constant/emotion";

const EmotionDisplay = ({
  mood,
}: {
  mood:
    | "laughing"
    | "happy"
    | "neutral"
    | "irritated"
    | "sick"
    | "crying"
    | "angry"
    | "none";
}) => (
  <View className="flex-row justify-center items-center mb-4">
    <Image
      source={getEmotionImage(mood)}
      className="w-16 h-16"
      resizeMode="contain"
    />
    <Text className="text-description text-secondary font-regular ml-4 items-center">
      {getEmotionLabel(mood)}
    </Text>
  </View>
);

export default EmotionDisplay;
