import React from "react";
import { View, Text, Image, TextInput } from "react-native";

type HeightInputProps = {
  height: string;
  setHeight: (value: string) => void;
};

export const HeightInput = ({ height, setHeight }: HeightInputProps) => {
  const validateHeight = (value: string) => {
    if (value === "" || /^\d*$/.test(value)) {
      setHeight(value);
    }
  };

  const isHeightValid = (height: string) => {
    const heightNum = parseInt(height);
    return !height || (heightNum >= 100 && heightNum <= 299);
  };

  return (
    <View className="flex-col items-center w-full">
      <Image
        source={require("../../assets/BeginnerSetup/ruler&pen.png")}
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />
      <View className="w-full">
        <View className="flex-row justify-center items-center space-x-2">
          <TextInput
            className="flex-1 bg-background rounded-lg h-12 p-3 text-center text-description font-regular"
            placeholder="ส่วนสูง"
            keyboardType="numeric"
            value={height}
            onChangeText={validateHeight}
            maxLength={3}
          />
          <Text className="text-description text-secondary font-regular pl-4">
            เซนติเมตร
          </Text>
        </View>
        {height && !isHeightValid(height) && (
          <Text className="text-abnormal text-tag font-regular mt-2 text-center">
            กรุณาระบุส่วนสูงให้ถูกต้อง
          </Text>
        )}
      </View>
    </View>
  );
};

export default HeightInput;
