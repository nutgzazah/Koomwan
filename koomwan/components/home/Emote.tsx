import React from "react";
import { View, Image, Text, SafeAreaView } from "react-native";
import { getEmotionImage, getEmotionLabel } from "../../constant/emotion";

type EmotionType =
  | "laughing"
  | "happy"
  | "neutral"
  | "irritated"
  | "sick"
  | "crying"
  | "angry"
  | "none";

interface EmoteDisplayProps {
  mood: EmotionType;
}

const EmoteDisplay: React.FC<EmoteDisplayProps> = ({ mood }) => {
  const emotionImage = getEmotionImage(mood);
  const emotionLabel = getEmotionLabel(mood);

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 bg-white justify-evenly my-8">
        <Image
          source={emotionImage}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <Text className="text-description font-regular text-center text-secondary ml-3">
          {emotionLabel}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EmoteDisplay;
