import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { LongButton } from "../tracking/components/LongButton";
import AddMedicineCard from "./components/AddMedicineCard";
import { Checkbox } from "expo-checkbox";
import BackButton from "../../../global/components/BackButton";

// Mock Data (ควรย้ายไปแยกไฟล์)
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
];

export default function MedicineCollectedScreen() {
  const router = useRouter();
  const [additionalMedicines, setAdditionalMedicines] = useState<any[]>([]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);

  // Fuction View Regular Medicine Detail (Go To `medicineDetail.tsx`)
  const handleViewDetails = (medicine: any) => {
    router.push({
      pathname: "./medicineDetail",
      params: { 
        name: medicine.name,
        type: medicine.type,
        details: medicine.details, 
        image: medicine.image 
      },
    });
  };

  // ฟังก์ชันเพิ่มยา → ไปหน้าเพิ่มยาใหม่
  const handleAddMedicine = (medicine: any) => {
    router.push({
      pathname: "./addMedicine",
      params: { medicine: JSON.stringify(medicine) },
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <BackButton title="ย้อนกลับ" />

      <ScrollView className="mb-24">

        {/* 🟢 Regular Medicines */}
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">ยาประจำ</Text>
          <BreakLine />

          {REGULAR_MEDICINES.map((medicine) => (
            <TouchableOpacity
              key={medicine.id}
              onPress={() => handleViewDetails(medicine)}
              className="flex-row items-center py-2 "
            >

              <Checkbox>
                disabled={true}
              </Checkbox>
              
              <Image source={medicine.image} className="w-8 h-8 rounded-lg" />
              <View className="ml-2 flex-1">
                <Text className="font-sans text-description font-semi-bold text-secondary ">{medicine.name}</Text>
              </View>
              <Text className="font-sans text-button font-bold text-primary">ดูรายละเอียด</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* 🟠 Additional Medicine (ยัง)*/}
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">ยาเพิ่มเติม</Text>
          <BreakLine />

          {additionalMedicines.length > 0 ? (
            additionalMedicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.id}
                onPress={() => handleViewDetails(medicine)}
                className="flex-row items-center border-gray-200"
              >
                <Image source={medicine.image} className="w-14 h-14 rounded-lg" />
                <View className="ml-4 flex-1">
                  <Text className="font-sans text-description font-semibold">{medicine.name}</Text>
                  <Text className="font-sans text-description text-gray-500">{medicine.details}</Text>
                </View>
                <Text className="font-sans text-description text-primary">ดูรายละเอียด</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-button text-card font-sans text-center text-gray mt-2">ยังไม่มียาเพิ่มเติม</Text>
          )}

          {/* ปุ่มเพิ่มยา */}
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 px-8 mt-4"
            onPress={() => setShowAddMedicine(true)}
          >
            <Text className="text-button text-card font-sans text-center font-bold">+ คลิกเพื่อเพิ่มยาอื่นๆ</Text>
          </TouchableOpacity>
        </Card>

        {/* 📌 For Additional Medicine */}
        {showAddMedicine && (
          <AddMedicineCard
            onAdd={handleAddMedicine}
            onCancel={() => setShowAddMedicine(false)}
          />
        )}

        {/* After Select Medicine Tracked*/}
        <LongButton title="ถัดไป" onPress={() => router.push("./summaryTracking")} />
      </ScrollView>
    </SafeAreaView>
  );
}
