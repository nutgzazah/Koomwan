import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import InputFieldOne from "./components/InputFieldOne";
import Dropdown from "./components/DropDown";

interface Medicine {
  id: string;
  name: string;
  type: string;
  details: string;
  image: string;
}


const params = useLocalSearchParams<{
  id?: string;
  name?: string;
  type?: string;
  details?: string;
  image?: string;
  isEdit?: string;
}>();

const [additionalMedicines, setAdditionalMedicines] = useState<Medicine[]>([]);

const AddMedicineScreen: React.FC = () => {
  const router = useRouter();
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: "",
    type: "",
    details: "",
    image: null,
  });

  // ขออนุญาตเข้าถึงรูปภาพ
  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "กรุณาอนุญาตให้เข้าถึงรูปภาพ");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setNewMedicine((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const { isEdit, id, name, type, details, image } = useLocalSearchParams();
  useEffect(() => {
    if (params.name && params.type) {
      if (params.isEdit) {
        // ถ้าเป็นการแก้ไข ให้อัปเดตยาเดิม
        setAdditionalMedicines((prev) =>
          prev.map((medicine) =>
            medicine.id === params.id
              ? {
                  ...medicine,
                  name: params.name,
                  type: params.type,
                  details: params.details,
                  image: params.image,
                }
              : medicine
          )
        );
      } else {
        // ถ้าเป็นการเพิ่มยาใหม่
        setAdditionalMedicines((prev) => [
          ...prev,
          {
            id: params.id,
            name: params.name,
            type: params.type,
            details: params.details || "",
            image: params.image || require("../../../assets/Tracking/Medicine.png"),
          },
        ]);
      }
    }
  }, [params]);



  // ตรวจสอบและบันทึก
  const handleSubmit = () => {
    if (!newMedicine.name.trim()) {
      Alert.alert("กรุณากรอกชื่อยา");
      return;
    }
  
    if (!newMedicine.type.trim()) {
      Alert.alert("กรุณาเลือกประเภทของยา");
      return;
    }
  
    // ส่งข้อมูลกลับไปยังหน้าคอลเลกชันยา
    router.push({
      pathname: "./medicineCollected",
      params: {
        id: isEdit ? id : Date.now().toString(), // ถ้าเป็นการแก้ไขให้ใช้ id เดิม
        name: newMedicine.name,
        type: newMedicine.type,
        details: newMedicine.details,
        image: newMedicine.image,
        isEdit: isEdit || false,
      },
    });
  };

//ตรวจสอบพารามิเตอร์ isEdit เพื่อดูว่าผู้ใช้กำลังแก้ไขยาหรือเพิ่มยาใหม่


  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24">
        <Card>
          <Text className="text-title font-bold text-center mt-2 text-secondary">
            เพิ่มยาใหม่
          </Text>
          <BreakLine />

          {/* กรอบอัปโหลดรูปยา */}
          <TouchableOpacity
            onPress={pickImage}
            className="bg-background border border-gray rounded-lg px-20 py-5 items-center justify-center mb-4"
            style={{ width: 300, height: 200 }}
          >
            {newMedicine.image ? (
              <Image
                source={{ uri: newMedicine.image }}
                className="w-40 h-40 rounded-lg"
              />
            ) : (
              <Image
                source={require("../../../assets/Tracking/add-image.png")}
                className="w-20 h-20 mb-2"
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>

          {/* ชื่อยา */}
          <InputFieldOne
            label="ชื่อยา"
            value={newMedicine.name}
            onChangeText={(text) =>
              setNewMedicine((prev) => ({ ...prev, name: text }))
            }
            placeholder="ระบุชื่อยา"
          />

          {/* Dropdown เลือกประเภท */}
          <View style={{ width: "100%", alignSelf: "center" }}>
            <Text className="text-description font-bold px-1 mb-2">
              ประเภท (Optional)
            </Text>
            <Dropdown
              choices={[
                "ยาเฉพาะโรค",
                "ยาสามัญประจำบ้าน",
                "ยาใช้ภายนอก",
                "ยาบำรุง",
                "ยาวิตามินและเกลือแร่เสริม",
                "อื่นๆ",
              ]}
              selectedChoice={newMedicine.type}
              onChoiceChange={(choice) =>
                setNewMedicine((prev) => ({ ...prev, type: choice }))
              }
              onOtherTextChange={(text) =>
                setNewMedicine((prev) => ({ ...prev, type: text }))
              }
            />
          </View>

          {/* รายละเอียด */}
          <InputFieldOne
            label="รายละเอียด (Optional)"
            value={newMedicine.details}
            onChangeText={(text) =>
              setNewMedicine((prev) => ({ ...prev, details: text }))
            }
            placeholder="ระบุรายละเอียดยา"
          />

          {/* ปุ่มบันทึก / ยกเลิก */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-200 rounded-lg px-6 py-3 flex-1 mr-2"
            >
              <Text className="text-lg text-center">ยกเลิก</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary rounded-lg px-6 py-3 flex-1 ml-2"
            >
              <Text className="text-lg text-white text-center">บันทึก</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMedicineScreen;
