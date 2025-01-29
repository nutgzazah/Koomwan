import React from "react";
import { View, Text, Image, TextInput } from "react-native";

type HeightInputProps = {
  height: string;
  setHeight: (value: string) => void;
};

export const HeightInput = ({ height, setHeight }: HeightInputProps) => (
  <View className="flex-col items-center">
    <Image
      source={require("../../assets/BeginnerSetup/ruler&pen.png")}
      className="w-32 h-32 mb-6"
      resizeMode="contain"
    />
    <View className="w-full flex-row justify-center items-center space-x-2">
      <TextInput
        className="flex-1 bg-background rounded p-3 text-center text-description font-regular"
        placeholder="ส่วนสูง"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <Text className="text-description text-secondary font-regular pl-4">
        เซนติเมตร
      </Text>
    </View>
  </View>
);
