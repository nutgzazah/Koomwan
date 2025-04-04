import React from "react";
import {
  Text,
  View,
  Image,
  Pressable,
} from "react-native";

interface SlideCardImgProps {
  title: string;
  description: string;
  imageSrc: any;
  onPress?: () => void;
}

export default function SlideCardImg({
  title,
  description,
  imageSrc,
  onPress,
}: SlideCardImgProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="bg-card rounded-xl w-80 mx-2 mb-6">
        <Image source={imageSrc} className="w-full h-40 mb-2" resizeMode="cover" />
        <Text className="text-headline font-bold font-sans text-secondary text-center mt-2">
          {title}
        </Text>
        <Text className="text-description font-bold font-sans text-primary text-center mt-2">
          {description}
        </Text>
        <View className="bg-card h-10 rounded-xl" />
      </View>
    </Pressable>
  );
}
