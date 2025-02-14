import React, { useState } from "react";
import {
   View, 
   Text, 
   TouchableOpacity, 
   Image, 
   Alert, 
   ScrollView 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import InputFieldOne from "./components/InputFieldOne";
import Dropdown from "./components/DropDown";

interface Medicine {
  name: string;
  type: string;
  details: string;
  image: string | null;
}

const AddMedicineScreen: React.FC = () => {
  const router = useRouter();
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: "",
    type: "",
    details: "",
    image: null,
  });

  const [selectedType, setSelectedType] = useState<string>("");

  // ขออนุญาตเข้าถึงรูปภาพ
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant media library access to add an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setNewMedicine({ ...newMedicine, image: result.assets[0].uri });
    }
  };

  // ตรวจสอบข้อมูลและบันทึก
  const handleSubmit = () => {
    if (!newMedicine.name.trim()) {
      Alert.alert("กรุณากรอกชื่อยา");
      return;
    }

    if (!selectedType.trim()) {
      Alert.alert("กรุณาเลือกประเภทของยา");
      return;
    }

    Alert.alert("บันทึกสำเร็จ", "ยาได้รับการบันทึกเรียบร้อย");
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView  className="mb-24 ">
        <Card>
          <Text className="text-title font-sans font-bold text-center mt-2 text-secondary">เพิ่มยาใหม่</Text>
          <BreakLine />

          {/* กรอบอัปโหลดรูปยา */}
          <TouchableOpacity
            onPress={pickImage}
            className="bg-background border border-gray rounded-lg px-20 py-5 items-center justify-center mb-4 " style={{ width: 300, height: 200 }}
          >
            {newMedicine.image ? (
              <Image source={{ uri: newMedicine.image }} className="w-40 h-40 rounded-lg" />
            ) : (
              <Image 
              source={require("../../../assets/Tracking/add-image.png")} className="w-20 h-20 mb-2" 
              style={{ width: '100%', height: '100%' }} // ให้ภาพยืดให้พอดีกับขนาดของกล่อง
              resizeMode="contain" // ให้ภาพไม่ถูกบิดเบือน ย่อให้พอดีกับกล่อง
              />
            )}
          </TouchableOpacity>

          {/* ชื่อยา */}
          <InputFieldOne
            label="ชื่อยา"
            value={newMedicine.name}
            onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
            placeholder="ระบุชื่อยา"
          />

          {/*Dropdown Choice For Chosse Type*/}
        <Text className="text-description font-bold font-sans text-secondary px-1 mb-2">ประเภท (Optional)</Text>
        <Dropdown
          choices={[
            'ยาเฉพาะโรค',
            'ยาสามัญประจำบ้าน',
            'ยาใช้ภายนอก',
            'ยาบำรุง',
            'ยาวิตามินและเกลือแร่เสริม',
            'อื่นๆ'
          ]}
          selectedChoice={selectedType}
          onChoiceChange={(choice) => setSelectedType(choice)}
          onOtherTextChange={(text) => setSelectedType(text)}
        />

          {/* รายละเอียดของยา */}
          <InputFieldOne
            label="รายละเอียด (Optional)"
            value={newMedicine.details}
            onChangeText={(text) => setNewMedicine({ ...newMedicine, details: text })}
            placeholder="ระบุรายละเอียดยา"
            editable
          />

          {/* ปุ่มต่างๆ */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity onPress={() => router.back()} className="bg-gray-200 rounded-lg px-6 py-3 flex-1 mr-2">
              <Text className="text-lg text-center">ยกเลิก</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} className="bg-primary rounded-lg px-6 py-3 flex-1 ml-2">
              <Text className="text-lg text-white text-center">บันทึก</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMedicineScreen;