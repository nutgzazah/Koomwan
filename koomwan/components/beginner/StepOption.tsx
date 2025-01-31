import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type StepOptionProps = {
  option: {
    id: string;
    icon: any;
    label: string;
  };
  onSelect: (id: string) => void;
};

export const StepOption = ({ option, onSelect }: StepOptionProps) => (
  <TouchableOpacity
    key={option.id}
    className="w-full bg-card rounded-lg p-4 mb-4 shadow-sm"
    onPress={() => onSelect(option.id)}
  >
    <View className="flex-col items-center">
      <Image
        source={option.icon}
        className="w-[100px] h-[100px]"
        resizeMode="contain"
      />
      <Text className="text-description text-secondary font-medium">
        {option.label}
      </Text>
    </View>
  </TouchableOpacity>
);
