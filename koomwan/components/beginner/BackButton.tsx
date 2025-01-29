import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";

type BackButtonProps = {
  onPress: () => void;
};

export const BackButton = ({ onPress }: BackButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="px-4 mt-safe flex-row items-center"
  >
    <Image
      source={require("../../assets/Signup/arrow-circle-left.png")}
      className="w-6 h-6"
      resizeMode="contain"
    />
    <Text className="text-body text-secondary font-regular ml-2">ย้อนกลับ</Text>
  </TouchableOpacity>
);
