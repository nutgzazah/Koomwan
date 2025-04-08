import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { LongButton } from "./components/LongButton";
import MoodSelecter from "./components/MoodSelecter";
import InputFieldOne from "./components/InputFieldOne";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";
import Loading from "../../../global/components/Loading";

// To Format Global To Thai Date
const formatThaiDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const thaiYear = date.getFullYear() + 543;
  return `${day}/${month}/${thaiYear}`;
};

// To Format Global To Thai Timing
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} น.`;
};

// แปลงวันที่ไทยเป็น Date object
const parseThaiDate = (thaiDateStr: string): Date | null => {
  try {
    const [day, month, thaiYear] = thaiDateStr.split("/").map(Number);
    if (!day || !month || !thaiYear) return null;

    const gregorianYear = thaiYear - 543;
    return new Date(gregorianYear, month - 1, day);
  } catch (error) {
    console.error("Error parsing Thai date:", error);
    return null;
  }
};

// เปรียบเทียบวันที่กับวันปัจจุบัน (ไม่รวมเวลา)
const isDateInPast = (dateToCheck: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateToCheckClone = new Date(dateToCheck);
  dateToCheckClone.setHours(0, 0, 0, 0);
  return dateToCheckClone < today;
};

export default function TrackingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: formatThaiDate(new Date()),
    time: formatTime(new Date()),
    weight: "",
    height: "",
    bloodSugar: "",
    a1c: "",
    bloodPressure: {
      systolic: "",
      diastolic: "",
    },
    mood: "",
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
      diastolic: "",
    },
    date: "",
  });

  // Fetch user's health info initially
  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        setLoading(true);
        // Get token and user info
        const authData = await AsyncStorage.getItem("@auth");

        if (!authData) {
          /* Alert.alert("Session Expired ", "Please login again"); */
          router.push("/user/login");
          return;
        }

        const auth = JSON.parse(authData);
        const token = auth.token;
        const userId = auth.user._id;
        const healthInfoId = auth.user.healthinfo;

        // Get health info data
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.user.healthinfo) {
          const healthInfo = response.data.user.healthinfo;

          // Fill form with health info data
          setFormData((prev) => ({
            ...prev,
            height: healthInfo.height ? healthInfo.height.toString() : "",
            weight: healthInfo.weight ? healthInfo.weight.toString() : "",
          }));
        }
      } catch (error) {
        console.error("Error fetching health info:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลสุขภาพได้");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthInfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // เคลียร์ข้อมูลเมื่อกลับมาที่หน้านี้
      const clearPreviousData = async () => {
        await AsyncStorage.removeItem("trackingFormData");
        await AsyncStorage.removeItem("selectedMedicines");

        // ตั้งค่าข้อมูลเริ่มต้นใหม่
        setFormData({
          date: formatThaiDate(new Date()),
          time: formatTime(new Date()),
          weight: "",
          height: "",
          bloodSugar: "",
          a1c: "",
          bloodPressure: {
            systolic: "",
            diastolic: "",
          },
          mood: "",
        });

        // เคลียร์ข้อความข้อผิดพลาด
        setErrorMessages({
          weight: "",
          height: "",
          bloodSugar: "",
          a1c: "",
          bloodPressure: {
            systolic: "",
            diastolic: "",
          },
          date: "",
        });
      };
      clearPreviousData();

      return () => {
        // ฟังก์ชันนี้จะทำงานเมื่อออกจากหน้า
      };
    }, [])
  );

  // Validation for required fields
  const requiredFields = ["date", "time", "weight", "height"];

  // ฟังก์ชันตรวจสอบว่าฟอร์มสมบูรณ์และสามารถไปหน้าต่อไปได้หรือไม่
  const isFormValid = (): boolean => {
    // ตรวจสอบว่าฟิลด์ที่จำเป็นมีการกรอกครบหรือไม่
    const requiredFieldsComplete = requiredFields.every(
      (field) => formData[field as keyof typeof formData] !== ""
    );

    // ตรวจสอบว่าไม่มีข้อผิดพลาดใดๆ ในฟอร์ม
    const noErrors = Object.values(errorMessages).every((error) => {
      if (typeof error === "string") {
        return error === "";
      } else if (typeof error === "object") {
        return Object.values(error).every((e) => e === "");
      }
      return true;
    });

    return requiredFieldsComplete && noErrors;
  };

  // Validation For Input
  const ranges: Record<string, [number, number]> = {
    weight: [30, 300],
    height: [100, 250],
    bloodSugar: [10, 600],
    a1c: [1, 14],
    bloodPressureSystolic: [50, 250],
    bloodPressureDiastolic: [30, 200],
  };

  // Validate Input
  const validateInput = (name: string, value: string) => {
    // ถ้าค่าว่าง (ไม่กรอก) สำหรับฟิลด์ที่เป็น optional ให้ผ่านไปเลยโดยไม่ต้องตรวจสอบ
    if (value === "" && !requiredFields.includes(name)) {
      return "";
    }

    const numValue = parseFloat(value);
    const fieldNames: Record<string, string> = {
      weight: "น้ำหนัก",
      height: "ส่วนสูง",
      bloodSugar: "น้ำตาลในเลือด",
      a1c: "ค่า HbA1c",
      bloodPressureSystolic: "ความดันตัวบน",
      bloodPressureDiastolic: "ความดันตัวล่าง",
    };

    // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง และอยู่ในช่วงที่กำหนดหรือไม่
    if (!/^\d*\.?\d*$/.test(value)) {
      return `กรุณากรอก ${fieldNames[name] || name} เฉพาะตัวเลขเท่านั้น`;
    }

    if (isNaN(numValue)) {
      return `กรุณากรอก ${fieldNames[name] || name} ให้ถูกต้อง`;
    }

    if (
      ranges[name] &&
      (numValue < ranges[name][0] || numValue > ranges[name][1])
    ) {
      return `กรุณากรอก ${fieldNames[name] || name} ให้ถูกต้อง`;
    }

    return "";
  };

  // Handle Input Change
  const handleChange = (
    field: string,
    value: string | { systolic: string; diastolic: string }
  ) => {
    if (field === "bloodPressure" && typeof value === "object") {
      // ตรวจสอบความถูกต้องของทั้งสองค่าแยกกัน
      const systolicError = validateInput(
        "bloodPressureSystolic",
        value.systolic
      );
      const diastolicError = validateInput(
        "bloodPressureDiastolic",
        value.diastolic
      );

      // อัปเดตข้อความแสดงข้อผิดพลาด
      setErrorMessages((prev) => ({
        ...prev,
        bloodPressure: {
          systolic: systolicError,
          diastolic: diastolicError,
        },
      }));

      // อัปเดตข้อมูลฟอร์ม
      setFormData((prev) => ({
        ...prev,
        bloodPressure: { ...prev.bloodPressure, ...value },
      }));
    } else if (field === "mood") {
      // สำหรับอารมณ์ ไม่ต้องตรวจสอบความถูกต้อง
      if (field === "mood" && typeof value === "string") {
        setFormData((prev) => ({ ...prev, [field]: value }));
      } else if (field !== "mood") {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      // สำหรับฟิลด์อื่นๆ ที่ไม่ใช่ความดัน
      const error = validateInput(field, value as string);

      // อัปเดตข้อความแสดงข้อผิดพลาด
      setErrorMessages((prev) => ({
        ...prev,
        [field]: error,
      }));

      // อัปเดตข้อมูลฟอร์ม
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // ตรวจสอบวันที่ (ไม่ให้บันทึกวันในอดีต)
  const validateDate = (dateStr: string): string => {
    const dateObj = parseThaiDate(dateStr);
    if (!dateObj) return "วันที่ไม่ถูกต้อง";

    if (isDateInPast(dateObj)) {
      return "ไม่สามารถบันทึกข้อมูลย้อนหลังได้";
    }

    return "";
  };

  // ตรวจสอบความสมบูรณ์ของฟอร์มก่อนส่ง
  const validateForm = (): boolean => {
    // ตรวจสอบฟิลด์ที่จำเป็น
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        Alert.alert(
          "กรุณากรอกข้อมูลให้ครบถ้วน",
          `กรุณากรอก${
            field === "date"
              ? "วันที่"
              : field === "time"
              ? "เวลา"
              : field === "weight"
              ? "น้ำหนัก"
              : "ส่วนสูง"
          }`
        );
        return false;
      }
    }

    // ตรวจสอบวันที่
    const dateError = validateDate(formData.date);
    if (dateError) {
      setErrorMessages((prev) => ({ ...prev, date: dateError }));
      Alert.alert("ข้อผิดพลาด", dateError);
      return false;
    }

    // ตรวจสอบข้อผิดพลาดในฟิลด์ต่างๆ
    for (const [field, error] of Object.entries(errorMessages)) {
      if (field === "bloodPressure") {
        if (
          typeof error === "object" &&
          error.systolic &&
          formData.bloodPressure.systolic !== ""
        ) {
          Alert.alert("ข้อมูลไม่ถูกต้อง", error.systolic);
          return false;
        }
        if (
          typeof error === "object" &&
          error.diastolic &&
          formData.bloodPressure.diastolic !== ""
        ) {
          Alert.alert("ข้อมูลไม่ถูกต้อง", error.diastolic);
          return false;
        }
      } else if (error && formData[field as keyof typeof formData] !== "") {
        Alert.alert("ข้อมูลไม่ถูกต้อง", error as string);
        return false;
      }
    }

    // ตรวจสอบความสอดคล้องของค่าความดัน (ถ้ามีการกรอกเพียงค่าเดียว)
    if (
      (formData.bloodPressure.systolic && !formData.bloodPressure.diastolic) ||
      (!formData.bloodPressure.systolic && formData.bloodPressure.diastolic)
    ) {
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "กรุณากรอกค่าความดันให้ครบทั้งค่าบนและค่าล่าง"
      );
      return false;
    }

    return true;
  };

  // Validation Before Submit
  const handleSubmit = () => {
    // ตรวจสอบความสมบูรณ์ของฟอร์ม
    if (!validateForm()) {
      return;
    }

    // บันทึกข้อมูลและไปหน้าถัดไป
    AsyncStorage.setItem("trackingFormData", JSON.stringify(formData))
      .then(() => {
        router.push({
          pathname: "tracking/medicineCollected",
        });
      })
      .catch((error) => {
        Alert.alert(
          "ข้อผิดพลาด",
          "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
        );
      });
  };

  // Date And Time Picker Handle
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // ตรวจสอบว่าวันที่ที่เลือกไม่ใช่วันในอดีต
      if (isDateInPast(selectedDate)) {
        setErrorMessages((prev) => ({
          ...prev,
          date: "ไม่สามารถบันทึกข้อมูลย้อนหลังได้",
        }));
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลย้อนหลังได้");
        return;
      } else {
        setErrorMessages((prev) => ({ ...prev, date: "" }));
      }

      setFormData((prev) => ({
        ...prev,
        date: formatThaiDate(selectedDate),
      }));
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData((prev) => ({
        ...prev,
        time: formatTime(selectedTime),
      }));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24">
        {/* Card One - Date And Time Input */}
        <Card>
          <Text className="text-display font-bold font-sans text-secondary text-center mt-1">
            บันทึกข้อมูลสุขภาพ
          </Text>

          {/* Date */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="mt-2"
          >
            <InputFieldOne
              label="วันที่"
              value={formData.date}
              placeholder="เลือกวันที่"
              editable={false}
              rightIcon={require("../../../assets/Tracking/calendar.png")}
              errorMessage={errorMessages.date}
            />
          </TouchableOpacity>

          {/* Time */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            className="mb-1"
          >
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
          <Text className="text-title font-sans text-secondary text-center mt-1">
            ข้อมูลสุขภาพ
          </Text>
          <BreakLine />

          {/* Weight And Height With The Same Line */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="น้ำหนัก *"
                value={formData.weight}
                onChangeText={(value) => handleChange("weight", value)}
                placeholder=" เช่น 60"
                keyboardType="numeric"
                errorMessage={errorMessages.weight}
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ส่วนสูง *"
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
                onChangeText={(value) =>
                  handleChange("bloodPressure", {
                    ...formData.bloodPressure,
                    systolic: value,
                  })
                }
                placeholder="เช่น 120"
                keyboardType="numeric"
                errorMessage={errorMessages.bloodPressure.systolic}
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวล่าง (Optional)"
                value={formData.bloodPressure.diastolic}
                onChangeText={(value) =>
                  handleChange("bloodPressure", {
                    ...formData.bloodPressure,
                    diastolic: value,
                  })
                }
                placeholder="เช่น 80"
                keyboardType="numeric"
                errorMessage={errorMessages.bloodPressure.diastolic}
              />
            </View>
          </View>
        </Card>

        {/* Card Three - ข้อมูลอารมณ์ */}
        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-1">
            ข้อมูลอารมณ์
          </Text>
          <BreakLine />

          <Text className="text-description font-sans font-bold text-secondary text-center mb-1">
            วันนี้คุณรู้สึกอย่างไร . . . (Optional)
          </Text>
          <MoodSelecter
            selectedMood={formData.mood}
            onSelect={(mood) => handleChange("mood", mood)}
          />
        </Card>

        {/* Go To The MedicineCollected */}
        <View className="items-center w-full px-4 mb-4">
          <LongButton
            title="ถัดไป"
            onPress={handleSubmit}
            disabled={!isFormValid()}
            isCompleted={isFormValid()}
            customStyle={isFormValid() ? "bg-primary" : "bg-gray"}
          />
        </View>

        {/* Date Picker - Replaces Input field with picker */}
        {showDatePicker && (
          <View
            style={{ position: "absolute", top: 115, left: 24, width: "100%" }}
          >
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="compact"
              onChange={handleDateChange}
              minimumDate={new Date()} // ไม่อนุญาตให้เลือกวันในอดีต
            />
          </View>
        )}

        {/* Time Picker - Replaces Input field with picker */}
        {showTimePicker && (
          <View
            style={{ position: "absolute", top: 205, left: 22, width: "100%" }}
          >
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
