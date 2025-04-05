import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";
import MedDropdown from "../../../components/beginner/(medicine)/MedDropdown";
import ImageUploaderWithPreview from "../../../global/components/ImageUploader";
import { MEDICATION_TYPES } from "../../../constant/medication";

interface Medicine {
  id: string;
  name: string;
  type: string;
  details: string;
  image: string | null;
}

const AddMedicineScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [medicine, setMedicine] = useState<Medicine>({
    id: (params.id as string) || Date.now().toString(),
    name: (params.name as string) || "",
    type: (params.type as string) || "",
    details: (params.details as string) || "",
    image: (params.image as string) || null,
  });

  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle selecting medication type
  const handleSelectType = (selectedType: string) => {
    setMedicine((prev) => ({ ...prev, type: selectedType }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (!medicine.name.trim()) {
      Alert.alert("กรุณากรอกชื่อยา", "ชื่อยาไม่สามารถเว้นว่างได้");
      return;
    }

    if (!medicine.type.trim()) {
      Alert.alert("กรุณาเลือกประเภทของยา", "ประเภทยาไม่สามารถเว้นว่างได้");
      return;
    }

    // Use local image URI if available, otherwise use the image path from params
    const imageToUse = localImageUri || medicine.image;

    // Create the medicine object to pass to the next screen
    const newMedicine = {
      id: medicine.id || Date.now().toString(),
      name: medicine.name,
      type: medicine.type,
      details: medicine.details,
      image: imageToUse,
    };

    console.log("New Medicine:", newMedicine);

    // Navigate back to medicine collection screen with the new/edited medicine
    router.dismissTo({
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="mb-24">
          <Card>
            <Text className="font-sans text-title font-bold text-center mt-2 text-secondary">
              {params.isEdit === "true" ? "แก้ไขยาเพิ่มเติม" : "ยาเพิ่มเติม"}
            </Text>

            <BreakLine />

            {/* Image Uploader */}
            <ImageUploaderWithPreview
              imageUrl={medicine.image}
              setImageUrl={(url) =>
                setMedicine((prev) => ({ ...prev, image: url }))
              }
              localImage={localImageUri}
              setLocalImage={setLocalImageUri}
            />

            {/* Medicine Name */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                ชื่อยา
              </Text>
              <TextInput
                value={medicine.name}
                onChangeText={(text) =>
                  setMedicine((prev) => ({ ...prev, name: text }))
                }
                placeholder="ระบุชื่อยา"
                className="w-full bg-background border border-gray rounded p-3 px-4 text-description font-regular h-12"
              />
            </View>

            {/* Medicine Type */}
            <View className="mt-4">
              <Text className="text-description text-secondary font-regular mb-2">
                ประเภท
              </Text>
              <MedDropdown
                value={medicine.type}
                options={MEDICATION_TYPES}
                onSelect={handleSelectType}
              />
            </View>

            {/* Medicine Description */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                รายละเอียด (Optional)
              </Text>
              <TextInput
                value={medicine.details}
                onChangeText={(text) =>
                  setMedicine((prev) => ({ ...prev, details: text }))
                }
                placeholder="ระบุรายละเอียดยา"
                multiline
                numberOfLines={4}
                className="w-full bg-background border border-gray rounded p-3 px-4 text-description font-regular h-32"
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary rounded-lg py-4 mt-6 w-full"
            >
              <Text className="font-sans font-bold text-button text-card text-center">
                {params.isEdit === "true"
                  ? "บันทึกการแก้ไข"
                  : "เพิ่มยาเพิ่มเติม"}
              </Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddMedicineScreen;
