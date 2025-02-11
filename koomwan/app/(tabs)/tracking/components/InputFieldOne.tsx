import React from "react";
import { View, Text, TextInput, Image, KeyboardTypeOptions } from "react-native";
import DropdownChoice from "./Dropdown";

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
  onOtherTextChange
}) => {
  return (
    <View className="mb-2 px-1 py-1">
      <Text className="text-description font-bold font-sans text-secondary mb-2">{label}</Text>

      {choices ? (
        <DropdownChoice
          choices={choices}
          selectedChoice={selectedChoice || value}
          onChoiceChange={onChoiceChange}
          onOtherTextChange={onOtherTextChange}
        />
      ) : (
        <View className={`bg-background border ${errorMessage ? 'border-red-500' : 'border-gray'} rounded-lg`}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="gray"
            keyboardType={keyboardType}
            maxLength={maxLength}
            editable={editable}
            className="font-sans text-description"
            style={{
              width: 300,
              height: 38, //แคบหน่อย
              paddingLeft: 7,
              paddingRight: 7,
            }}
          />
          {rightIcon && (
            <Image
              source={rightIcon}
              className="w-7 h-7 absolute right-3 top-1/2 transform -translate-y-1/2"
            />
          )}
        </View>
      )}

      {errorMessage && <Text className="font-sans text-red-500 text-sub-button">{errorMessage}</Text>}
    </View>
  );
};

export default InputFieldOne;
