import React from "react";
import { View, Image, Text, TextInput } from "react-native";

type ProfileInputFieldProps = {
  icon: any;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export const ProfileInputField = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder = "",
}: ProfileInputFieldProps) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center">
      <Image source={icon} className="w-6 h-6" />
      <Text className="text-description text-secondary ml-2 font-regular">
        {label}
      </Text>
    </View>
    <View className="bg-[#F8F8F8] rounded-lg w-40 px-4 py-2">
      <TextInput
        className="text-description text-secondary font-regular"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  </View>
);

export default ProfileInputField;
