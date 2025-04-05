import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  KeyboardTypeOptions,
} from "react-native";
import DropdownChoice from "./DropDown";

interface InputFieldOneProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  rightIcon?: any;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  errorMessage?: string;
  choices?: string[];
  selectedChoice?: string;
  onChoiceChange?: (choice: string) => void;
  onOtherTextChange?: (text: string) => void;
  className?: string;
}

const InputFieldOne: React.FC<InputFieldOneProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  rightIcon,
  keyboardType = "default",
  maxLength,
  editable = true,
  errorMessage = "",
  choices,
  selectedChoice,
  onChoiceChange,
  onOtherTextChange,
  className = "",
}) => {
  return (
    <View className={`mb-2 px-1 py-1 w-full ${className}`}>
      <Text className="text-description font-bold font-sans text-secondary mb-2 w-full ">
        {label}
      </Text>

      {choices ? (
        <DropdownChoice
          choices={choices}
          selectedChoice={selectedChoice || value}
          onChoiceChange={onChoiceChange}
          onOtherTextChange={onOtherTextChange}
        />
      ) : (
        <View
          className={`mb-1 w-full bg-background border ${
            errorMessage ? "border-abnormal" : "border-gray"
          } rounded-lg flex-row items-center`}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="gray"
            keyboardType={keyboardType}
            maxLength={maxLength}
            editable={editable}
            className={`font-sans text-description flex-1 mx-1 w-full h-full ${className}`}
          />
          {rightIcon && <Image source={rightIcon} className="w-7 h-7 mr-3" />}
        </View>
      )}

      {errorMessage && (
        <Text className="font-sans text-abnormal text-description ">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default InputFieldOne;
