import { Text, View, Image } from "react-native";
import React from "react";

interface SlideCardImgProps {
  title: string;
  description: string;
  imageSrc: any;
  onPress: () => void;
}

export default function SlideCardImg({ title, description, imageSrc }: SlideCardImgProps) {
  return (
    <View className="bg-card shadow-lg rounded-xl w-60 mx-2 mb-6">
      <Image source={imageSrc} className="w-full h-40 rounded-lg mb-2" resizeMode="cover" />
      <Text className="text-lg font-sans text-secondary text-center mt-2">
        {title}
      </Text>
      <Text className="text-base font-sans text-primary text-center mt-1">
        {description}
      </Text>
    </View>
  );
}
