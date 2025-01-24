import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";

interface ShortButtonProps {
  title: string; // ข้อความบนปุ่ม
  onPress: () => void; // ฟังก์ชันเมื่อกดปุ่ม
  iconSrc?: any; // ไอคอนหรือรูปภาพ (optional)
  iconPosition?: "left" | "right"; // ตำแหน่งของไอคอน (default: left)
  className?: string; // Tailwind CSS class สำหรับปรับแต่งเพิ่มเติม
}

export const ShortButton: React.FC<ShortButtonProps> = ({
  title,
  onPress,
  iconSrc,
  iconPosition = "left",
  className,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`bg-primary rounded-lg py-3 px-5 flex-row items-center justify-center ${className}`}
  >
    {iconSrc && iconPosition === "left" && (
      <Image source={iconSrc} className="w-5 h-5 mr-2" />
    )}
    <Text className="color-card text-lg font-sans">{title}</Text>
    {iconSrc && iconPosition === "right" && (
      <Image source={iconSrc} className="w-5 h-5 ml-2" />
    )}
  </TouchableOpacity>
);
