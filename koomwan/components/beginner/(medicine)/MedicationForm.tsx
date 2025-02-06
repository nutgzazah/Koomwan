import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";

type ImagePickerResult = {
  canceled: boolean;
  assets: {
    uri: string;
  }[];
};

// Simulated API service
const api = {
  uploadImage: async (uri: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success/failure (80% success rate)
    if (Math.random() > 0.2) {
      return { success: true, imageUrl: uri };
    }
    throw new Error("Failed to upload image");
  },

  addMedication: async (data: {
    name: string;
    type?: string;
    description?: string;
    imageUrl?: string;
  }) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success/failure (90% success rate)
    if (Math.random() > 0.1) {
      return { success: true, data };
    }
    throw new Error("Failed to add medication");
  },
};

export default function MedicationForm() {
  const [pill_name, setPillName] = useState("");
  const [pill_type, setPillType] = useState("");
  const [pill_description, setPillDescription] = useState("");
  const [pill_image, setPillImage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Loading states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Dropdown ยา
  const medicationTypes = [
    "ยารักษาโรคเบาหวาน",
    "ยารักษาเฉพาะโรค",
    "ยาสามัญประจำบ้าน",
    "ยาใช้ภายนอก",
    "ยาอันตราย",
    "ยาวิตามินและอาหารเสริม",
    "อื่นๆ",
  ];
  {
    /* สำหรับอัพโหลดภาพ */
  }
  const handleImageUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "ต้องการการอนุญาต",
          "แอพต้องการการอนุญาตในการเข้าถึงคลังรูปภาพของคุณ",
          [{ text: "ตกลง" }]
        );
        return;
      }

      const result = (await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      })) as ImagePickerResult;

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        try {
          // Simulate API upload
          const response = await api.uploadImage(result.assets[0].uri);
          setPillImage(response.imageUrl);
        } catch (error) {
          Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัพโหลดรูปภาพได้");
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "ต้องการการอนุญาต",
          "แอพต้องการการอนุญาตในการเข้าถึงกล้องของคุณ",
          [{ text: "ตกลง" }]
        );
        return;
      }

      const result = (await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      })) as ImagePickerResult;

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        try {
          // Simulate API upload
          const response = await api.uploadImage(result.assets[0].uri);
          setPillImage(response.imageUrl);
        } catch (error) {
          Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัพโหลดรูปภาพได้");
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถถ่ายรูปได้");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "เพิ่มรูปภาพ",
      "เลือกวิธีการเพิ่มรูปภาพ",
      [
        {
          text: "ถ่ายภาพ",
          onPress: handleTakePhoto,
        },
        {
          text: "เลือกจากคลังภาพ",
          onPress: handleImageUpload,
        },
        {
          text: "ยกเลิก",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveImage = () => {
    Alert.alert(
      "ลบรูปภาพ",
      "คุณต้องการลบรูปภาพนี้ใช่หรือไม่?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบ",
          onPress: () => setPillImage(null),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  // ชนิดยา
  const handleSelectType = (selectedType: string) => {
    setPillType(selectedType);
    setIsDropdownOpen(false);
  };
  //ปุ่ม กลับ
  const handleBack = () => {
    if (isSubmitting) {
      return; // Prevent navigation while submitting
    }
    router.back();
  };
  //ปุ่ม เพิ่มยา
  const handleAddMedication = async () => {
    if (isSubmitting) {
      return; // Prevent double submission
    }

    // Validation
    if (!pill_name.trim()) {
      Alert.alert("กรุณากรอกชื่อยา", "ชื่อยาไม่สามารถเว้นว่างได้");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data
      const medicationData = {
        name: pill_name.trim(),
        type: pill_type || undefined,
        description: pill_description.trim() || undefined,
        imageUrl: pill_image || undefined,
      };

      // Simulate API call
      await api.addMedication(medicationData);

      // Show success message
      Alert.alert("สำเร็จ", "เพิ่มข้อมูลยาเรียบร้อยแล้ว", [
        {
          text: "ตกลง",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถเพิ่มข้อมูลยาได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <BackButton title="ย้อนกลับ" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          <Card>
            <Text className="flex-1 text-headline text-secondary font-medium text-center">
              ยาประจำของฉัน
            </Text>
            <BreakLine />

            {/* Image Upload */}
            <TouchableOpacity
              onPress={pill_image ? handleRemoveImage : showImageOptions}
              disabled={isUploadingImage}
              className="w-full aspect-[2/1] bg-background rounded-lg items-center justify-center border border-gray relative"
            >
              {isUploadingImage ? (
                <View className="items-center">
                  <ActivityIndicator size="large" color="#3972F0" />
                  <Text className="text-description text-gray font-regular mt-2">
                    กำลังอัพโหลด...
                  </Text>
                </View>
              ) : pill_image ? (
                <>
                  <Image
                    source={{ uri: pill_image }}
                    className="w-full h-full rounded-lg p-1"
                    resizeMode="contain"
                  />
                  <View className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                    <Image
                      source={require("../../../assets/BeginnerSetup/trash.png")}
                      className="w-5 h-5"
                      resizeMode="contain"
                    />
                  </View>
                </>
              ) : (
                <View className="items-center">
                  <Image
                    source={require("../../../assets/BeginnerSetup/add-image.png")}
                    className="w-16 h-16 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-description text-gray font-regular">
                    เพิ่มรูปภาพ
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Name Input */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                ชื่อยา
              </Text>
              <TextInput
                value={pill_name}
                onChangeText={setPillName}
                placeholder="ชื่อยา"
                className="w-full bg-background border border-gray rounded p-3 text-description font-regular"
                editable={!isSubmitting}
              />
            </View>

            {/* Type Selection */}
            <View className="mt-4">
              <Text className="text-description text-secondary font-regular mb-2">
                ประเภท (Optional)
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isSubmitting}
                  className="w-full bg-background border border-gray rounded p-3 flex-row justify-between items-center"
                >
                  <Text className="text-description font-regular text-secondary">
                    {pill_type || "เลือกประเภทยา"}
                  </Text>
                  <Image
                    source={require("../../../assets/BeginnerSetup/drop-arrow.png")}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View className="absolute top-full left-0 right-0 mt-1 bg-card border border-gray rounded-lg shadow-lg z-50 max-h-48">
                    <ScrollView>
                      {medicationTypes.map((medicationType, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleSelectType(medicationType)}
                          className={`p-3 border-b border-gray ${
                            index === medicationTypes.length - 1
                              ? "border-b-0"
                              : ""
                          }`}
                        >
                          <Text className="text-description font-regular">
                            {medicationType}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Details Input */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                รายละเอียด (Optional)
              </Text>
              <TextInput
                value={pill_description}
                onChangeText={setPillDescription}
                placeholder="เพิ่มรายละเอียดเกี่ยวกับยา"
                multiline
                numberOfLines={4}
                className="w-full bg-background border border-gray rounded p-3 text-description font-regular h-32"
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Medicine Noti */}
            <View className="mt-4 mb-4 flex-row">
              <Text className="text-description text-secondary font-regular mb-2">
                แจ้งเตือนการใช้ยา (Optional)
              </Text>
              <TouchableOpacity
                className="items-center"
                onPress={() => router.push("user/medNoti")}
              >
                <Image
                  source={require("../../../assets/BeginnerSetup/add.png")}
                  className="w-8 h-8 ml-1"
                />
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>

        {/* Add Button */}
        <View className="px-4 py-4 bg-card border-gray">
          <TouchableOpacity
            onPress={handleAddMedication}
            disabled={isSubmitting}
            className={`w-full py-4 rounded ${
              isSubmitting ? "bg-gray" : "bg-primary"
            }`}
          >
            {isSubmitting ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text className="text-card text-center font-bold text-button ml-2">
                  กำลังเพิ่มข้อมูล...
                </Text>
              </View>
            ) : (
              <Text className="text-card text-center font-bold text-button">
                เพิ่มยา
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
