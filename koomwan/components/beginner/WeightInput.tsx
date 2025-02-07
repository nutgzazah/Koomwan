import React from "react";
import { View, Text, Image, TextInput } from "react-native";

type WeightInputProps = {
  weight: string;
  setWeight: (value: string) => void;
};

export const WeightInput = ({ weight, setWeight }: WeightInputProps) => (
  <View className="flex-col items-center">
    <Image
      source={require("../../assets/BeginnerSetup/weight.png")}
      className="w-32 h-32 mb-6"
      resizeMode="contain"
    />
    <View className="w-full flex-row justify-center items-center space-x-2">
      <TextInput
        className="flex-1 bg-background rounded p-3 h-10 justify-center text-center text-description font-regular"
        placeholder="น้ำหนัก"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Text className="text-description text-secondary font-regular pl-4">
        กิโลกรัม
      </Text>
    </View>
  </View>
);
