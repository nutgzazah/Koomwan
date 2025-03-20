import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ImageSourcePropType,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import Checkbox from "expo-checkbox";
//import BackButton from "../../../global/components/BackButton";
import { LongButton } from "./components/LongButton";

// Define a Medicine interface for better type-checking
interface Medicine {
  id: string;
  name: string;
  type: string;
  details: string;
  image: ImageSourcePropType | string;
}

// Predefined regular medicines
const REGULAR_MEDICINES: Medicine[] = [
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

  const [additionalMedicines, setAdditionalMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<{ [key: string]: boolean }>({});

  const params = useLocalSearchParams();
  const formData = params?.formData ? JSON.parse(params.formData as string) : {};

  console.log("Data received in medicineCollected.tsx:", formData);

  useEffect(() => {
    console.log("Current Route:", router);
  }, []);
  

  useEffect(() => {
  console.log("Updated Data received in medicineCollected.tsx:", formData);
  }, [formData]);


  // Load data when params are available
  useEffect(() => {
    if (params.name && params.type) {
      const newMedicine: Medicine = {
        id: params.id ? String(params.id) : Date.now().toString(),
        name: String(params.name),
        type: String(params.type),
        details: params.details ? String(params.details) : "",
        image: params.image ? String(params.image) : require("../../../assets/Tracking/Medicine.png"),
      };
  
      const exists = additionalMedicines.some((med) => med.id === newMedicine.id);
      if (!exists) {
        setAdditionalMedicines((prev) => [...prev, newMedicine]);
      } else {
        setAdditionalMedicines((prev) =>
          prev.map((med) => (med.id === newMedicine.id ? newMedicine : med))
        );
      }
    }
  }, [params.name, params.type, params.details, params.image]);
  

  // View medicine details when clicked
  const handleViewDetails = (medicine: Medicine, isRegular: boolean) => {
    router.push({
      pathname: "./medicineDetail",
      params: {
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: typeof medicine.image === "string" ? medicine.image : undefined,
        isRegular: isRegular ? "true" : "false", // Pass whether it's a regular medicine
      },
    });
  };

  // Add a new medicine
  const handleAddMedicine = () => {
    router.push({
      pathname: "./addMedicine",
    });
  };

  // Edit an existing medicine
  const handleEditMedicine = (medicine: Medicine) => {
    router.push({
      pathname: "./addMedicine",
      params: {
        id: medicine.id,
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: typeof medicine.image === "string" ? medicine.image : undefined,
        isEdit: "true", // Flag for editing mode
      },
    });
  };

  // Delete a medicine
  const handleDeleteMedicine = (medicineId: string) => {
    Alert.alert(
      String("ยืนยันการลบ"), 
      String("คุณแน่ใจหรือไม่ว่าต้องการลบยานี้?"),
      [
        { text: String("ยกเลิก"), style: "cancel" },
        {
          text: String("ลบ"),
          onPress: () => {
            setAdditionalMedicines((prev) =>
              prev.filter((medicine) => medicine.id !== medicineId)
            );
            setSelectedMedicines((prev) => {
              const updatedState = { ...prev };
              delete updatedState[medicineId]; // Remove the deleted medicine from selected state
              return updatedState;
            });
            Alert.alert(String("ลบสำเร็จ"), String("ยาถูกลบเรียบร้อย")); 
          },
        },
      ]
    );
  };
  

  // Handle checkbox selection change
  const handleCheckboxChange = (medicineId: string, isChecked: boolean) => {
    setSelectedMedicines((prev) => ({
      ...prev,
      [medicineId]: isChecked, // Update the checkbox state
    }));
  };
  

  // Handle next button click
  const handleNext = () => {
  // Combine selected regular and additional medicines
    const selectedMedicinesWithDetails = {
      ...REGULAR_MEDICINES.filter(med => selectedMedicines[med.id])
        .reduce((acc, med) => ({ ...acc, [med.id]: med }), {}),
      ...additionalMedicines.filter(med => selectedMedicines[med.id])
        .reduce((acc, med) => ({ ...acc, [med.id]: med }), {})
    };

    router.push({
      pathname: "./summaryTracking",
      params: {
        selectedMedicines: JSON.stringify(selectedMedicinesWithDetails),
      }
    });
  };

  return (
    <SafeAreaView className="flex-1">
     <TouchableOpacity
      className="flex flex-row ml-6 mt-6 mb-3 items-center"
      onPress={() => router.back()}
     >
      <Image 
       className="w-8 h-8 mr-3"
       source={require("../../../assets/arrow-circle-left.png")}
      />
      <Text className="font-sans text-body text-secondary">
       ย้อนกลับ
      </Text>
     </TouchableOpacity>
      
      <ScrollView className="mb-24">
        {/* Regular medicines section */}
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">ยาประจำ</Text>
          <BreakLine />
          {REGULAR_MEDICINES.map((medicine) => (
            <TouchableOpacity
              key={medicine.id}
              onPress={() => handleViewDetails(medicine, true)} // Pass true for regular medicine
              className="flex-row items-center py-2"
            >
              <Checkbox
                value={selectedMedicines[medicine.id] || false}
                onValueChange={(newValue) => handleCheckboxChange(medicine.id, newValue)}
                className="mr-2"
              />
              <Image
                source={typeof medicine.image === "string" ? { uri: medicine.image } : medicine.image}
                className="w-8 h-8 rounded-lg ml-2"
              />
              <View className="ml-2 flex-1">
              <Text className="font-sans text-description font-semibold">{String(medicine.name)}</Text>
              </View>
              <Text className="font-sans text-button font-bold text-primary">ดูรายละเอียด</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Additional medicines section */}
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">ยาเพิ่มเติม</Text>
          <BreakLine />
          {additionalMedicines.length > 0 ? (
            additionalMedicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.id}
                onPress={() => handleViewDetails(medicine, false)} // Pass false for additional medicine
                className="flex-row items-center py-2"
              >
                <Checkbox
                  value={selectedMedicines[medicine.id] || false}
                  onValueChange={(newValue) => handleCheckboxChange(medicine.id, newValue)}
                  className="mr-2"
                />
                <Image
                  source={typeof medicine.image === "string" ? { uri: medicine.image } : medicine.image}
                  className="w-8 h-8 rounded-lg ml-2"
                />
                <View className="ml-2 flex-1">
   
                  <Text className="font-sans text-description font-semibold">{String(medicine.name)}</Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => handleEditMedicine(medicine)} className="mr-3">
                    <Text className="font-sans text-description text-primary">แก้ไข</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteMedicine(medicine.id)}>
                    <Image
                      source={require("../../../assets/Tracking/trash.png")}
                      className="w-6 h-6"
                      style={{ tintColor: "red" }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-button text-card font-sans text-center text-gray mt-2">ยังไม่มียาเพิ่มเติม</Text>
          )}
 
          <TouchableOpacity className="bg-primary rounded-xl py-4 px-8 mt-4" onPress={handleAddMedicine}>
            <Text className="font-sans text-button font-bold text-card text-center text-white">เพิ่มยาใหม่</Text>
          </TouchableOpacity>
        </Card>

      {/* Next button outside the card */}
      <View className="items-center w-full px-6 mb-6">
        <LongButton
          title="ถัดไป"
          onPress={handleNext}
          disabled={!Object.keys(selectedMedicines).length}
          isCompleted={Object.keys(selectedMedicines).length > 0}
          customStyle={Object.keys(selectedMedicines).length > 0 ? "bg-blue-600" : "bg-gray"}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

