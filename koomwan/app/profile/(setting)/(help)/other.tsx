import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";
import ProblemDropdown from "../../../../components/profile/problemDropdown";
import { PROBLEM_TYPES } from "../../../../constant/problem";
import axios from "axios";
import { AxiosError } from 'axios';
import BASE_URL from "../../../../config";

export default function OtherHelpScreen() {
  const [detail, setDetail] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelectType = (selectedType: string) => {
    setTitle(selectedType);
    setIsDropdownOpen(false);
  };



const handleSubmit = async () => {
  if (isSubmitting) return;

  if (!detail.trim()) {
    Alert.alert("กรุณากรอกปัญหา", "ปัญหาไม่สามารถเว้นว่างได้");
    return;
  }

  try {
    setIsSubmitting(true); // Set submitting to true before the API call

    // Retrieve auth token
    const authData = await AsyncStorage.getItem("@auth");
    if (!authData) {
      Alert.alert("Session Expired", "Please login again");
      router.push("/user/login");
      return;
    }

    const auth = JSON.parse(authData);
    const token = auth.token;

    // Prepare the problem data
    const problemData = {
      detail: detail.trim(),
      title: title || "",
    };

    // Send data to the API
    const response = await axios.post(
      `${BASE_URL}/api/v1/user/sentHelpRequest`,
      problemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      Alert.alert("สำเร็จ", "ส่งข้อมูลปัญหาเรียบร้อย", [
        { text: "ตกลง", onPress: () => router.back() },
      ]);
    } else {
      console.error("Error response:", response);
      throw new Error(response.data.message || "ไม่สามารถส่งข้อมูลปัญหาได้");
    }
  } catch (error) {
    console.error("Error sending problem:", error);
    if (error instanceof AxiosError) {
      // You can now safely access the 'response' property
      console.error("Axios error details:", error.response?.data);
      Alert.alert(
        "เกิดข้อผิดพลาด",
        error.response?.data?.message || "ไม่สามารถส่งข้อมูลปัญหาได้ กรุณาลองใหม่อีกครั้ง"
      );
    } else {
      // In case it's not an AxiosError (e.g., a different kind of error)
      Alert.alert("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดที่ไม่สามารถคาดการณ์ได้ กรุณาลองใหม่อีกครั้ง");
    }
  } finally {
    setIsSubmitting(false); // Reset submitting status
  }
};



  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <BackButton title="ย้อนกลับ" />

        <View className="w-full px-4">
          <Card>
            <View className="w-full">
              <Text className="text-title font-bold text-secondary text-center mb-4">
                ปัญหาอื่น ๆ
              </Text>

              <BreakLine />

              {/* Type Selection */}
              <View className="mt-4">
                <Text className="text-description text-secondary font-regular mb-2">
                  ประเภท (Optional)
                </Text>
                <ProblemDropdown
                  value={title}
                  options={PROBLEM_TYPES}
                  onSelect={handleSelectType}
                  disabled={isSubmitting}
                />
              </View>

              <Text className="text-description font-regular text-secondary mb-4">
                กรุณากรอกรายละเอียดของปัญหา
              </Text>

              <TextInput
                className="w-full h-48 p-4 font-regular bg-background rounded-lg text-description"
                multiline
                textAlignVertical="top"
                value={detail}
                onChangeText={setDetail}
                placeholder="รายละเอียด"
              />

              <TouchableOpacity
                className="w-full bg-primary py-4 rounded mt-6"
                onPress={handleSubmit}
                disabled={isSubmitting} // Disable button during submission
              >
                <Text className="text-card text-center font-bold text-button">
                  ส่ง
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
