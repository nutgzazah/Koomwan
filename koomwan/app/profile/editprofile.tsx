import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import BackButton from "../../global/components/BackButton";
import ProfileInputField from "../../components/profile/ProfileInputField";
import ProfileDropdown from "../../components/profile/ProfileDropdown";
import ProfileImage from "../../components/profile/ProfileImage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Loading from "../../global/components/Loading";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../config";
import ProfileImageHandler from "../../util/ProfileImageHandler";

// Define available options
const GENDER_OPTIONS = ["ชาย", "หญิง"];
const STATUS_OPTIONS = ["ผู้ป่วยเบาหวาน", "ผู้ใช้ทั่วไป"];
const DEFAULT_AVATAR_FILENAME = "koomwanAvatar01.png";
const DEFAULT_AVATAR = require("../../assets/Avatars/koomwanAvatar01.png");

interface UserUpdateData {
  email: string;
  phone: string;
  image?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    username: "",
    profileImage: "",
    height: "",
    birthDate: "",
    gender: GENDER_OPTIONS[0],
    status: STATUS_OPTIONS[0],
    email: "",
    phone: "",
  });

  // Date Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);

  // Image Picker
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [healthInfoId, setHealthInfoId] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  // Manage image delete state
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [markedForDeletion, setMarkedForDeletion] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Get authentication data from AsyncStorage
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/user/login");
        return;
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      const user = auth.user;
      const userId = user._id;
      const healthInfoId = user.healthinfo;

      console.log("User ID:", userId);
      console.log("Health Info ID:", healthInfoId);
      console.log("User data from auth:", user);

      if (!userId || !token) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/user/login");
        return;
      }

      // Set user ID and token
      setUserId(userId);
      setUserToken(token);

      // Basic user information
      const username = user.username || "";
      const email = user.email || "";
      const phone = user.phone || "";
      const profileImage = user.image || DEFAULT_AVATAR;

      // Save original image and check if using default
      setOriginalImage(profileImage);
      setIsDefaultImage(profileImage === DEFAULT_AVATAR);
      setMarkedForDeletion(false);

      // Default values for health info
      let height = "";
      let birthdate = "";
      let gender = "male";
      let diabetesType = "none";

      // Fetch health info if available
      if (healthInfoId) {
        setHealthInfoId(healthInfoId);

        try {
          console.log("Fetching health info...");
          const healthInfoResponse = await axios.get(
            `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Health info response:", healthInfoResponse.data);

          if (healthInfoResponse.data.success) {
            const healthInfo = healthInfoResponse.data.healthInfo;
            height = healthInfo.height ? String(healthInfo.height) : "";
            birthdate = healthInfo.birthdate || "";
            gender = healthInfo.gender || "male";
            diabetesType = healthInfo.diabetestype || "none";

            console.log("Retrieved health info:", {
              height,
              birthdate,
              gender,
              diabetesType,
            });
          }
        } catch (healthInfoError) {
          console.error("Error fetching health info:", healthInfoError);
        }
      }

      // Format birthdate
      const formattedBirthDate = birthdate
        ? formatDateFromISOString(birthdate)
        : "";

      // Map gender and diabetes type to UI values
      const uiGender = gender === "male" ? "ชาย" : "หญิง";
      const uiStatus =
        diabetesType === "diabetes" ? "ผู้ป่วยเบาหวาน" : "ผู้ใช้ทั่วไป";

      // Set form data
      setFormData({
        username,
        profileImage,
        height,
        birthDate: formattedBirthDate,
        gender: uiGender,
        status: uiStatus,
        email,
        phone,
      });

      console.log("Form data set:", {
        username,
        profileImage,
        height,
        birthDate: formattedBirthDate,
        gender: uiGender,
        status: uiStatus,
        email,
        phone,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await AsyncStorage.multiRemove(["@auth"]);
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
      } else {
        Alert.alert(
          "ข้อผิดพลาด",
          "ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date from MongoDB ISO string to DD/MM/YYYY+543 (Thai year)
  const formatDateFromISOString = (isoString: string) => {
    if (!isoString) return "";

    try {
      // MongoDB ISO date format: "1995-08-20T00:00:00.000+00:00"
      const date = new Date(isoString);

      // ตรวจสอบว่าวันที่ถูกต้องหรือไม่
      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", isoString);
        return "";
      }

      return formatDate(date);
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }
  };

  // Handle Date Selection
  const handleDateChange = (selectedDate: Date | undefined) => {
    console.log("handleDateChange called with:", selectedDate);

    if (selectedDate === undefined) {
      console.log("Date selection canceled or dismissed");
      setShowDatePicker(false);
      setTempDate(undefined);
      return;
    }

    // Set tempDate for both platforms
    setTempDate(selectedDate);

    if (Platform.OS === "android") {
      // Android จะอัพเดตค่าและปิด picker ทันที
      const formattedDate = formatDate(selectedDate);
      console.log("Android setting formatted date:", formattedDate);
      setFormData({ ...formData, birthDate: formattedDate });
      setShowDatePicker(false);
    } else {
      // iOS (compact mode) จะเก็บค่าที่เลือกไว้ใน tempDate และไม่ปิด picker
      // แต่จะอัพเดตค่าและปิด picker ทันทีสำหรับโหมด compact
      const formattedDate = formatDate(selectedDate);
      console.log("iOS setting formatted date:", formattedDate);
      setFormData({ ...formData, birthDate: formattedDate });
      setShowDatePicker(false);
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

  // Parse Thai date format (DD/MM/YYYY+543) to MongoDB ISO date for API
  const parseThaiDateToISO = (thaiDate: string): string => {
    if (!thaiDate) return "";

    try {
      const [day, month, thaiYear] = thaiDate.split("/");
      const year = parseInt(thaiYear) - 543; // Convert year

      // ตรวจสอบค่าที่แยกออกมา
      if (isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(year)) {
        console.error("Invalid date parts:", { day, month, thaiYear });
        return "";
      }

      // สร้างวันที่แบบ UTC เวลา 00:00:00 เพื่อให้ตรงกับรูปแบบ MongoDB
      const date = new Date(Date.UTC(year, parseInt(month) - 1, parseInt(day)));

      // ตรวจสอบว่าวันที่ถูกต้องหรือไม่
      if (isNaN(date.getTime())) {
        console.error("Invalid date created:", { day, month, year });
        return "";
      }

      return date.toISOString();
    } catch (error) {
      console.error("Error creating ISO date:", error);
      return "";
    }
  };

  // เลือกรูปภาพจากคลังรูปภาพ
  const pickImage = async () => {
    try {
      // ถ้ากำลังรอการลบรูปภาพอยู่ ให้ถามก่อนว่าต้องการยกเลิกการลบหรือไม่
      if (markedForDeletion) {
        Alert.alert(
          "ยกเลิกการลบรูปภาพ",
          "คุณได้เลือกที่จะลบรูปโปรไฟล์ไว้แล้ว คุณต้องการเลือกรูปใหม่แทนหรือไม่?",
          [
            {
              text: "ยกเลิก",
              style: "cancel",
            },
            {
              text: "เลือกรูปใหม่",
              onPress: async () => {
                // ยกเลิกการลบและเลือกรูปใหม่แทน
                setMarkedForDeletion(false);
                await selectNewImage();
              },
            },
          ]
        );
        return;
      }

      // เลือกรูปภาพตามปกติ
      await selectNewImage();
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
    }
  };

  // ฟังก์ชันสำหรับเลือกรูปภาพใหม่
  const selectNewImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      quality: 0.6,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];

      // แสดงรูปภาพที่เลือกในหน้าจอ (UI preview)
      setSelectedImage(selectedAsset.uri);

      // เก็บข้อมูลไฟล์รูปภาพไว้สำหรับการอัพโหลดเมื่อกดบันทึก
      setSelectedImageFile({
        uri: selectedAsset.uri,
        type: selectedAsset.mimeType || "image/jpeg",
        name: selectedAsset.uri.split("/").pop() || "profile.jpg",
      });

      // ไม่ใช่รูป default แล้ว
      setIsDefaultImage(false);
    }
  };

  // ทำเครื่องหมายลบรูปภาพ (เฉพาะ UI ชั่วคราว)
  const markProfileImageForDeletion = () => {
    // ถ้าเป็นรูป default อยู่แล้ว ไม่ต้องทำอะไร
    if (isDefaultImage) {
      return;
    }

    // ถ้ามีการเลือกรูปใหม่ไว้แล้ว ไม่ต้องแสดง dialog เพราะรูปเก่าจะถูกแทนที่อยู่แล้ว
    if (selectedImage) {
      return;
    }

    // แสดง confirmation dialog
    Alert.alert(
      "ลบรูปโปรไฟล์",
      "คุณต้องการลบรูปโปรไฟล์และใช้รูปเริ่มต้นหรือไม่?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบรูปภาพ",
          style: "destructive",
          onPress: () => {
            // ทำเครื่องหมายว่ารูปนี้จะถูกลบเมื่อกดบันทึก
            setMarkedForDeletion(true);

            // ปรับให้ UI แสดงรูป default ชั่วคราว
            setFormData({ ...formData, profileImage: DEFAULT_AVATAR_FILENAME });
            setIsDefaultImage(true);

            Alert.alert("ตั้งค่าสำเร็จ", "รูปภาพจะถูกลบเมื่อคุณกดปุ่มบันทึก");
          },
        },
      ]
    );
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      if (!userId || !userToken) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/user/login");
        return;
      }

      // ตรวจสอบความถูกต้องของข้อมูล
      if (!formData.height || isNaN(Number(formData.height))) {
        Alert.alert("ข้อผิดพลาด", "กรุณากรอกส่วนสูงเป็นตัวเลข");
        return;
      }

      // ตรวจสอบว่าส่วนสูงต้องเป็นเลข 3 หลัก
      if (formData.height.length !== 3) {
        Alert.alert("ข้อผิดพลาด", "กรุณากรอกส่วนสูงให้ถูกต้อง");
        return;
      }

      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        Alert.alert("ข้อผิดพลาด", "กรุณากรอกอีเมลให้ถูกต้อง");
        return;
      }

      if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
        Alert.alert("ข้อผิดพลาด", "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
        return;
      }

      setUpdating(true);

      // Prepare user data
      const userData: UserUpdateData = {
        email: formData.email,
        phone: formData.phone,
      };

      // Handle profile image changes
      if (selectedImageFile) {
        // กรณีที่มีการเลือกรูปภาพใหม่
        const result = await ProfileImageHandler.changeProfileImage(
          userId,
          selectedImageFile,
          userToken
        );

        if (result.success) {
          console.log(
            "Profile image updated successfully:",
            result.newImageFileName
          );
        } else {
          console.error("Failed to update profile image");
        }
      } else if (
        markedForDeletion &&
        originalImage &&
        originalImage !== DEFAULT_AVATAR_FILENAME
      ) {
        // กรณีที่มีการกดเครื่องหมายลบรูปภาพ (และมีรูปเดิมที่ไม่ใช่ default)
        console.log("Deleting profile image:", originalImage);

        try {
          // ลบรูปภาพเดิมจาก Cloudflare R2
          await ProfileImageHandler.deleteProfileImage(
            originalImage,
            userToken
          );

          // อัพเดทข้อมูลใน database ให้ใช้รูป default
          userData.image = DEFAULT_AVATAR_FILENAME;
        } catch (deleteError) {
          console.error("Error deleting profile image:", deleteError);
          Alert.alert(
            "เกิดข้อผิดพลาดในการลบรูปโปรไฟล์",
            "กรุณาลองใหม่อีกครั้ง"
          );
        }
      }

      console.log("Updating user data:", userData);

      // Update basic user data
      const userUpdateResponse = await axios.put(
        `${BASE_URL}/api/v1/user/update/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log("User update response:", userUpdateResponse.data);

      // Update health info if needed
      if (healthInfoId) {
        // Prepare health data
        const birthdate = parseThaiDateToISO(formData.birthDate);
        console.log("Sending birthdate to API:", birthdate);

        const healthData = {
          gender: formData.gender === "ชาย" ? "male" : "female",
          diabetestype:
            formData.status === "ผู้ป่วยเบาหวาน" ? "diabetes" : "none",
          height: parseFloat(formData.height),
          birthdate: birthdate,
        };

        console.log("Updating health info:", healthData);

        // Update health info
        const healthUpdateResponse = await axios.put(
          `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
          healthData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        console.log("Health info update response:", healthUpdateResponse.data);
      } else {
        // If no health info exists, create new
        const newHealthData = {
          userId: userId,
          gender: formData.gender === "ชาย" ? "male" : "female",
          diabetestype:
            formData.status === "ผู้ป่วยเบาหวาน" ? "diabetes" : "none",
          height: parseFloat(formData.height),
          birthdate: parseThaiDateToISO(formData.birthDate),
        };

        console.log("Creating new health info:", newHealthData);

        // Create new health info
        const healthCreateResponse = await axios.post(
          `${BASE_URL}/api/v1/user/beginnerSetup`,
          newHealthData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        console.log("Health info create response:", healthCreateResponse.data);

        if (healthCreateResponse.data.success) {
          setHealthInfoId(healthCreateResponse.data.healthInfoId);
        }
      }

      // Update data in AsyncStorage
      try {
        const authData = await AsyncStorage.getItem("@auth");
        if (authData) {
          const auth = JSON.parse(authData);

          // Update basic info
          auth.user.email = formData.email;
          auth.user.phone = formData.phone;

          // Update image if it was changed to default
          if (markedForDeletion) {
            auth.user.image = DEFAULT_AVATAR_FILENAME;
          }

          // Health info ID update
          if (healthInfoId) {
            if (!auth.user.healthinfo) {
              auth.user.healthinfo = healthInfoId;
            }
          }

          // Save back to AsyncStorage
          await AsyncStorage.setItem("@auth", JSON.stringify(auth));
        }
      } catch (storageError) {
        console.error("Error updating AsyncStorage:", storageError);
      }

      Alert.alert("สำเร็จ", "บันทึกข้อมูลสำเร็จ", [
        {
          text: "OK",
          onPress: () =>
            router.dismissTo({
              pathname: "/profile",
              params: { refresh: "true", timestamp: Date.now() },
            }),
        },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }

      Alert.alert(
        "ข้อผิดพลาด",
        "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

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

              {/* Profile Image Section with Edit and Delete buttons */}
              <View className="relative mb-4">
                {selectedImage ? (
                  // ถ้ามีการเลือกรูปภาพใหม่ ให้แสดงรูปภาพนั้น
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-[150px] h-[150px] rounded-full"
                  />
                ) : markedForDeletion ? (
                  // ถ้ามีการทำเครื่องหมายลบรูปภาพ ให้แสดงรูป default
                  <Image
                    source={DEFAULT_AVATAR}
                    className="w-[150px] h-[150px] rounded-full"
                  />
                ) : (
                  // กรณีอื่นๆ ใช้ ProfileImage Component
                  <ProfileImage
                    imageFileName={formData.profileImage}
                    size="large"
                    style={{ width: 150, height: 150 }}
                  />
                )}

                {/* Delete Image Button - Top Right (แสดงเฉพาะเมื่อไม่ใช่รูป default และไม่ได้มีการเลือกรูปใหม่) */}
                {!isDefaultImage && !markedForDeletion && (
                  <TouchableOpacity
                    className="absolute top-0 right-0"
                    onPress={markProfileImageForDeletion}
                    disabled={updating}
                  >
                    <Image
                      source={require("../../assets/BeginnerSetup/trash.png")}
                      className="w-10 h-10 bg-secondary rounded-full p-2"
                    />
                  </TouchableOpacity>
                )}

                {/* Edit Image Button - Bottom Right */}
                <TouchableOpacity
                  className="absolute bottom-0 right-0"
                  onPress={pickImage}
                  disabled={updating}
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
                  options={GENDER_OPTIONS}
                  onSelect={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                />

                {/* Status Dropdown */}
                <ProfileDropdown
                  icon={require("../../assets/Profile/heart.png")}
                  label="สถานะ"
                  value={formData.status}
                  options={STATUS_OPTIONS}
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
            className={`${
              updating ? "bg-gray" : "bg-primary"
            } mx-6 py-4 rounded-lg my-4`}
            onPress={handleSaveProfile}
            disabled={updating}
          >
            {updating ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white text-center font-bold text-button ml-2">
                  กำลังบันทึก...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-bold text-button">
                บันทึก
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
