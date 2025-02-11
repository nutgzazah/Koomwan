import React, { useState } from "react";
import { TouchableOpacity, Text, Image } from "react-native";

interface LongButtonProps {
  title: string;
  onPress: () => void;
  iconSrc?: any;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  width?: string;
  height?: string;
}

export const LongButton: React.FC<LongButtonProps> = ({
  title,
  onPress,
  iconSrc,
  iconPosition = "left",
  className = "",
  disabled = false,
  width = "auto",
  height = "auto",
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    setIsSelected(true);  // เมื่อปุ่มถูกเลือก
    onPress();  // เรียกฟังก์ชันที่ถูกส่งเข้ามา
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      className={`rounded-lg py-4 px-8 flex-row items-center justify-center ${disabled ? "opacity-50" : ""} ${width} ${height} ${className} ${isSelected ? "bg-primary" : "bg-opacity-30"}`}
    >
      {iconSrc && iconPosition === "left" && (
        <Image source={iconSrc} className="w-5 h-5 mr-2" />
      )}
      <Text className="text-card text-button font-sans ">{title}</Text>
      {iconSrc && iconPosition === "right" && (
        <Image source={iconSrc} className="w-5 h-5 ml-2" />
      )}
    </TouchableOpacity>
  );
};

export default LongButton;
