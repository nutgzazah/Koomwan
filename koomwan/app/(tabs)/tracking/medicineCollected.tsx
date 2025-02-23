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
import BackButton from "../../../global/components/BackButton";

interface Medicine {
  id: string;
  name: string;
  type: string;
  details: string;
  image: ImageSourcePropType;
}

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
  const params = useLocalSearchParams();
  
  const [additionalMedicines, setAdditionalMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<{ [key: string]: boolean }>({});
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Handle viewing medicine details
  const handleViewDetails = (medicine: Medicine) => {
    router.push({
      pathname: "./medicineDetail",
      params: {
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: typeof medicine.image === 'string' ? medicine.image : undefined,
      },
    });
  };

  // Handle adding new medicine
  const handleAddMedicine = () => {
    router.push({
      pathname: "./addMedicine",
    });
  };

  // Handle editing medicine
  const handleEditMedicine = (medicine: Medicine) => {
    router.push({
      pathname: "./addMedicine",
      params: {
        id: medicine.id,
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: typeof medicine.image === 'string' ? medicine.image : undefined,
        isEdit: "true",
      },
    });
  };

  // Handle deleting medicine
  const handleDeleteMedicine = (medicineId: string) => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบยานี้?",
      [
        { text: "ยกเลิก", style: "cancel" },
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

  // Handle checkbox selection
  const handleCheckboxChange = (medicineId: string, isChecked: boolean) => {
    setSelectedMedicines(prev => ({
      ...prev,
      [medicineId]: isChecked
    }));
  };

  // Effect for handling new/edited medicine
  useEffect(() => {
    if (params.name && params.type && params.id !== lastAddedId) {
      const newId = Array.isArray(params.id) ? params.id[0] : params.id || Date.now().toString();
      const name = Array.isArray(params.name) ? params.name[0] : params.name;
      const type = Array.isArray(params.type) ? params.type[0] : params.type;
      const details = params.details ? (Array.isArray(params.details) ? params.details[0] : params.details) : "";
      const image = params.image ? (Array.isArray(params.image) ? params.image[0] : params.image) : require("../../../assets/Tracking/Medicine.png");

      if (params.isEdit === "true") {
        setAdditionalMedicines(prev =>
          prev.map(medicine =>
            medicine.id === newId
              ? { id: newId, name, type, details, image }
              : medicine
          )
        );
      } else {
        setAdditionalMedicines(prev => [
          ...prev,
          { id: newId, name, type, details, image }
        ]);
      }
      setLastAddedId(newId);
    }
  }, [params, lastAddedId]);

  return (
    <SafeAreaView className="flex-1">
      <BackButton title="ย้อนกลับ" />
      <ScrollView className="mb-24">
        {/* Regular Medicines */}
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">ยาประจำ</Text>
          <BreakLine />
          {REGULAR_MEDICINES.map((medicine) => (
            <TouchableOpacity
              key={medicine.id}
              onPress={() => handleViewDetails(medicine)}
              className="flex-row items-center py-2"
            >
              <Checkbox
                value={selectedMedicines[medicine.id] || false}
                onValueChange={(newValue) => handleCheckboxChange(medicine.id, newValue)}
                className="mr-2"
              />
              <Image source={medicine.image} className="w-8 h-8 rounded-lg ml-2" />
              <View className="ml-2 flex-1">
                <Text className="font-sans text-description font-semibold">{medicine.name}</Text>
              </View>
              <Text className="font-sans text-button font-bold text-primary">ดูรายละเอียด</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Additional Medicines */}
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
                  onValueChange={(newValue) => handleCheckboxChange(medicine.id, newValue)}
                  className="mr-2"
                />
                <Image 
                  source={typeof medicine.image === 'string' ? { uri: medicine.image } : medicine.image} 
                  className="w-8 h-8 rounded-lg ml-2" 
                />
                <View className="ml-2 flex-1">
                  <Text className="font-sans text-description font-semibold">{medicine.name}</Text>
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
            <Text className="text-button text-card font-sans text-center text-gray mt-2">
              ยังไม่มียาเพิ่มเติม
            </Text>
          )}

          <TouchableOpacity 
            className="bg-primary rounded-xl py-4 px-8 mt-4" 
            onPress={handleAddMedicine}
          >
            <Text className="font-sans text-button font-bold text-card text-center text-white">
              เพิ่มยาใหม่
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}