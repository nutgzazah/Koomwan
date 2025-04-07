import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";
import MedDropdown from "./MedDropdown";
import { MEDICATION_TYPES } from "../../../constant/medication";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";
import ImageUploaderWithPreview from "../../../global/components/ImageUploader";
import MedicationFormModal from "./MedicationFormModal";

type ImagePickerResult = {
  canceled: boolean;
  assets: {
    uri: string;
  }[];
};

export default function MedicationForm() {
  const { reminderFormat, healthInfoId } = useLocalSearchParams();
  const [pillName, setPillName] = useState("");
  const [pillType, setPillType] = useState("");
  const [pillDescription, setPillDescription] = useState("");
  const [pillImage, setPillImage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [reminderTimes, setReminderTimes] = useState<string[]>(
    reminderFormat ? [reminderFormat as string] : []
  );

  // Loading states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"confirm" | "success" | "error">(
    "confirm"
  );
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const pathname = usePathname();
  console.log("Current Path:" + pathname);
  console.log("Reminder Format:", reminderFormat);
  console.log("HealthInfoId:", healthInfoId);

  useEffect(() => {
    if (reminderFormat && !reminderTimes.includes(reminderFormat as string)) {
      setReminderTimes([...reminderTimes, reminderFormat as string]);
    }
  }, [reminderFormat]);

  // Show modal helper function
  const showModal = (
    title: string,
    message: string,
    type: "confirm" | "success" | "error" = "confirm",
    onConfirm: () => void = () => {}
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setConfirmAction(() => onConfirm);
    setModalVisible(true);
  };

  const uploadImageToServer = async (imageUri: string) => {
    try {
      setIsUploadingImage(true);

      // ดึง auth token
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        showModal("Session Expired", "Please login again", "error", () =>
          router.push("/user/login")
        );
        return null;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;

      // สร้าง FormData
      const formData = new FormData();

      // เพิ่มไฟล์รูปภาพ
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("file", {
        uri: imageUri,
        type,
        name: filename,
      } as any);

      // เพิ่ม folder ที่จะอัปโหลด
      formData.append("folder", "pill-images");

      // ส่งไปที่ API อัปโหลดรูปภาพ
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
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

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
        quality: 0.6,
      })) as ImagePickerResult;

      if (!result.canceled && result.assets[0]) {
        // อัปโหลดรูปภาพไปยังเซิร์ฟเวอร์
        const imageUrl = await uploadImageToServer(result.assets[0].uri);
        if (imageUrl) {
          setPillImage(imageUrl);
        } else {
          Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัพโหลดรูปภาพได้");
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
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
        quality: 0.6,
      })) as ImagePickerResult;

      if (!result.canceled && result.assets[0]) {
        // อัปโหลดรูปภาพไปยังเซิร์ฟเวอร์
        const imageUrl = await uploadImageToServer(result.assets[0].uri);
        if (imageUrl) {
          setPillImage(imageUrl);
        } else {
          Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัพโหลดรูปภาพได้");
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
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

  //ปุ่ม เพิ่มยา
  const handleAddMedication = async () => {
    if (isSubmitting) {
      return; // Prevent double submission
    }

    if (!pillName.trim()) {
      showModal("กรุณากรอกชื่อยา", "ชื่อยาไม่สามารถเว้นว่างได้", "error");
      return;
    }

    showModal(
      "ยืนยันการเพิ่มยา",
      "คุณต้องการเพิ่มข้อมูลยา " + pillName + " ใช่หรือไม่?",
      "confirm",
      submitMedication
    );
  };

  const submitMedication = async () => {
    setIsSubmitting(true);
    try {
      // ดึง auth token
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        showModal("Session Expired", "Please login again", "error", () =>
          router.push("/user/login")
        );
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // ใช้ healthInfoId จาก URL params ถ้ามี หรือไม่ก็ดึงจาก API
      let finalHealthInfoId = healthInfoId as string;

      // ถ้าไม่มี healthInfoId จาก params ให้ดึงจาก API
      if (!finalHealthInfoId) {
        // ดึง healthInfoId ของผู้ใช้
        const userResponse = await axios.get(
          `${BASE_URL}/api/v1/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.data.success || !userResponse.data.user.healthinfo) {
          throw new Error("ไม่พบข้อมูลสุขภาพของผู้ใช้");
        }

        finalHealthInfoId = userResponse.data.user.healthinfo._id;
      }

      // Check if there's a local image to upload
      let finalImagePath = pillImage;

      if (localImageUri) {
        // upload the image
        const uploadedImagePath = await uploadImageToServer(localImageUri);
        if (uploadedImagePath) {
          finalImagePath = uploadedImagePath;
        } else {
          // Only show warning, don't block submission
          console.warn("Failed to upload image, proceeding without image");
        }
      }

      // เตรียมข้อมูล
      const medicationData = {
        pillName: pillName.trim(),
        pillType: pillType || "",
        description: pillDescription.trim() || "",
        pillImage: finalImagePath || null,
        reminderTimes: reminderTimes,
      };

      // ส่งข้อมูลไปยัง API
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/healthinfo/${finalHealthInfoId}/add-pill`,
        medicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // แสดงข้อความสำเร็จ
        showModal("สำเร็จ", "เพิ่มข้อมูลยาเรียบร้อยแล้ว", "success", () => {
          // ถ้ามาจากหน้า beginner setup (มี healthInfoId จาก params) ให้กลับไปที่หน้านั้น
          if (healthInfoId) {
            router.back();
          } else {
            router.back();
          }
        });
      } else {
        throw new Error(response.data.message || "ไม่สามารถเพิ่มข้อมูลยาได้");
      }
    } catch (error) {
      console.error("Error adding medication:", error);
      showModal(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถเพิ่มข้อมูลยาได้ กรุณาลองใหม่อีกครั้ง",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveReminder = (index: number) => {
    showModal(
      "ลบการแจ้งเตือน",
      "คุณต้องการลบการแจ้งเตือนนี้ใช่หรือไม่?",
      "confirm",
      () => {
        const updatedReminders = [...reminderTimes];
        updatedReminders.splice(index, 1);
        setReminderTimes(updatedReminders);
      }
    );
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
            <Text className="flex-1 text-headline text-secondary font-bold text-center">
              ยาประจำของฉัน
            </Text>
            <BreakLine />

            {/* Image Upload */}
            <ImageUploaderWithPreview
              imageUrl={pillImage}
              setImageUrl={setPillImage}
              localImage={localImageUri}
              setLocalImage={setLocalImageUri}
              disabled={isSubmitting}
            />

            {/* Name Input */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                ชื่อยา
              </Text>
              <TextInput
                value={pillName}
                onChangeText={setPillName}
                placeholder="ชื่อยา"
                className="w-full bg-background border border-gray rounded p-3 px-4 text-description font-regular h-12"
                editable={!isSubmitting}
              />
            </View>

            {/* Type Selection */}
            <View className="mt-4">
              <Text className="text-description text-secondary font-regular mb-2">
                ประเภท (Optional)
              </Text>
              <MedDropdown
                value={pillType}
                options={MEDICATION_TYPES}
                onSelect={handleSelectType}
                disabled={isSubmitting}
              />
            </View>

            {/* Details Input */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                รายละเอียด (Optional)
              </Text>
              <TextInput
                value={pillDescription}
                onChangeText={setPillDescription}
                placeholder="เพิ่มรายละเอียดเกี่ยวกับยา"
                multiline
                numberOfLines={4}
                className="w-full bg-background border border-gray rounded p-3 px-4 text-description font-regular h-32"
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Medicine Notification Display */}
            {reminderTimes.length > 0 && (
              <View className="mt-4 mb-4 w-full items-center">
                <View className=" flex-row items-center">
                  <Text className="text-description text-secondary font-regular mb-2">
                    แจ้งเตือนการใช้ยา (Optional)
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // ส่ง healthInfoId ไปที่หน้า medNoti หากมี
                      if (healthInfoId) {
                        router.push({
                          pathname: "/user/medNoti",
                          params: { healthInfoId },
                        });
                      } else {
                        router.push("/user/medNoti");
                      }
                    }}
                  >
                    <Image
                      source={require("../../../assets/BeginnerSetup/add.png")}
                      className="w-8 h-8 ml-1"
                    />
                  </TouchableOpacity>
                </View>
                <View className="w-full bg-background border border-gray rounded p-2 px-4 mt-2">
                  {reminderTimes.map((time, index) => (
                    <View
                      key={index}
                      className="py-1 flex-row items-center justify-between"
                    >
                      <View className="flex-row">
                        <Image
                          source={require("../../../assets/BeginnerSetup/clock.png")}
                          className="w-5 h-5 mr-2"
                        />
                        <Text className="text-description text-secondary font-regular">
                          {time
                            .replace("/", " เวลา ")
                            .replace("monday", "วันจันทร์")
                            .replace("tuesday", "วันอังคาร")
                            .replace("wednesday", "วันพุธ")
                            .replace("thursday", "วันพฤหัสบดี")
                            .replace("friday", "วันศุกร์")
                            .replace("saturday", "วันเสาร์")
                            .replace("sunday", "วันอาทิตย์")
                            .replace("everyday", "ทุกวัน")}
                        </Text>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => handleRemoveReminder(index)}
                        >
                          <Image
                            source={require("../../../assets/Profile/eraser.png")}
                            className="w-5 h-5"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Medicine Noti Button - Only show if no reminders */}
            {reminderTimes.length === 0 && (
              <View className="mt-4 mb-4 flex-row items-center">
                <Text className="text-description text-secondary font-regular">
                  แจ้งเตือนการใช้ยา (Optional)
                </Text>
                <TouchableOpacity
                  className="items-center ml-2"
                  onPress={() => {
                    // ส่ง healthInfoId ไปที่หน้า medNoti หากมี
                    if (healthInfoId) {
                      router.push({
                        pathname: "/user/medNoti",
                        params: { healthInfoId },
                      });
                    } else {
                      router.push("/user/medNoti");
                    }
                  }}
                >
                  <Image
                    source={require("../../../assets/BeginnerSetup/add.png")}
                    className="w-8 h-8"
                  />
                </TouchableOpacity>
              </View>
            )}
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

      {/* Custom Modal */}
      <MedicationFormModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        confirmText={modalType === "confirm" ? "ยืนยัน" : "ตกลง"}
        cancelText="ยกเลิก"
        onConfirm={() => {
          setModalVisible(false);
          confirmAction();
        }}
        onCancel={() => setModalVisible(false)}
        type={modalType}
        isLoading={modalType === "confirm" && isSubmitting}
      />
    </SafeAreaView>
  );
}
