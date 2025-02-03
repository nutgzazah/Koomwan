import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

type ProfileDropdownProps = {
  icon: any;
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  hasError?: boolean;
};

export default function ProfileDropdown({
  icon,
  label,
  value,
  options,
  onSelect,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      {/* Container for Label and Dropdown */}
      <View className="flex-row items-center justify-between">
        {/* Label and Icon */}
        <View className="flex-row items-center">
          <Image source={icon} className="w-6 h-6" />
          <Text className="text-description font-regular text-secondary ml-2">
            {label}
          </Text>
        </View>

        {/* Dropdown Container */}
        <View className="relative mb-2">
          {/* Dropdown Button */}
          <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            className="bg-background rounded-lg w-[150px] px-4 py-2  flex-row items-center justify-between"
          >
            <Text
              className={`text-description font-regular ${
                value ? "text-secondary" : "text-gray"
              }`}
            >
              {value || `เลือก${label}`}
            </Text>
            <Image
              source={
                isOpen
                  ? require("../../assets/Profile/drop-up.png")
                  : require("../../assets/Profile/drop-down.png")
              }
              className="w-4 h-4"
            />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {isOpen && (
            <View className="absolute top-12 right-0 w-[150px] bg-card border border-gray rounded-[5px] z-10">
              <ScrollView className="max-h-32">
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      onSelect(option);
                      setIsOpen(false);
                    }}
                    className={`p-2 pl-4 ${
                      index < options.length - 1 ? "border-b border-gray" : ""
                    }`}
                  >
                    <Text className="text-description text-secondary font-regular">
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
