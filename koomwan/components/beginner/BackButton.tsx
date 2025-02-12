import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";

type BeginnerBackButtonProps = {
  onPress: () => void;
};

export const BeginnerBackButton = ({ onPress }: BeginnerBackButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row ml-6 mt-6 mb-3 items-center"
  >
    <Image
      source={require("../../assets/Signup/arrow-circle-left.png")}
      className="w-6 h-6"
      resizeMode="contain"
    />
    <Text className="text-body text-secondary font-regular ml-2">ย้อนกลับ</Text>
  </TouchableOpacity>
);
