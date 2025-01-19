// components/common/StatusScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { AuthLayout } from "./AuthLayout";

type StatusScreenProps = {
  status: "success" | "error";
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
  backgroundImage: any;
};

export const StatusScreen = ({
  status,
  title,
  description,
  buttonText,
  onButtonPress,
  backgroundImage,
}: StatusScreenProps) => {
  const getStatusImage = () => {
    return status === "success"
      ? require("../../assets/Login/tick-circle.png")
      : require("../../assets/Login/close-circle.png");
  };

  return (
    <AuthLayout backgroundImage={backgroundImage}>
      <View className="items-center pt-8">
        <View className="p-4 mb-4">
          <Image
            source={getStatusImage()}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>

        <Text className="text-display font-bold text-secondary mb-2">
          {title}
        </Text>

        <Text className="text-description text-secondary mb-8 font-regular">
          {description}
        </Text>

        <View className="h-[1px] w-full bg-gray mb-8" />

        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-[5px]"
          onPress={onButtonPress}
        >
          <Text className="text-card text-center font-bold text-button">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};
