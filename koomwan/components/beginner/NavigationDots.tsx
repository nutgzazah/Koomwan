import React from "react";
import { View, Text } from "react-native";

type NavigationDotsProps = {
  currentStep: number;
  totalSteps: number;
  message: string;
};

const PaginationDot = ({ isActive }: { isActive: boolean }) => (
  <View
    className={`h-1.5 rounded-full mr-1 ${
      isActive ? "w-10 bg-primary" : "w-10 bg-unread"
    }`}
  />
);

export default function NavigationDots({
  currentStep,
  totalSteps,
  message,
}: NavigationDotsProps) {
  return (
    <View className="items-center mt-2">
      <Text className="text-description text-secondary font-regular mb-4 text-center">
        {message}
      </Text>
      <View className="flex-row justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <PaginationDot key={index} isActive={index === currentStep} />
        ))}
      </View>
    </View>
  );
}
