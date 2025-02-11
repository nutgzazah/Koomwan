//แก้ด้วยหาหน้าไม่เจอ

import {
    Text,
    SafeAreaView,
    ScrollView,
    View,
    TouchableOpacity,
    Modal,
    Image,
    ActivityIndicator
  } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import { LongButton } from "./components/LongButton";
import MoodSelecter from "./components/MoodSelecter";
  
export default function SummaryTrackingScreen() {
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState("happy");
  
    const healthData = {
      date: "13 ธันวาคม พ.ศ.2567",
      time: "13:32 น.",
      weight: "65",
      height: "168",
      bloodSugar: "",
      a1c: "4.8",
      bloodPressure: "78",
      medicines: [
        { name: "Glipizide", type: "ยาเบาหวาน" },
        { name: "พาราเซตามอล", type: "ยาแก้ปวด" }
      ]
    };
  
    
    const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };
  
    const handleConfirm = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowSuccessModal(true);
      }, 2000); // Simulate API call delay
    };
  
    const handleCloseSuccess = () => {
      setShowSuccessModal(false);
      router.push("/index");
    };
  
    return (
      <SafeAreaView className="flex-1">
        <ScrollView className="mb-24">
          <Card>
            <Text className="text-xl font-sans text-secondary text-center mt-2">ข้อมูลที่บันทึก</Text>
            <Text className="text-gray-600 text-center mt-2">วัน/เดือน/ปี และเวลาที่บันทึก</Text>
            <Text className="text-gray-600 text-center">ณ วันที่ {healthData.date}</Text>
            <Text className="text-gray-600 text-center mb-2">เวลา {healthData.time}</Text>
          </Card>
  
          <Card>
            <Text className="text-xl font-sans text-secondary text-center mt-2">ข้อมูลสุขภาพ</Text>
            <View className="flex-row justify-between mt-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600">น้ำหนัก</Text>
                <View className="border rounded-lg p-2 mt-1">
                  <Text>{healthData.weight} กิโลกรัม</Text>
                </View>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-600">ส่วนสูง</Text>
                <View className="border rounded-lg p-2 mt-1">
                  <Text>{healthData.height} เซนติเมตร</Text>
                </View>
              </View>
            </View>
          </Card>
  
          <Card>
            <Text className="text-xl font-sans text-secondary text-center mt-2">ข้อมูลอารมณ์</Text>
            <Text className="text-gray-600 text-center mt-4">อารมณ์ของคุณ (Optional)</Text>
            <View className="mt-2">
              <MoodSelecter selectedMood={selectedMood} onSelect={handleMoodSelect} />
            </View>
          </Card>
  
          <LongButton title="ถัดไป" onPress={handleConfirm} disabled={loading} />
  
          {loading && (
            <View className="items-center mt-4">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text className="text-gray-600 mt-2">กำลังบันทึกข้อมูล...</Text>
            </View>
          )}
  
          <Modal visible={showSuccessModal} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white rounded-3xl p-8 m-4 items-center">
                <Text className="text-xl text-center mb-4">บันทึกข้อมูล</Text>
                <Text className="text-lg text-center mb-6">สุขภาพของคุณสำเร็จ!</Text>
                <Image source={require("../../../assets/Tracking/tick-circle.png")} className="w-16 h-16 mb-6" />
                <TouchableOpacity className="bg-primary rounded-lg px-8 py-3" onPress={handleCloseSuccess}>
                  <Text className="text-white text-center">ปิด</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }
  