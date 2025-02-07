import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

type BirthdayInputProps = {
  day: string;
  month: string;
  year: string;
  onPressDay: () => void;
  onPressMonth: () => void;
  onPressYear: () => void;
};

export default function BirthdayInput({
  day,
  month,
  year,
  onPressDay,
  onPressMonth,
  onPressYear,
}: BirthdayInputProps) {
  return (
    <View className="flex-col items-center">
      <Image
        source={require("../../assets/BeginnerSetup/cake.png")}
        className="w-[100px] h-[100px] mb-6"
        resizeMode="contain"
      />
      <View className="flex-row space-x-4 w-full p-1 ">
        <TouchableOpacity
          className="flex-1 bg-background rounded p-3 h-10 justify-center"
          onPress={onPressDay}
        >
          <Text
            className={`text-center text-description font-regular ${
              day ? "text-secondary" : "text-gray"
            }`}
          >
            {day || "วันที่"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-background p-3 h-10 justify-center"
          onPress={onPressMonth}
        >
          <Text
            className={`text-center text-description font-regular ${
              month ? "text-secondary" : "text-gray"
            }`}
          >
            {month || "เดือน"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-background rounded p-3 h-10 justify-center"
          onPress={onPressYear}
        >
          <Text
            className={`text-center text-description font-regular ${
              year ? "text-secondary" : "text-gray"
            }`}
          >
            {year || "ปี"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
