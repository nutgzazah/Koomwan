import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import BackButton from "../../global/components/BackButton";
import ProfileInputField from "../../components/profile/ProfileInputField";
import ProfileDropdown from "../../components/profile/ProfileDropdown";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// Define available options
const GENDER_OPTIONS = ["ชาย", "หญิง"];
const STATUS_OPTIONS = ["ผู้ป่วยเบาหวาน", "ผู้ใช้ทั่วไป"];

export default function EditProfileScreen() {
  const router = useRouter();

  // Form Data State
  const [formData, setFormData] = useState({
    username: "Somchai123",
    profileImage: require("../../assets/Profile/images/profile.png"),
    height: "168",
    birthDate: "09/01/2541",
    gender: "ชาย",
    status: "ผู้ป่วยเบาหวาน",
    email: "",
    phone: "0819430552",
  });

  // Date Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
  // Image Picker
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle Date Selection
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate === undefined) {
      setShowDatePicker(false);
      setTempDate(undefined);
      return;
    }

    setTempDate(selectedDate);

    if (Platform.OS === "android") {
      const formattedDate = formatDate(selectedDate);
      setFormData({ ...formData, birthDate: formattedDate });
      setShowDatePicker(false);
      setTempDate(undefined);
    }
  };

  // Handle iOS Date Confirmation
  const handleIOSDateConfirm = () => {
    if (tempDate) {
      const formattedDate = formatDate(tempDate);
      setFormData({ ...formData, birthDate: formattedDate });
      setShowDatePicker(false);
      setTempDate(undefined);
    }
  };

  // Handle iOS Date Cancel
  const handleIOSDateCancel = () => {
    setShowDatePicker(false);
    setTempDate(undefined);
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const thaiYear = date.getFullYear() + 543;
    return `${day}/${month}/${thaiYear}`;
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "ต้องการการอนุญาต",
          "แอพต้องการสิทธิ์ในการเข้าถึงคลังรูปภาพของคุณ"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 48 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <BackButton title="โปรไฟล์ของฉัน" />

          <Card>
            <View className="flex-col items-center w-full mb-4">
              <Text className="text-title font-bold text-secondary">
                แก้ไขโปรไฟล์
              </Text>
              <BreakLine />

              {/* Profile Image Section */}
              <View className="relative mb-4">
                <Image
                  source={
                    selectedImage
                      ? { uri: selectedImage }
                      : formData.profileImage
                  }
                  className="w-[150px] h-[150px] rounded-full"
                />
                <TouchableOpacity
                  className="absolute bottom-0 right-0"
                  onPress={pickImage}
                >
                  <Image
                    source={require("../../assets/Profile/edit.png")}
                    className="w-12 h-12"
                  />
                </TouchableOpacity>
              </View>

              {/* Username Display */}
              <View className="flex-row items-center mb-4">
                <Image
                  source={require("../../assets/Profile/user.png")}
                  className="w-6 h-6"
                />
                <Text className="text-headline font-bold text-secondary pl-2">
                  {formData.username}
                </Text>
              </View>

              <BreakLine />

              {/* Profile Input Fields */}
              <View className="w-full space-y-6 py-2">
                <ProfileInputField
                  icon={require("../../assets/Profile/ruler-pen.png")}
                  label="ส่วนสูง"
                  value={formData.height}
                  onChangeText={(text) =>
                    setFormData({ ...formData, height: text })
                  }
                />

                {/* Date of Birth Field */}
                <View>
                  <ProfileInputField
                    icon={require("../../assets/Profile/cake.png")}
                    label="วันเกิด"
                    value={formData.birthDate}
                    isDatePicker={true}
                    showDatePicker={showDatePicker}
                    onPressDate={() => setShowDatePicker(true)}
                    onDateChange={handleDateChange}
                    tempDate={tempDate}
                  />

                  {/* iOS Date Picker Controls */}
                  {Platform.OS === "ios" && showDatePicker && (
                    <View className="flex-row justify-end space-x-2 mt-2 mb-2">
                      <TouchableOpacity
                        className="bg-white rounded-lg px-4 py-2"
                        onPress={handleIOSDateCancel}
                      >
                        <Text className="text-secondary font-bold text-sub-button">
                          ยกเลิก
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-primary rounded-lg px-4 py-2"
                        onPress={handleIOSDateConfirm}
                      >
                        <Text className="text-white font-bold text-sub-button">
                          ยืนยัน
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Gender Dropdown */}
                <ProfileDropdown
                  icon={require("../../assets/Profile/sex.png")}
                  label="เพศ"
                  value={formData.gender}
                  options={["ชาย", "หญิง"]}
                  onSelect={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                />

                {/* Status Dropdown */}
                <ProfileDropdown
                  icon={require("../../assets/Profile/heart.png")}
                  label="สถานะ"
                  value={formData.status}
                  options={["ผู้ป่วยเบาหวาน", "ผู้ใช้ทั่วไป"]}
                  onSelect={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                />

                <ProfileInputField
                  icon={require("../../assets/Profile/email.png")}
                  label="อีเมล"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  placeholder="เพิ่มอีเมล"
                />

                <ProfileInputField
                  icon={require("../../assets/Profile/phone.png")}
                  label="เบอร์โทรศัพท์"
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                />
              </View>
            </View>
          </Card>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-primary mx-6 py-4 rounded-lg my-4"
            onPress={() => {
              // TODO: Handle save
              router.back();
            }}
          >
            <Text className="text-white text-center font-bold text-button">
              บันทึก
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
