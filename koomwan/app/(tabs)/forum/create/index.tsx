import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useContext, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";
import { AuthContext } from "../../../../context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import BASE_URL from "../../../../config";
import axios from "axios";

const MAX_LENGTH = 500; // กำหนดความยาวสูงสุดของข้อความโพสต์

const defaultUserAvatar01 = require("../../../../assets/Avatars/koomwanAvatar01.png");
const defaultUserAvatar02 = require("../../../../assets/Avatars/koomwanAvatar02.png");
const defaultUserAvatar03 = require("../../../../assets/Avatars/koomwanAvatar03.png");
const defaultUserAvatar04 = require("../../../../assets/Avatars/koomwanAvatar04.png");
const defaultDoctorAvatar01 = require("../../../../assets/Avatars/koomwanDoctorAvatar01.png");
const defaultDoctorAvatar02 = require("../../../../assets/Avatars/koomwanDoctorAvatar02.png");

export default function ForumScreen() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null); // สำหรับเก็บไฟล์รูปภาพที่เลือก
  const [title, setTitle] = useState(""); // เก็บค่าหัวข้อโพสต์
  const [isLoading, setIsLoading] = useState(false); // ควบคุม Loading Modal
  const [state] = useContext(AuthContext);
  const router = useRouter();

  const remainingChars = MAX_LENGTH - title.length;
  const charColor =
    remainingChars > 50
      ? "text-primary"
      : remainingChars > 10
      ? "text-warning"
      : "text-abnormal";

  useEffect(() => {
    if (!state?.user?.image) return; // ป้องกัน state.user.image เป็น null หรือ undefined

    console.log("State User Role:", state?.user.role);
    console.log("State User Image:", state?.user.image);

    if (state?.user.image.startsWith("koomwanAvatar")) {
      setProfileImageUrl(
        state.user.image === "koomwanAvatar01.png"
          ? defaultUserAvatar01
          : state.user.image === "koomwanAvatar02.png"
          ? defaultUserAvatar02
          : state.user.image === "koomwanAvatar03.png"
          ? defaultUserAvatar03
          : state.user.image === "koomwanAvatar04.png"
          ? defaultUserAvatar04
          : defaultUserAvatar01
      );
    } else if (state?.user.image.startsWith("koomwanDoctorAvatar")) {
      setProfileImageUrl(
        state.user.image === "koomwanDoctorAvatar01.png"
          ? defaultDoctorAvatar01
          : state.user.image === "koomwanDoctorAvatar02.png"
          ? defaultDoctorAvatar02
          : defaultDoctorAvatar01
      );
    } else if (state?.user.role === "doctor") {
      console.log("Fetching doctor image...");
      getImageUrl(state.user.image)
        .then((url) => {
          console.log("Doctor Image URL:", url);
          setProfileImageUrl(url);
        })
        .catch((error) => {
          console.error("Error fetching doctor image:", error);
        });
    } else if (state?.user.role === "user") {
      console.log("Fetching user image...");
      getProfileImageUrl(state.user.image, "user")
        .then((url) => {
          console.log("User Image URL:", url);
          setProfileImageUrl(url);
        })
        .catch((error) => {
          console.error("Error fetching user image:", error);
        });
    }
  }, [state?.user.image]);

  // ฟังก์ชันดึง URL ของไฟล์จาก path
  const getImageUrl = async (path: string): Promise<string | null> => {
    try {
      const res = await axios.get<{ url: string }>(
        `${BASE_URL}/api/v1/storage/getFileUrlFromPath`,
        { params: { path } }
      );
      return res.data.url;
    } catch (error) {
      console.error(`Error fetching image for path ${path}:`, error);
      return null;
    }
  };

  const getProfileImageUrl = async (
    fileName: string,
    folder: string
  ): Promise<string | null> => {
    try {
      const res = await axios.get<{ url: string }>(
        `${BASE_URL}/api/v1/storage/getFileUrl`,
        { params: { fileName, folder } }
      );
      return res.data.url;
    } catch (error) {
      console.error(
        `Error fetching image for path ${folder}/${fileName}:`,
        error
      );
      return null;
    }
  };

  const handlePost = async () => {
    const sanitizedTitle = title.replace(/\n/g, " "); // ลบ newline ออก

    if (sanitizedTitle.trim() === "") {
      Alert.alert("กรุณากรอกหัวข้อโพสต์");
      return;
    }

    if (sanitizedTitle.length > MAX_LENGTH) {
      Alert.alert("ข้อความโพสต์ต้องไม่เกิน 300 อักขระ");
      return;
    }

    setIsLoading(true); // แสดง Loading Modal

    const formData = new FormData();
    formData.append("title", sanitizedTitle);

    if (selectedImageFile) {
      // แก้ไขการเพิ่มไฟล์ลงใน FormData เพื่อความเข้ากันได้กับทั้ง Android และ iOS
      const fileUri = selectedImageFile.uri;
      const fileName = fileUri.split("/").pop() || "image.jpg";
      const fileType = selectedImageFile.type || "image/jpeg";

      // ขั้นตอนสำคัญ: ต้องใช้ชื่อฟิลด์ 'image' ให้ตรงกับที่เซิร์ฟเวอร์คาดหวัง
      formData.append("image", {
        uri:
          Platform.OS === "android" ? fileUri : fileUri.replace("file://", ""),
        name: fileName,
        type: fileType,
      });
    }

    try {
      // กำหนด header ชัดเจนเพื่อให้แน่ใจว่า content-type ถูกต้อง
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/forum/createPost`,
        formData,
        config
      );

      if (response.status === 201) {
        Alert.alert("โพสต์สำเร็จ!");
        setTitle(""); // ล้างค่าหัวข้อ
        setSelectedImageFile(null); // ล้างค่ารูป (ถ้ามี)
        setSelectedImage(null); // ล้างรูปที่แสดง
        router.back(); // กลับไปที่หน้าก่อนหน้า
      } else {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโพสต์ได้");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // แสดงข้อมูลข้อผิดพลาดที่ละเอียดขึ้น
      if (axios.isAxiosError(error) && error.response) {
        // ข้อผิดพลาดจากการตอบกลับของเซิร์ฟเวอร์
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
        Alert.alert(
          "เกิดข้อผิดพลาด",
          `รหัสข้อผิดพลาด: ${error.response.status}`
        );
      } else if (axios.isAxiosError(error) && error.request) {
        // ข้อผิดพลาดจากการไม่ได้รับการตอบกลับ
        console.error("No response received:", error.request);
        Alert.alert("เกิดข้อผิดพลาด", "ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์");
      } else {
        // ข้อผิดพลาดอื่นๆ
        Alert.alert("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false); // ปิด Loading Modal
    }
  };

  // เลือกรูปภาพจากคลังรูปภาพ
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
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
        <BackButton title="ย้อนกลับ" />
        <Card>
          <View className="flex flex-row w-full mx-4 items-start">
            <Image
              className="w-12 h-12 mr-6 self-start rounded-full"
              source={
                state?.user.image.startsWith("koomwanAvatar")
                  ? state.user.image === "koomwanAvatar01.png"
                    ? defaultUserAvatar01
                    : state.user.image === "koomwanAvatar02.png"
                    ? defaultUserAvatar02
                    : state.user.image === "koomwanAvatar03.png"
                    ? defaultUserAvatar03
                    : state.user.image === "koomwanAvatar04.png"
                    ? defaultUserAvatar04
                    : defaultUserAvatar01 // fallback หากไม่ตรงกับที่กำหนด
                  : state?.user.image.startsWith("koomwanDoctorAvatar")
                  ? state.user.image === "koomwanDoctorAvatar01.png"
                    ? defaultDoctorAvatar01
                    : state.user.image === "koomwanDoctorAvatar02.png"
                    ? defaultDoctorAvatar02
                    : defaultDoctorAvatar01 // fallback หากไม่ตรงกับที่กำหนด
                  : state?.user.role === "doctor"
                  ? { uri: profileImageUrl }
                  : { uri: profileImageUrl } // ใช้ getProfileImageUrl หากเป็น user
              }
            />
            <TextInput
              className="font-sans text-body text-secondary mr-3 items-start flex-shrink"
              placeholder="คุณกำลังมีข้อสงสัยอะไรอยู่..."
              value={title}
              onChangeText={(text) => {
                if (text.length <= MAX_LENGTH) {
                  setTitle(text.replace(/\n/g, " "));
                }
              }}
              multiline
            />
          </View>
          <Text
            className={`w-full right-0 mt-2 pr-4 font-sans text-tag text-right ${charColor}`}
          >
            เหลือ {remainingChars} อักขระ
          </Text>
          {selectedImage && (
            <Image
              className="w-full h-[18.75rem] mt-6 rounded-2xl"
              source={{ uri: selectedImage }}
            />
          )}
          <BreakLine />
          <View className="flex flex-row w-full mx-4 justify-between items-center">
            <UploadImageButton />
            <PostButton />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );

  function UploadImageButton() {
    return (
      <Pressable className="w-6 h-6 ml-4" onPress={pickImage}>
        <Image
          className="w-6 h-6"
          source={require("../../../../assets/Forum/gallery.png")}
        />
      </Pressable>
    );
  }

  function PostButton() {
    return (
      <>
        <Pressable onPress={handlePost} disabled={isLoading}>
          <View className="flex flex-row bg-primary w-fit h-fit rounded-full justify-evenly items-center px-6 py-2 mr-2">
            <Text className="font-sans text-description text-center text-card">
              โพสต์
            </Text>
            <Image
              className="ml-2 w-4 h-4"
              source={require("../../../../assets/Forum/Pen-white.png")}
            />
          </View>
        </Pressable>

        <Modal transparent visible={isLoading}>
          <View
            className="flex-1 justify-center items-center "
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <View className="bg-white p-6 rounded-lg">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="mt-2">กำลังโพสต์...</Text>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}
