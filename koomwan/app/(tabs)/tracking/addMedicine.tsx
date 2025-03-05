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
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import InputFieldOne from "./components/InputFieldOne";
import InputFieldLong from "./components/InputFieldLong";
import Dropdown from "./components/DropDown";
import BackButton from "../../../global/components/BackButton";


interface Medicine {
  id: string;
  name: string;
  type: string;
  details: string;
  image: string;
}

const AddMedicineScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [medicine, setMedicine] = useState<Medicine>({
    id: (params.id as string) || Date.now().toString(),
    name: (params.name as string) || "",
    type: (params.type as string) || "",
    details: (params.details as string) || "",
    image: (params.image as string) || "",
  });

  // Permission Required Image From User Gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status == "granted") {
      Alert.alert("Permission required", "กรุณาอนุญาตให้เข้าถึงรูปภาพ");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      setMedicine((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleSubmit = () => {
    if (!medicine.name.trim()) {
      Alert.alert("กรุณากรอกชื่อยา");
      return;
    }

    if (!medicine.type.trim()) {
      Alert.alert("กรุณาเลือกประเภทของยา");
      return;
    }

    const newMedicine = {
      id: medicine.id || Date.now().toString(),
      name: medicine.name,
      type: medicine.type,
      details: medicine.details,
      image: medicine.image,
    };

    router.push({
      pathname: "./medicineCollected",
      params: {
        id: newMedicine.id,
        name: newMedicine.name,
        type: newMedicine.type,
        details: newMedicine.details,
        image: newMedicine.image,
        isEdit: params.isEdit || "false",
      },
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <BackButton title="ย้อนกลับ" />
      <ScrollView className="mb-24">
        <Card>
          <Text className="font-sans text-title font-bold text-center mt-2 text-secondary">
            {params.isEdit === "true" ? "ยาเพิ่มเติม" : "เพิ่มยาเพิ่มเติม"}
          </Text>
          <BreakLine />

          <TouchableOpacity
            onPress={pickImage}
            className="bg-background border border-gray rounded-lg items-center justify-center mb-3 py-5 px-5"
            style={{ width: "100%", height: 200 }}
          >
            {medicine.image ? (
              <Image
                source={{ uri: medicine.image }}
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

          {/* For Create Additional Medicine */}
          <InputFieldOne
            label="ชื่อยา"
            value={medicine.name}
            onChangeText={(text) =>
              setMedicine((prev) => ({ ...prev, name: text }))
            }
            placeholder="ระบุชื่อยา"
          />

          {/* Medicine Type */}
          <Text className="font-sans text-description font-bold text-secondary self-start pl-1 mb-1">
            ประเภท
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
            selectedChoice={medicine.type}
            onChoiceChange={(choice) => {
              setMedicine((prev) => ({ ...prev, type: choice }));
            }}
            dropdownStyle={{ width: "99%"}}
            closeOnSelect={true}
          />

          {/* Medicine Detail */}
          <InputFieldLong
            label="รายละเอียด (Optional)"
            value={medicine.details}
            onChangeText={(text) =>
              setMedicine((prev) => ({ ...prev, details: text }))
            }
            placeholder="ระบุรายละเอียดยา"
            editable
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary rounded-lg px-20 py-3.5 mt-5"
          >
            <Text className="font-sans font-bold text-button text-card text-center">
              {params.isEdit === "true" ? "บันทึกการแก้ไข" : "เพิ่มยาเพิ่มเติม"}
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMedicineScreen;