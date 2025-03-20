import React from "react";
import { 
  TouchableOpacity, 
  Text 
} from "react-native";

interface LongButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isCompleted?: boolean;
  customStyle?: string;
}

export const LongButton: React.FC<LongButtonProps> = ({
  title,
  onPress,
  disabled = false,
  isCompleted = false,
  customStyle = "",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      className={`w-full h-14 rounded-lg flex-row items-center justify-center mt-1
        ${isCompleted ? "bg-blue-600" : "bg-gray-300"}
        ${disabled ? "opacity-50" : ""}
        ${customStyle}`}
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default LongButton;
