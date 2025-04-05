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
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";
import MedDropdown from "../../../components/beginner/(medicine)/MedDropdown";
import ImageUploaderWithPreview from "../../../global/components/ImageUploader";
import { MEDICATION_TYPES } from "../../../constant/medication";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle selecting medication type
  const handleSelectType = (selectedType: string) => {
    setMedicine((prev) => ({ ...prev, type: selectedType }));
    setIsDropdownOpen(false);
  };

  // Upload image to server function
  const uploadImageToServer = async (imageUri: string) => {
    try {
      setIsUploading(true);

      // Get auth token
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        Alert.alert("เซสชันหมดอายุ", "กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        router.push("/user/login");
        return null;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;

      // Create FormData
      const formData = new FormData();

      // Add image file
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("file", {
        uri: imageUri,
        type,
        name: filename,
      } as any);

      // Add folder to upload to
      formData.append("folder", "pill-images");

      // Send to image upload API
      const response = await axios.post(
        `${BASE_URL}/api/v1/storage/uploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.R2filePath) {
        return response.data.R2filePath;
      }

      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัพโหลดรูปภาพได้");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return; // Prevent double submission
    }

    // Validate required fields
    if (!medicine.name.trim()) {
      Alert.alert("กรุณากรอกชื่อยา", "ชื่อยาไม่สามารถเว้นว่างได้");
      return;
    }

    if (!medicine.type.trim()) {
      Alert.alert("กรุณาเลือกประเภทของยา", "ประเภทยาไม่สามารถเว้นว่างได้");
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle image upload if a local image is available
      let finalImagePath = medicine.image;

      if (localImageUri) {
        // Upload the image
        const uploadedImagePath = await uploadImageToServer(localImageUri);
        if (uploadedImagePath) {
          finalImagePath = uploadedImagePath;
        } else {
          console.warn("Failed to upload image, proceeding without image");
        }
      }

      // Create the medicine object with the updated image path
      const newMedicine = {
        id: medicine.id || Date.now().toString(),
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: finalImagePath,
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
    } catch (error) {
      console.error("Error submitting medicine:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลยาได้");
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Image Uploader with loading indicator */}
            {isUploading ? (
              <View className="w-full h-[150px] bg-background rounded-lg items-center justify-center border border-gray">
                <ActivityIndicator size="large" color="#3972F0" />
                <Text className="text-description text-secondary font-regular mt-2">
                  กำลังอัพโหลดรูปภาพ...
                </Text>
              </View>
            ) : (
              <ImageUploaderWithPreview
                imageUrl={medicine.image}
                setImageUrl={(url) =>
                  setMedicine((prev) => ({ ...prev, image: url }))
                }
                localImage={localImageUri}
                setLocalImage={setLocalImageUri}
                disabled={isSubmitting}
              />
            )}

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
                editable={!isSubmitting}
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
                disabled={isSubmitting}
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
                editable={!isSubmitting}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || isUploading}
              className={`bg-primary rounded-lg py-4 mt-6 w-full ${
                isSubmitting || isUploading ? "bg-gray" : "bg-primary"
              }`}
            >
              {isSubmitting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text className="font-sans font-bold text-button text-card text-center ml-2">
                    กำลังบันทึก...
                  </Text>
                </View>
              ) : (
                <Text className="font-sans font-bold text-button text-card text-center">
                  {params.isEdit === "true"
                    ? "บันทึกการแก้ไข"
                    : "เพิ่มยาเพิ่มเติม"}
                </Text>
              )}
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddMedicineScreen;
