import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";

export default function RegularMedScreen() {
  const router = useRouter();
  // mock data
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "ไกลพิไซด์ (Glipizide)",
      checked: false,
    },
    {
      id: 2,
      name: "เม็ทฟอร์มิน (Metformin)",
      checked: false,
    },
  ]);

  const isAnyChecked = medications.some((med) => med.checked);

  const handleCheckboxChange = (id: number) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, checked: !med.checked } : med
      )
    );
  };

  // mock handleDelete
  const handleDelete = () => {
    // หาจำนวนรายการที่ถูกเลือก
    const selectedCount = medications.filter((med) => med.checked).length;

    Alert.alert(
      "คำเตือน",
      `คุณต้องการลบรายการยาที่เลือก ${selectedCount} รายการ?`,
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ยืนยัน",
          style: "destructive",
          onPress: () => {
            // กรองเอาเฉพาะรายการที่ไม่ได้ถูกเลือก ให้แสดง
            const remainingMeds = medications.filter((med) => !med.checked);
            setMedications(remainingMeds);
          },
        },
      ]
    );
  };

  const handleMedicationDetails = (medId: number) => {
    router.push(`/profile/(med)/(medDetail)/${medId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="อัพเดทข้อมูลยาประจำ" />

        <Card>
          {/* Card Header */}
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">ยาประจำ</Text>
            <BreakLine />
          </View>

          {/* Medication List */}
          {medications.length > 0 ? (
            medications.map((med, index) => (
              <View key={med.id}>
                <View className="flex-row justify-between w-full px-2 items-center">
                  <View className="flex-row items-center">
                    <Checkbox
                      value={med.checked}
                      onValueChange={() => handleCheckboxChange(med.id)}
                      className="w-5 h-5"
                    />
                    <Text className="pl-4 font-regular text-description text-secondary">
                      {med.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleMedicationDetails(med.id)}
                  >
                    <Text className="font-bold text-sub-button text-primary">
                      รายละเอียดยา
                    </Text>
                  </TouchableOpacity>
                </View>
                {index < medications.length - 1 && <BreakLine />}
              </View>
            ))
          ) : (
            <View className="items-center py-4">
              <Text className="text-body font-regular text-secondary">
                ไม่มีรายการยา
              </Text>
            </View>
          )}
          <BreakLine />

          {/* Bottom Buttons */}
          <View className="flex-row justify-between mx-4 mt-4 mb-8 h-16 w-full">
            <TouchableOpacity
              disabled={!isAnyChecked}
              onPress={handleDelete}
              className={`flex-1 py-4 rounded-md mr-2 ${
                isAnyChecked ? "bg-abnormal" : "bg-background"
              }`}
            >
              <Text
                className={`text-center font-bold text-button ${
                  isAnyChecked ? "text-white" : "text-secondary"
                }`}
              >
                ลบรายชื่อยา
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-4 bg-primary rounded-md ml-2"
              onPress={() => router.push("/profile/(med)/addMed")}
            >
              <Text className="text-white text-center font-bold text-button">
                เพิ่มรายชื่อยาประจำ
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
