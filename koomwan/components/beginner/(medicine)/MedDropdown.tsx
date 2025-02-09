import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

type MedDropdownProps = {
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

const MedDropdown = ({
  value,
  options,
  onSelect,
  disabled = false,
  error = false,
}: MedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-[50px] px-4 border rounded-[5px] flex-row items-center justify-between  ${
          error ? "border-abnormal" : "border-gray"
        } ${disabled ? "bg-gray-100" : "bg-background"}`}
      >
        <Text
          className={`text-description font-regular ${
            value ? "text-secondary" : "text-gray"
          }`}
        >
          {value || "เลือกประเภทยา"}
        </Text>
        <Image
          source={
            isOpen
              ? require("../../../assets/Doctor/icon/drop_up.png")
              : require("../../../assets/Doctor/icon/drop_down.png")
          }
          className="w-6 h-6"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute top-12 left-0 right-0 bg-card border border-gray rounded z-10">
          <ScrollView className="max-h-48">
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className="p-4 border-b border-gray"
              >
                <Text className="text-description text-secondary font-regular">
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MedDropdown;
