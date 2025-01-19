import React, { useRef } from "react";
import { View, TextInput } from "react-native";

type OTPInputProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
};

export function OTPInput({ length, value, onChange }: OTPInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChangeText = (text: string, index: number) => {
    // Create a new value by replacing the character at the current index
    const newValue = value.padEnd(length, "").split("");
    newValue[index] = text;
    const finalValue = newValue.join("").slice(0, length);

    onChange(finalValue);

    // Auto focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && index > 0 && !value[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between px-4">
      {[...Array(length)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className="w-12 h-12 border border-gray rounded-lg text-center text-xl bg-background"
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] || ""}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectionColor="#3972F0"
        />
      ))}
    </View>
  );
}
