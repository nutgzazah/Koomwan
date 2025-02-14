import React from "react";
import { View, Text, Image, TextInput } from "react-native";

type WeightInputProps = {
  weight: string;
  setWeight: (value: string) => void;
};

export const WeightInput = ({ weight, setWeight }: WeightInputProps) => {
  const validateWeight = (value: string) => {
    if (value === "" || /^\d*$/.test(value)) {
      setWeight(value);
    }
  };

  const isWeightValid = (weight: string) => {
    const weightNum = parseInt(weight);
    return !weight || (weightNum > 30 && weightNum <= 200);
  };

  return (
    <View className="flex-col items-center w-full">
      <Image
        source={require("../../assets/BeginnerSetup/weight.png")}
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />
      <View className="w-full">
        <View className="flex-row justify-center items-center space-x-2">
          <TextInput
            className="flex-1 bg-background rounded-lg h-12 p-3 text-center text-description font-regular"
            placeholder="น้ำหนัก"
            keyboardType="numeric"
            value={weight}
            onChangeText={validateWeight}
            maxLength={3}
          />
          <Text className="text-description text-secondary font-regular pl-4">
            กิโลกรัม
          </Text>
        </View>
        {weight && !isWeightValid(weight) && (
          <Text className="text-abnormal text-tag font-regular mt-2 text-center">
            กรุณาระบุน้ำหนักให้ถูกต้อง
          </Text>
        )}
      </View>
    </View>
  );
};

export default WeightInput;
