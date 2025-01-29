import React from "react";
import { TouchableOpacity, Text } from "react-native";

type NextButtonProps = {
  onPress: () => void;
  disabled: boolean;
  isLastStep: boolean;
};

export const NextButton = ({
  onPress,
  disabled,
  isLastStep,
}: NextButtonProps) => (
  <TouchableOpacity
    className={`w-full py-4 rounded ${disabled ? "bg-gray" : "bg-primary"}`}
    onPress={onPress}
    disabled={disabled}
  >
    <Text className="text-card text-center font-bold text-button">
      {isLastStep ? "เสร็จสิ้น" : "ต่อไป"}
    </Text>
  </TouchableOpacity>
);
