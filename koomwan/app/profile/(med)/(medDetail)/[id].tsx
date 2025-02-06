import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";

// Mock data แยกออกมาเป็น object ใช้ id เป็น key
type Medication = {
  id: number;
  name: string;
  type: string;
};

const MEDICATIONS: { [key: string]: Medication } = {
  "1": {
    id: 1,
    name: "ไกลพิไซด์ (Glipizide)",
    type: "ยาเม็ด",
  },
  "2": {
    id: 2,
    name: "เม็ทฟอร์มิน (Metformin)",
    type: "ยาเม็ด",
  },
  "3": {
    id: 3,
    name: "อินซูลิน (Insulin)",
    type: "ยาฉีด",
  },
};

export default function MedDetailScreen() {
  // Get the medication ID from the route params
  const { id } = useLocalSearchParams();

  // ดึงข้อมูลยาจาก MEDICATIONS object โดยใช้ id เป็น key
  // ถ้าไม่พบข้อมูลจะใช้ default value
  const medDetails = MEDICATIONS[id as string] || {
    id: Number(id),
    name: "ไม่พบข้อมูลยา",
    type: "-",
    dosage: "-",
  };

  return (
    <SafeAreaView>
      <BackButton title="เพิ่มรายชื่อยาประจำ" />
      <Card>
        {/* Medication Name */}
        <View className="flex-col items-center w-full mb-4">
          <Text className="text-title font-bold text-secondary">
            {medDetails.name}
          </Text>
          <BreakLine />
        </View>

        {/* Medication Details */}
        <View className="w-full px-2">
          <View className="mb-4">
            <Text className="text-headline font-medium text-secondary mb-2">
              ประเภทยา
            </Text>
            <Text className="text-description font-regular text-secondary">
              {medDetails.type}
            </Text>
          </View>
        </View>
      </Card>
    </SafeAreaView>
  );
}
