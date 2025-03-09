import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

interface ImageUploaderWithPreviewProps {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  localImage: string | null;
  setLocalImage: (uri: string | null) => void;
  disabled?: boolean;
}

/**
 * Enhanced ImageUploader with file size limit and improved camera access
 */
const ImageUploaderWithPreview: React.FC<ImageUploaderWithPreviewProps> = ({
  imageUrl,
  setImageUrl,
  localImage,
  setLocalImage,
  disabled = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Maximum file size: 5MB in bytes
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Check if the image size is within limits
  const checkFileSize = async (uri: string): Promise<boolean> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (fileInfo.exists) {
        const { size } = fileInfo;

        if (size && size > MAX_FILE_SIZE) {
          Alert.alert(
            "ไฟล์มีขนาดใหญ่เกินไป",
            "ขนาดไฟล์ต้องไม่เกิน 5MB กรุณาเลือกไฟล์ใหม่หรือลดขนาดไฟล์"
          );
          return false;
        }

        return true;
      }

      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอ่านขนาดไฟล์ได้");
      return false;
    } catch (error) {
      console.error("Error checking file size:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถตรวจสอบขนาดไฟล์ได้");
      return false;
    }
  };

  const handleImageUpload = async (): Promise<void> => {
    try {
      // Request media library permissions
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

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Check file size
        const isValidSize = await checkFileSize(result.assets[0].uri);

        if (isValidSize) {
          // Store the local path for preview
          setLocalImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
    }
  };

  const handleTakePhoto = async (): Promise<void> => {
    try {
      setIsProcessing(true);

      // First check current camera permission status
      const cameraPermissionStatus =
        await ImagePicker.getCameraPermissionsAsync();

      // Only request permission if not already granted
      if (cameraPermissionStatus.status !== "granted") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "ต้องการการอนุญาต",
            "แอพต้องการการอนุญาตในการเข้าถึงกล้องของคุณ",
            [{ text: "ตกลง" }]
          );
          setIsProcessing(false);
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.5,
        cameraType: ImagePicker.CameraType.back,
        // Extra options to ensure camera works on all devices
        exif: false,
        presentationStyle:
          Platform.OS === "ios"
            ? ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN
            : undefined,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Check file size
        const isValidSize = await checkFileSize(result.assets[0].uri);

        if (isValidSize) {
          // Store the local path for preview
          setLocalImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถถ่ายรูปได้");
    } finally {
      setIsProcessing(false);
    }
  };

  const showImageOptions = (): void => {
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

  const handleRemoveImage = async (): Promise<void> => {
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
          onPress: () => {
            // Clear both local preview and server URL
            setLocalImage(null);
            setImageUrl(null);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  // Determine which image source to display
  const displayImageSource = localImage
    ? { uri: localImage }
    : imageUrl
    ? { uri: imageUrl }
    : null;

  return (
    <TouchableOpacity
      onPress={displayImageSource ? handleRemoveImage : showImageOptions}
      disabled={isProcessing || disabled}
      className="w-full h-[150px] bg-background rounded-lg items-center justify-center border border-gray relative"
    >
      {isProcessing ? (
        <View className="items-center">
          <ActivityIndicator size="large" color="#3972F0" />
          <Text className="text-description text-gray font-regular mt-2">
            กำลังดำเนินการ...
          </Text>
        </View>
      ) : displayImageSource ? (
        <>
          <Image
            source={displayImageSource}
            className="w-full h-full p-1"
            resizeMode="contain"
          />
          <View className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
            <Image
              source={require("../../assets/BeginnerSetup/trash.png")}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </View>
        </>
      ) : (
        <View className="items-center">
          <Image
            source={require("../../assets/BeginnerSetup/add-image.png")}
            className="w-16 h-16 mb-2"
            resizeMode="contain"
          />
          <Text className="text-description text-gray font-regular">
            เพิ่มรูปภาพ (ไม่เกิน 5MB)
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageUploaderWithPreview;
