import React from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type BaseProfileInputFieldProps = {
  icon: any;
  label: string;
  value: string;
  placeholder?: string;
};

type DatePickerProps = BaseProfileInputFieldProps & {
  isDatePicker: true;
  showDatePicker: boolean;
  onPressDate: () => void;
  onDateChange: (date: Date | undefined) => void;
  onChangeText?: never;
  tempDate?: Date;
};

type TextInputProps = BaseProfileInputFieldProps & {
  isDatePicker?: false;
  onChangeText: (text: string) => void;
  showDatePicker?: never;
  onPressDate?: never;
  onDateChange?: never;
  tempDate?: never;
};

type ProfileInputFieldProps = DatePickerProps | TextInputProps;

export const ProfileInputField = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder = "",
  isDatePicker = false,
  onDateChange,
  showDatePicker = false,
  onPressDate,
  tempDate,
}: ProfileInputFieldProps) => (
  <View className="flex-row items-center justify-between">
    {/* Label and Icon Section */}
    <View className="flex-row items-center">
      <Image source={icon} className="w-6 h-6" />
      <Text className="text-description text-secondary ml-2 font-regular">
        {label}
      </Text>
    </View>

    {/* Input Section */}
    {isDatePicker ? (
      <View>
        {/* Show date value only when picker is not open */}
        {!showDatePicker && (
          <TouchableOpacity
            className="bg-background rounded-lg w-[150px] px-4 py-2 mb-2"
            onPress={onPressDate}
          >
            <Text className="text-description text-secondary font-regular">
              {value || placeholder}
            </Text>
          </TouchableOpacity>
        )}

        {/* Date Picker */}
        {showDatePicker && (
          <View>
            <DateTimePicker
              value={tempDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "compact" : "default"}
              onChange={(event, selectedDate) => {
                if (event.type === "set") {
                  onDateChange && onDateChange(selectedDate);
                } else if (event.type === "dismissed") {
                  onDateChange && onDateChange(undefined);
                }
              }}
              maximumDate={new Date()}
            />
          </View>
        )}
      </View>
    ) : (
      /* Regular Text Input */
      <View className="bg-background rounded-lg w-[150px] px-4 py-2 mb-2">
        <TextInput
          className="text-description text-secondary font-regular"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      </View>
    )}
  </View>
);

export default ProfileInputField;
