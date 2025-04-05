import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";
import InputFieldOne from "./components/InputFieldOne";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../../config";

export default function SummaryTrackingScreen() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [imageUploadStatus, setImageUploadStatus] = useState<{
    [key: string]: string;
  }>({});

  // States for storing data
  const [formData, setFormData] = useState<any>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<any>({});
  const [regularMedicines, setRegularMedicines] = useState<any[]>([]);
  const [additionalMedicines, setAdditionalMedicines] = useState<any[]>([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);

        // Load form data and selected medicines from AsyncStorage
        const [formDataStr, selectedMedicinesStr] = await Promise.all([
          AsyncStorage.getItem("trackingFormData"),
          AsyncStorage.getItem("selectedMedicines"),
        ]);

        if (!formDataStr) {
          console.error("No form data found");
          Alert.alert("ข้อมูลไม่ครบถ้วน", "ไม่พบข้อมูลสุขภาพที่บันทึกไว้");
          router.back();
          return;
        }

        const parsedFormData = JSON.parse(formDataStr);
        const parsedMedicines = selectedMedicinesStr
          ? JSON.parse(selectedMedicinesStr)
          : {};

        // Set states
        setFormData(parsedFormData);
        setSelectedMedicines(parsedMedicines);

        // Separate regular and additional medicines
        const medicines = Object.values(parsedMedicines);

        const regular = medicines.filter((med: any) => med.time !== undefined);
        const additional = medicines.filter(
          (med: any) => med.time === undefined
        );

        setRegularMedicines(regular);
        setAdditionalMedicines(additional);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  // Upload image to server
  const uploadImageToServer = async (imageUri: string) => {
    try {
      // Skip if already uploaded to server (URL starts with BASE_URL)
      if (imageUri.startsWith(BASE_URL) || !imageUri.startsWith("file://")) {
        return imageUri;
      }

      // Get auth token
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        throw new Error("Authentication data not found");
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

      // Specify upload folder
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

      throw new Error("Image upload failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submission to API
  const handleConfirm = async () => {
    try {
      setLoading(true);

      // Get authentication data
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData || !formData) {
        Alert.alert("ข้อผิดพลาด", "ข้อมูลไม่ครบถ้วน");
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Upload any local images for additional pills
      const additionalPillsWithImages = await Promise.all(
        additionalMedicines.map(async (medicine) => {
          // Update status for this medicine
          setImageUploadStatus((prev) => ({
            ...prev,
            [medicine.id]: "uploading",
          }));

          let pillImage = "";
          // Check if image is a local file URI or already a server path
          if (typeof medicine.image === "string") {
            if (medicine.image.startsWith("file://")) {
              // It's a local file, needs to be uploaded
              const uploadedPath = await uploadImageToServer(medicine.image);
              if (uploadedPath) {
                // Extract just the filename from the path
                pillImage =
                  typeof uploadedPath === "string"
                    ? uploadedPath.split("/").pop() || ""
                    : "";
                setImageUploadStatus((prev) => ({
                  ...prev,
                  [medicine.id]: "success",
                }));
              } else {
                setImageUploadStatus((prev) => ({
                  ...prev,
                  [medicine.id]: "failed",
                }));
              }
            } else if (medicine.image.includes("/")) {
              // It's a server path, extract filename
              pillImage = medicine.image.split("/").pop() || "";
            }
          }

          return {
            pillName: medicine.name,
            pillImage: pillImage,
            pillType: medicine.type,
            description: medicine.details || "",
            takePillTimes: [formData.time.replace(" น.", "")], // Use time from form data
          };
        })
      );

      // Parse date and time for API
      const dateParts = formData.date.split("/");
      const timeParts = formData.time.replace(" น.", "").split(":");

      // Create date object (convert Buddhist year to Gregorian)
      const recordTime = new Date(
        parseInt(dateParts[2]) - 543, // Convert from Buddhist era to Gregorian
        parseInt(dateParts[1]) - 1, // Month is 0-indexed
        parseInt(dateParts[0]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1])
      );

      // Create request payload
      const payload = {
        userId: userId,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        bloodsugar: formData.bloodSugar
          ? parseFloat(formData.bloodSugar)
          : undefined,
        a1c: formData.a1c ? parseFloat(formData.a1c) : undefined,
        bloodpressure:
          formData.bloodPressure.systolic || formData.bloodPressure.diastolic
            ? {
                systolic: formData.bloodPressure.systolic
                  ? parseFloat(formData.bloodPressure.systolic)
                  : undefined,
                diastolic: formData.bloodPressure.diastolic
                  ? parseFloat(formData.bloodPressure.diastolic)
                  : undefined,
              }
            : undefined,
        moodstatus: formData.mood || undefined,
        additionpill:
          additionalPillsWithImages.length > 0
            ? additionalPillsWithImages
            : undefined,
        recordtime: recordTime.toISOString(),
      };

      // Make API request
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/addRecord`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update medication tracking status for regular medications if they were selected
        if (regularMedicines.length > 0) {
          try {
            // Get date in YYYY-MM-DD format
            const trackingDate = `${recordTime.getFullYear()}-${String(
              recordTime.getMonth() + 1
            ).padStart(2, "0")}-${String(recordTime.getDate()).padStart(
              2,
              "0"
            )}`;

            // Update each selected medication
            await Promise.all(
              regularMedicines.map(async (med) => {
                await axios.post(
                  `${BASE_URL}/api/v1/regular-pills/update-status`,
                  {
                    medicationId: med.id,
                    userId: userId,
                    status: "taken",
                    actualTime: med.time,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              })
            );
          } catch (medicationError) {
            console.error("Error updating medication status:", medicationError);
          }
        }

        // Clear temporary storage
        await Promise.all([
          AsyncStorage.removeItem("trackingFormData"),
          AsyncStorage.removeItem("selectedMedicines"),
          AsyncStorage.removeItem("isFirstLoadMed"),
          AsyncStorage.removeItem("additionalMedicines"),
          AsyncStorage.removeItem("selectedMedicinesStatus"),
        ]);

        setShowSuccessModal(true);
      } else {
        throw new Error(response.data.message || "การบันทึกล้มเหลว");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "การบันทึกล้มเหลว",
        "ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);

    // Clear all form-related data
    AsyncStorage.removeItem("trackingFormData");
    AsyncStorage.removeItem("selectedMedicines");
    router.dismissTo("/tracking");
    router.replace("/(tabs)");
  };

  // Function to get mood image
  const getMoodImage = (mood: string) => {
    switch (mood) {
      case "happy":
        return require("../../../assets/Tracking/mood-happy.png");
      case "laughing":
        return require("../../../assets/Tracking/mood-laughing.png");
      case "neutral":
        return require("../../../assets/Tracking/mood-neutral.png");
      case "irritated":
        return require("../../../assets/Tracking/mood-irritated.png");
      case "sick":
        return require("../../../assets/Tracking/mood-sick.png");
      case "crying":
        return require("../../../assets/Tracking/mood-crying.png");
      case "angry":
        return require("../../../assets/Tracking/mood-angry.png");
      default:
        return require("../../../assets/Tracking/mood-happy.png");
    }
  };

  // Function to render medicine image with proper handling
  const renderMedicineImage = (medicine: any) => {
    return (
      <Image
        source={require("../../../assets/Tracking/Medicine.png")}
        className="w-10 h-10 "
      />
    );
  };

  if (dataLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3972F0" />
        <Text className="mt-4 text-secondary">กำลังโหลดข้อมูล...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24">
        <BackButton title="ย้อนกลับ" />

        <Card>
          <Text className="text-title font-sans font-bold text-secondary text-center mt-2">
            ข้อมูลที่บันทึก
          </Text>
          <Text className="text-description font-sans text-secondary text-center">
            ณ วันที่ {formData?.date || "-"}
          </Text>
          <Text className="text-description font-sans text-secondary text-center mb-1">
            เวลา {formData?.time || "-"}
          </Text>
        </Card>

        <Card>
          <Text className="text-title font-sans text-secondary text-center mt-1">
            ข้อมูลสุขภาพ
          </Text>
          <BreakLine />

          {/* Weight And Height */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="น้ำหนัก"
                value={formData?.weight || "-"}
                placeholder="เช่น 60"
                editable={false}
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ส่วนสูง"
                value={formData?.height || "-"}
                placeholder="เช่น 160"
                editable={false}
              />
            </View>
          </View>

          {/* Blood Sugar */}
          <InputFieldOne
            label="ค่าระดับน้ำตาลในเลือด (Optional)"
            value={formData?.bloodSugar || "-"}
            placeholder="เช่น 90"
            editable={false}
          />

          {/* A1c */}
          <InputFieldOne
            label="ค่าเฉลี่ยน้ำตาลในเลือด HbA1c (Optional)"
            value={formData?.a1c || "-"}
            placeholder="เช่น 5.6"
            editable={false}
          />

          {/* Blood Pressure */}
          <View className="flex-row justify-between">
            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวบน (Optional)"
                value={formData?.bloodPressure?.systolic || "-"}
                placeholder="เช่น 120"
                editable={false}
              />
            </View>

            <View className="w-1/2">
              <InputFieldOne
                label="ค่าความดันตัวล่าง (Optional)"
                value={formData?.bloodPressure?.diastolic || "-"}
                placeholder="เช่น 80"
                editable={false}
              />
            </View>
          </View>
        </Card>

        {/* Mood Information */}
        {formData?.mood && (
          <Card>
            <Text className="text-title font-sans text-secondary text-center mt-2">
              ข้อมูลอารมณ์
            </Text>
            <BreakLine />
            <Text className="text-description text-secondary font-sans text-center ">
              อารมณ์ของคุณ
            </Text>

            <View className="items-center px-6 mt-2 rounded-xl bg-card ">
              <Image
                source={getMoodImage(formData.mood)}
                className="w-16 h-16"
                resizeMode="contain"
              />
              <Text className="text-description text-secondary font-sans font-bold mt-2">
                {formData.mood === "happy"
                  ? "มีความสุข"
                  : formData.mood === "laughing"
                  ? "หัวเราะ"
                  : formData.mood === "neutral"
                  ? "เฉยๆ"
                  : formData.mood === "irritated"
                  ? "หงุดหงิด"
                  : formData.mood === "sick"
                  ? "ป่วย"
                  : formData.mood === "crying"
                  ? "ร้องไห้"
                  : formData.mood === "angry"
                  ? "โกรธ"
                  : "มีความสุข"}
              </Text>
            </View>
          </Card>
        )}

        {/* Regular Medicines */}
        {regularMedicines.length > 0 && (
          <Card>
            <Text className="text-title font-sans text-secondary text-center mt-2">
              ยาประจำ
            </Text>
            <BreakLine />
            {regularMedicines.map((medicine: any, index: number) => (
              <View
                key={`regular-med-${medicine.id}-${index}`}
                className="flex-row items-center mt-3 mb-1"
              >
                {renderMedicineImage(medicine)}
                <View className="ml-4 flex-1">
                  <Text className="text-description font-sans text-secondary font-semibold">
                    {medicine.name}
                  </Text>
                  {medicine.time && (
                    <Text className="text-tag font-sans text-secondary">
                      เวลา {medicine.time}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Additional Medicines */}
        {additionalMedicines.length > 0 && (
          <Card>
            <Text className="text-title font-sans text-secondary text-center mt-2">
              ยาเพิ่มเติม
            </Text>
            <BreakLine />
            {additionalMedicines.map((medicine: any, index: number) => (
              <View
                key={`additional-med-${medicine.id}-${index}`}
                className="flex-row items-center mt-3 mb-1"
              >
                {renderMedicineImage(medicine)}
                <View className="ml-4 flex-1">
                  <Text className="text-description font-sans text-secondary font-semibold">
                    {medicine.name}
                  </Text>
                  <Text className="text-tag font-sans text-secondary mt-1">
                    {medicine.type}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          className={`rounded-lg py-4 px-8 mt-5 mb-6 mx-6 ${
            loading ? "bg-gray" : "bg-primary"
          }`}
        >
          <Text className="text-button text-card text-center font-bold">
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View className="items-center mt-2 mb-5">
            <ActivityIndicator size="large" color="#3972F0" />
          </View>
        )}

        {/* Success Modal */}
        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-gray-500 bg-opacity-50">
            <View className="bg-card rounded-2xl p-7 m-4 items-center">
              <Text className="text-title font-sans text-center mb-1 font-bold">
                บันทึกข้อมูล
              </Text>
              <Text className="text-description font-sans text-center mb-3">
                สุขภาพของคุณสำเร็จ!
              </Text>
              <Image
                source={require("../../../assets/Tracking/tick-circle.png")}
                className="w-20 h-20 mb-5"
              />
              <TouchableOpacity
                className="bg-primary rounded-lg px-20 py-4"
                onPress={handleCloseSuccess}
              >
                <Text className="text-button font-sans text-card font-bold text-center">
                  ปิด
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
