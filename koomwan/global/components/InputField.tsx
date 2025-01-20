import React from "react";
import { View, TextInput, Image, TouchableOpacity } from "react-native";

/**
 * InputField Component
 *
 * @example
 * // Basic usage with only left icon
 * <InputField
 *   value={username}
 *   onChangeText={setUsername}
 *   placeholder="Enter username"
 *   leftIcon={require("../assets/user-icon.png")}
 * />
 *
 * @example
 * // Usage with right icon (e.g., password field with show/hide functionality)
 * <InputField
 *   value={password}
 *   onChangeText={setPassword}
 *   placeholder="Enter password"
 *   leftIcon={require("../assets/lock-icon.png")}
 *   rightIcon={showPassword ? eyeIcon : eyeSlashIcon}
 *   onRightIconPress={() => setShowPassword(!showPassword)}
 *   secureTextEntry={!showPassword}
 * />
 *
 * @example
 * // Usage with error state
 * <InputField
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter email"
 *   leftIcon={require("../assets/email-icon.png")}
 *   hasError={!isValidEmail}
 * />
 */

type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  leftIcon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  hasError?: boolean;
};

export default function InputField({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  hasError = false,
}: InputFieldProps) {
  return (
    <View className="relative">
      {/* Left Icon */}
      <Image
        source={leftIcon}
        className="w-6 h-6 absolute left-4 top-4 z-10"
        resizeMode="contain"
      />

      {/* Input Field */}
      <TextInput
        className={`w-full h-[50px] pl-12 mb-3 pr-${
          rightIcon ? "12" : "4"
        } border rounded-[5px] text-description font-bold ${
          hasError ? "border-abnormal" : "border-gray"
        } bg-background`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#C6C6C6"
      />

      {/* Optional Right Icon */}
      {rightIcon && (
        <TouchableOpacity
          className="absolute right-4 top-4 z-10"
          onPress={onRightIconPress}
        >
          <Image source={rightIcon} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}
