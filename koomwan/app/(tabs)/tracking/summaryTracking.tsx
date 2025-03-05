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
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";
import InputFieldOne from "./components/InputFieldOne";

const REGULAR_MEDICINES = [
  {
    id: "1",
    name: "Glipizide (ไกลพิไซด์)",
    type: "ยาเบาหวาน",
    details: "รับประทานก่อนอาหาร 30 นาที วันละ 1-2 ครั้ง",
    image: require("../../../assets/Tracking/Medicine.png"),
  },
  {
    id: "2",
    name: "Metformin (เม็ทฟอมิน)",
    type: "ยาเบาหวาน",
    details: "รับประทานพร้อมอาหาร เช้า-เย็น",
    image: require("../../../assets/Tracking/Medicine.png"),
  },
  {
    id: "3",
    name: "พาราเซตามอล",
    type: "ยาแก้ปวด",
    details: "รับประทานเมื่อมีอาการปวด",
    image: require("../../../assets/Tracking/Medicine.png"),
  }
];

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
    bloodSugar: "120",
    a1c: "4.8",
    bloodPressure: {
      systolic: "120",
      diastolic: "80"
    },
    medicines: REGULAR_MEDICINES // Use your REGULAR_MEDICINES here
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
    router.push("./index");
  };

  // เลือกรูปภาพตามอารมณ์ที่เลือก
  const getMoodImage = (mood: string) => {
    switch (mood) {
      case "happy":
        return require("../../../assets/Tracking/mood-happy.png");
      case "laughing":
        return require("../../../assets/Tracking/mood-laughing.png");
      case "impassive":
        return require("../../../assets/Tracking/mood-impassive.png");
      case "frustrated":
        return require("../../../assets/Tracking/mood-frustrated.png");
      case "ill":
        return require("../../../assets/Tracking/mood-ill.png");
      case "sad":
        return require("../../../assets/Tracking/mood-sad.png");
      case "angry":
        return require("../../../assets/Tracking/mood-angry.png");
      default:
        return require("../../../assets/Tracking/mood-happy.png"); // default to happy
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24">
        <BackButton title="ย้อนกลับ" /> {/* Back button */}
        <Card>
          <Text className="text-title font-sans font-bold text-secondary text-center mt-2">ข้อมูลที่บันทึก</Text>
          <Text className="text-description font-sans text-secondary text-center mt-2">วัน/เดือน/ปี และเวลาที่บันทึก</Text>
          <Text className="text-description font-sans text-secondary text-center">ณ วันที่ {healthData.date}</Text>
          <Text className="ttext-description font-sans text-secondary text-center mb-1">เวลา {healthData.time}</Text>
        </Card>

        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-1">ข้อมูลสุขภาพ</Text>
          <BreakLine />
          {/* Weight And Height With The Same Line */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="น้ำหนัก"
                value={healthData.weight} // ใช้ค่าจาก healthData
                placeholder=" เช่น 60"
                editable={false} // ไม่ให้แก้ไข
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ส่วนสูง"
                value={healthData.height} // ใช้ค่าจาก healthData
                placeholder="เช่น 160"
                editable={false} // ไม่ให้แก้ไข
              />
            </View>
          </View>

          {/* Blood Sugar */}
          <InputFieldOne
            label="ค่าระดับน้ำตาลในเลือด (Optional)"
            value={healthData.bloodSugar || ""} // ค่าอาจจะเป็นค่าว่างได้
            placeholder="เช่น 90"
            editable={false} // ไม่ให้แก้ไข
          />

          {/* A1c */}
          <InputFieldOne
            label="ค่าเฉลี่ยน้ำตาลในเลือด HbA1c (Optional)"
            value={healthData.a1c}
            placeholder="เช่น 5.6"
            editable={false} // ไม่ให้แก้ไข
          />

          {/* Blood Pressure */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวบน (Optional)"
                value={healthData.bloodPressure.systolic}
                placeholder="เช่น 120"
                editable={false} // ไม่ให้แก้ไข
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวล่าง (Optional)"
                value={healthData.bloodPressure.diastolic}
                placeholder="เช่น 80"
                editable={false} // ไม่ให้แก้ไข
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-2">ข้อมูลอารมณ์</Text>
          <BreakLine />
          <Text className="text-description text-secondary font-sans font-bold text-center mt-1">อารมณ์ของคุณ (Optional)</Text>

          <View
            className={`items-center text-secondary py-3 px-6 mt-4 rounded-xl ${
              selectedMood === "happy" ? "text-secondary bg-card border border-gray" : "bg-background"
            }`}
          >
            {/*getMoodImage For Selected Mood*/}
            <Image
              source={getMoodImage(selectedMood)}
              className="w-16 h-16"
              resizeMode="contain"
            />
            <Text className="text-description text-secondary font-sans font-bold mt-2">{selectedMood}</Text> {/* Display mood label */}
          </View>
        </Card>

        {/* ยาประจำ */}
        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-2">ยาประจำ</Text>
          <BreakLine />
          {healthData.medicines.map((medicine, index) => {
            if (medicine.type === "ยาเบาหวาน") {
              return (
                <View key={index} className="flex-row justify-between items-center mt-4">
                  <Image source={medicine.image} className="w-12 h-12" />
                  <View className="ml-4">
                    <Text className="text-description font-sans text-secondary">{medicine.name}</Text>
                  </View>
                </View>
              );
            }
          })}
        </Card>

        {/* ยาเพิ่มเติม */}
        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-2">ยาเพิ่มเติม</Text>
          <BreakLine />
          {healthData.medicines.map((medicine, index) => {
            if (medicine.type !== "ยาเบาหวาน") {
              return (
                <View key={index} className="flex-row justify-between items-center mt-4">
                  <Image source={medicine.image} className="w-12 h-12" />
                  <View className="ml-4">
                    <Text className="text-description font-sans text-secondary">{medicine.name}</Text>
                  </View>
                </View>
              );
            }
          })}
        </Card>

        {/* ปุ่มถัดไป */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          className="bg-primary rounded-lg py-4 px-8 mt-3 mb-6 mx-6"
        >
          <Text className="text-button font-sans text-card text-center font-bold">
            {loading ? "กำลังบันทึก..." : "ถัดไป"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View className="items-center mt-4">
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text className="text-gray-600 mt-2">กำลังบันทึกข้อมูล...</Text>
          </View>
        )}

        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-card rounded-2xl p-7 m-4 items-center">
              <Text className="text-body font-sans text-center mb-1">บันทึกข้อมูล</Text>
              <Text className="text-body font-sans text-center mb-3">สุขภาพของคุณสำเร็จ!</Text>
              <Image source={require("../../../assets/Tracking/tick-circle.png")} className="w-20 h-20 mb-5" />
              <TouchableOpacity className="bg-primary rounded-lg px-20 py-4" onPress={handleCloseSuccess}>
                <Text className=" text-button font-sans text-card font-bold text-center">ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
