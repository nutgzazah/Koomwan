import { 
  Text, 
  SafeAreaView, 
  ScrollView, 
  View, 
  TouchableOpacity, 
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { LongButton } from "./components/LongButton";
import MoodSelecter from "./components/MoodSelecter";
import InputFieldOne from "./components/InputFieldOne";

// To Format Global To Thai Date
const formatThaiDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const thaiYear = date.getFullYear() + 543;
  return `${day}/${month}/${thaiYear}`;
};

// To Format Global To Thai Timing
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function TrackingScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    weight: "",
    height: "",
    bloodSugar: "",
    a1c: "",
    bloodPressure: {
      systolic: "",
      diastolic: ""
    },
    mood: ""
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    weight: "",
    height: "",
    bloodSugar: "",
    a1c: "",
    bloodPressure: {
      systolic: "",
      diastolic: ""
    },
  });

  // Validation for required fields
  const requiredFields = ["date", "time", "weight", "height"];
  const isFormComplete = requiredFields.every(
    (field) => formData[field as keyof typeof formData] !== ""
  );

  // Validation For Input
  const ranges: Record<string, [number, number]> = {
    weight: [30, 300],
    height: [100, 250],
    bloodSugar: [50, 600],
    a1c: [4, 14],
    bloodPressureSystolic: [50, 250],
    bloodPressureDiastolic: [30, 200],
  };

  // Validate Input
  const validateInput = (name: string, value: string) => {
    const numValue = parseFloat(value);
    const fieldNames: Record<string, string> = {
      weight: "น้ำหนัก",
      height: "ส่วนสูง",
      bloodSugar: "น้ำตาลในเลือด",
      a1c: "ค่า HbA1c",
      bloodPressureSystolic: "ความดันตัวบน",
      bloodPressureDiastolic: "ความดันตัวล่าง"
    };

    if (!/^\d*\.?\d*$/.test(value) || (ranges[name] && (numValue < ranges[name][0] || numValue > ranges[name][1]))) {
      return `กรุณากรอก ${fieldNames[name] || name} ให้ถูกต้อง`;
    }
    return "";
  };

  // Handle Input Change
  const handleChange = (field: string, value: string | { systolic: string; diastolic: string }) => {
    if (field === "bloodPressure" && typeof value === "object") {
      const systolicError = validateInput("bloodPressureSystolic", value.systolic);
      const diastolicError = validateInput("bloodPressureDiastolic", value.diastolic);

      setErrorMessages((prev) => ({
        ...prev,
        bloodPressure: {
          systolic: systolicError,
          diastolic: diastolicError
        }
      }));

      setFormData((prev) => ({
        ...prev,
        bloodPressure: { ...prev.bloodPressure, ...value }
      }));
    } else {
      const error = validateInput(field, value as string);

      setErrorMessages((prev) => ({
        ...prev,
        [field]: error
      }));

      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Validation Before Submit
  const handleSubmit = () => {
    const requiredFields = ["date", "time", "weight", "height"];
    if (requiredFields.some((field) => !formData[field as keyof typeof formData])) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    router.push("./medicineCollected");
  };

  // Date And Time Picker Handle
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: formatThaiDate(selectedDate),
      }));
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData((prev) => ({
        ...prev,
        time: formatTime(selectedTime),
      }));
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24">
        {/* Card One - Date And Time Input */}
        <Card>
          <Text className="text-display font-bold font-sans text-secondary text-center mt-1">บันทึกข้อมูลสุขภาพ</Text>

          {/* Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} className="mt-2">
            <InputFieldOne
              label="วันที่"
              value={formData.date}
              placeholder="เลือกวันที่"
              editable={false}
              rightIcon={require("../../../assets/Tracking/calendar.png")}
            />
          </TouchableOpacity>

          {/* Time */}
          <TouchableOpacity onPress={() => setShowTimePicker(true)} className="mb-1">
            <InputFieldOne
              label="เวลา"
              value={formData.time}
              placeholder="เลือกเวลา"
              editable={false}
              rightIcon={require("../../../assets/Tracking/clock.png")}
            />
          </TouchableOpacity>
        </Card>

        {/* Card Two - Health Information */}
        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-1">ข้อมูลสุขภาพ</Text>
          <BreakLine />

          {/* Weight And Height With The Same Line */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="น้ำหนัก"
                value={formData.weight}
                onChangeText={(value) => handleChange("weight", value)}
                placeholder=" เช่น 60"
                keyboardType="numeric"
                errorMessage={errorMessages.weight}
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ส่วนสูง"
                value={formData.height}
                onChangeText={(value) => handleChange("height", value)}
                placeholder="เช่น 160"
                keyboardType="numeric"
                errorMessage={errorMessages.height}
              />
            </View>
          </View>

          {/* Blood Sugar */}
          <InputFieldOne
            label="ค่าระดับน้ำตาลในเลือด (Optional)"
            value={formData.bloodSugar}
            onChangeText={(value) => handleChange("bloodSugar", value)}
            placeholder="เช่น 90"
            keyboardType="numeric"
            errorMessage={errorMessages.bloodSugar}
          />

          {/* A1c */}
          <InputFieldOne
            label="ค่าเฉลี่ยน้ำตาลในเลือด HbA1c (Optional)"
            value={formData.a1c}
            onChangeText={(value) => handleChange("a1c", value)}
            placeholder="เช่น 5.6"
            keyboardType="numeric"
            errorMessage={errorMessages.a1c}
          />

          {/* Blood Pressure */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวบน (Optional)"
                value={formData.bloodPressure.systolic}
                onChangeText={(value) => handleChange("bloodPressure", { ...formData.bloodPressure, systolic: value })}
                placeholder="เช่น 120"
                keyboardType="numeric"
                errorMessage={errorMessages.bloodPressure.systolic}
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวล่าง (Optional)"
                value={formData.bloodPressure.diastolic}
                onChangeText={(value) => handleChange("bloodPressure", { ...formData.bloodPressure, diastolic: value })}
                placeholder="เช่น 80"
                keyboardType="numeric"
                errorMessage={errorMessages.bloodPressure.diastolic}
              />
            </View>
          </View>
        </Card>

        {/* Card Three - ข้อมูลอารมณ์ */}
        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-1">ข้อมูลอารมณ์</Text>
          <BreakLine />

          <Text className="text-description font-sans font-bold text-secondary text-center mb-1">วันนี้คุณรู้สึกอย่างไร . . . (Optional)</Text>
          <MoodSelecter selectedMood={formData.mood} onSelect={(mood) => handleChange("mood", mood)} />
        </Card>

        {/* Go To The MedicineCollected */}
        <View className="items-center w-full px-4">
          <LongButton
            title="ถัดไป"
            onPress={handleSubmit}
            disabled={!isFormComplete}
            isCompleted={isFormComplete}
            customStyle={isFormComplete ? "bg-blue-600" : "bg-gray"}
          />
        </View>

        {/* Date Picker - Replaces Input field with picker */}
        {showDatePicker && (
          <View style={{ position: "absolute", top: 115, left: 24, width: "100%" }}>
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="compact"
              onChange={handleDateChange}
            />
          </View>
        )}

        {/* Time Picker - Replaces Input field with picker */}
        {showTimePicker && (
          <View style={{ position: "absolute", top: 205, left: 22, width: "100%" }}>
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="compact"
              onChange={handleTimeChange}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}