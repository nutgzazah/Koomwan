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
    bloodPressure: "",
    mood: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    weight: "",
    height: "",
    bloodSugar: "",
    a1c: "",
    bloodPressure: "",
  });

  //Validation For Input
  const validateInput = (name: string, value: string) => {
    const numValue = parseFloat(value);
    const ranges: Record<string, [number, number]> = {
      weight: [30, 300],
      height: [100, 250],
      bloodSugar: [50, 600],
      a1c: [4, 14],
      bloodPressure: [50, 250],
    };

    if (!/^\d*\.?\d*$/.test(value) || (ranges[name] && (numValue < ranges[name][0] || numValue > ranges[name][1]))) {
      return `กรุณากรอก ${name} ให้ถูกต้อง`; 
    }
    return "";
  };

  const handleChange = (name: string, value: string) => {
    setErrorMessages((prev) => ({
      ...prev,
      [name]: validateInput(name, value),
    }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  //Validation Before Submit
  const handleSubmit = () => {
    if (Object.values(formData).some((value) => value === "")) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    router.push("./tracking/medicineCollected");
  };

  //Date And Time Picker Handle
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
        <Card >
          <Text className="text-title font-bold font-sans text-secondary text-center mt-2">บันทึกข้อมูลสุขภาพ</Text>
          <BreakLine />

          {/* Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} className="mb-1">
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
          <View className="flex-row justify-between ">
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
            
            <View className="w-1/2 ">
              <InputFieldOne
                label="ส่วนสูง"
                value={formData.height}
                onChangeText={(value) => handleChange("height", value)}
                placeholder="เช่น 160 "
                keyboardType="numeric"
                errorMessage={errorMessages.height}
              />
            </View>
          </View>

          {/* Blood Sugar */}
          <InputFieldOne
            label="ค่าระดับน้ำตาลในเลือด"
            value={formData.bloodSugar}
            onChangeText={(value) => handleChange("bloodSugar", value)}
            placeholder="mg/dL เช่น 90"
            keyboardType="numeric"
            errorMessage={errorMessages.bloodSugar}
          />

          {/* A1c */}
          <InputFieldOne
            label="ค่า A1c"
            value={formData.a1c}
            onChangeText={(value) => handleChange("a1c", value)}
            placeholder="% เช่น 5.6"
            keyboardType="numeric"
            errorMessage={errorMessages.a1c}
          />

          {/* Blood Pressure */}
          <InputFieldOne
            label="ค่าความดันโลหิต"
            value={formData.bloodPressure}
            onChangeText={(value) => handleChange("bloodPressure", value)}
            placeholder="mmHg เช่น 120/80"
            keyboardType="numeric"
            errorMessage={errorMessages.bloodPressure}
          />
        </Card>

        {/* Card Three - ข้อมูลอารมณ์ */}
        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-1">ข้อมูลอารมณ์</Text>
          <BreakLine />

          <Text className="text-body font-sans text-secondary text-center mb-2">วันนี้คุณรู้สึกอย่างไร . . .</Text>
          <MoodSelecter selectedMood={formData.mood} onSelect={(mood) => handleChange("mood", mood)} />
        </Card>

        {/* Go To The MedicineCollected */}
        <LongButton title="ถัดไป" onPress={handleSubmit} />

        {/* Date Picker - Replaces Input field with picker */}
        {showDatePicker && (
          <View style={{ position: "absolute", top: 140, left: 22, width: "100%" }}>
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
          <View style={{ position: "absolute", top: 238, left: 22, width: "100%" }}>
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
