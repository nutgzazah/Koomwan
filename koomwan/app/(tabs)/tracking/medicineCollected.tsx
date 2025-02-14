import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { LongButton } from "../tracking/components/LongButton";
import Checkbox from "expo-checkbox";
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
  const params = useLocalSearchParams();
  
  const [additionalMedicines, setAdditionalMedicines] = useState<any[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<{ [key: string]: boolean }>({});

  // ฟังก์ชันดูรายละเอียดยา → ไป `medicineDetail.tsx`
  const handleViewDetails = (medicine: any) => {
    router.push({
      pathname: "./medicineDetail",
      params: {
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: medicine.image.uri || medicine.image, // 🟢 ต้องใช้ `uri` ถ้ามี
      },
    });
  };

  // ฟังก์ชันเพิ่มยา → ไปหน้าเพิ่มยาใหม่
  const handleAddMedicine = () => {
    router.push({
      pathname: "./addMedicine",
    });
  };

  // ฟังก์ชันลบยา
  const handleDeleteMedicine = (medicineId: string) => {
  Alert.alert(
    "ยืนยันการลบ",
    "คุณแน่ใจหรือไม่ว่าต้องการลบยานี้?",
    [
      {
        text: "ยกเลิก",
        style: "cancel",
      },
      {
        text: "ลบ",
        onPress: () => {
          setAdditionalMedicines((prev) =>
            prev.filter((medicine) => medicine.id !== medicineId)
          );
          Alert.alert("ลบสำเร็จ", "ยาถูกลบเรียบร้อย");
        },
      },
    ]
  );
};

  // ฟังก์ชันแก้ไขยา
  const handleEditMedicine = (medicine: any) => {
    router.push({
    pathname: "./addMedicine",
    params: {
      id: medicine.id,
      name: medicine.name,
      type: medicine.type,
      details: medicine.details,
      image: medicine.image,
      isEdit: true, 
      },
    });
  };

  // 🟢 รับค่ายาใหม่จาก `addMedicine.tsx`
  useEffect(() => {
    if (params.name && params.type) {
      setAdditionalMedicines((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: params.name,
          type: params.type,
          details: params.details || "",
          image: params.image || require("../../../assets/Tracking/Medicine.png"),
        },
      ]);
    }
  }, [params]);

  // นำเข้ารูปถังขยะจาก assets
  const trashBinIcon = require("../../../assets/Tracking/trash.png");

  // ในส่วนของการแสดงรายการยาเพิ่มเติม
  {additionalMedicines.length > 0 ? (
   additionalMedicines.map((medicine) => (
    <TouchableOpacity
      key={medicine.id}
      onPress={() => handleViewDetails(medicine)}
      className="flex-row items-center border-gray-200 py-2"
    >
      <Checkbox
        value={selectedMedicines[medicine.id] || false}
        onValueChange={(newValue) =>
          setSelectedMedicines((prev) => ({ ...prev, [medicine.id]: newValue }))
        }
      />

      <Image source={{ uri: medicine.image }} className="w-14 h-14 rounded-lg ml-2" />
      <View className="ml-4 flex-1">
        <Text className="font-sans text-description font-semibold">{medicine.name}</Text>
        <Text className="font-sans text-description text-gray-500">{medicine.details}</Text>
      </View>
      <TouchableOpacity onPress={() => handleEditMedicine(medicine)}>
        <Text className="font-sans text-description text-primary">แก้ไข</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteMedicine(medicine.id)} className="ml-2">
        <Image source={trashBinIcon} className="w-6 h-6" style={{ tintColor: "red" }} />
      </TouchableOpacity>
    </TouchableOpacity>
  ))
) : (
  <Text className="text-button text-card font-sans text-center text-gray mt-2">ยังไม่มียาเพิ่มเติม</Text>
)}

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
              className="flex-row items-center py-2"
            >
              {/* 🟢 แก้ไข Checkbox ให้ทำงาน */}
              <Checkbox
                value={selectedMedicines[medicine.id] || false}
                onValueChange={(newValue) =>
                  setSelectedMedicines((prev) => ({ ...prev, [medicine.id]: newValue }))
                }
              />

              <Image source={medicine.image} className="w-8 h-8 rounded-lg ml-2" />
              <View className="ml-2 flex-1">
                <Text className="font-sans text-description font-semibold">{medicine.name}</Text>
              </View>
              <Text className="font-sans text-button font-bold text-primary">ดูรายละเอียด</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* 🟠 Additional Medicines */}
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">ยาเพิ่มเติม</Text>
          <BreakLine />

          {additionalMedicines.length > 0 ? (
            additionalMedicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.id}
                onPress={() => handleViewDetails(medicine)}
                className="flex-row items-center border-gray-200 py-2"
              >
                <Checkbox
                  value={selectedMedicines[medicine.id] || false}
                  onValueChange={(newValue) =>
                    setSelectedMedicines((prev) => ({ ...prev, [medicine.id]: newValue }))
                  }
                />

                <Image source={{ uri: medicine.image }} className="w-14 h-14 rounded-lg ml-2" />
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
          <TouchableOpacity className="bg-primary rounded-xl py-4 px-8 mt-4" onPress={handleAddMedicine}>
            <Text className="text-button text-card font-sans text-center text-white">เพิ่มยาใหม่</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
