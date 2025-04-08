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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../config";

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

  // Function to extract folder and filename from image path
  const extractFolderAndFilename = (
    path: string
  ): { folder: string; fileName: string } | null => {
    try {
      // Skip for local file paths
      if (path.startsWith("file://")) {
        return null;
      }

      // Handle signed URLs from Cloudflare
      if (path.includes("cloudflarestorage.com")) {
        // Extract path part before query string
        const pathWithoutQuery = path.split("?")[0];

        // Find the part after the .com/
        const afterDomain = pathWithoutQuery.split(".com/")[1];
        if (afterDomain) {
          const parts = afterDomain.split("/");
          if (parts.length >= 2) {
            const fileName = parts[parts.length - 1];
            const folder = parts[parts.length - 2];
            return { folder, fileName };
          }
        }
      }

      // If it's a full URL from server
      if (path.includes(`${BASE_URL}/uploads/`)) {
        const parts = path.split("/");
        const fileName = parts.pop() || "";
        return { folder: "uploads", fileName };
      }

      // If it's a path with folder/filename format
      if (path.includes("/")) {
        const parts = path.split("/");
        const fileName = parts.pop() || "";
        const folder = parts.pop() || "pill-images";
        return { folder, fileName };
      }

      // If it's just a filename
      if (!path.includes("/")) {
        return { folder: "pill-images", fileName: path };
      }

      return null;
    } catch (error) {
      console.error("Error extracting folder and filename:", error);
      return null;
    }
  };

  // Function to delete image from server
  const deleteImageFromServer = async (imagePath: string): Promise<boolean> => {
    try {
      setIsProcessing(true);

      // Skip if it's a local path
      if (imagePath.startsWith("file://")) {
        return true;
      }

      // Get auth token
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        console.error("No auth data found");
        return false;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;

      // Extract folder and filename
      const pathInfo = extractFolderAndFilename(imagePath);
      if (!pathInfo) {
        console.error(
          "Could not extract folder and filename from path:",
          imagePath
        );
        return false;
      }

      // Delete the image file
      const response = await axios.delete(
        `${BASE_URL}/api/v1/storage/deleteFile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            folder: pathInfo.folder,
            fileName: pathInfo.fileName,
          },
        }
      );

      if (response.status === 200) {
        console.log(
          `Successfully deleted image: ${pathInfo.fileName} from ${pathInfo.folder}`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting image from server:", error);
      return false;
    } finally {
      setIsProcessing(false);
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
          onPress: async () => {
            setIsProcessing(true);
            try {
              // Check if there's an uploaded image to delete from server
              if (imageUrl && !imageUrl.startsWith("file://")) {
                // Try to delete the image from server
                const deleted = await deleteImageFromServer(imageUrl);
                if (!deleted) {
                  console.warn("Failed to delete image from server:", imageUrl);
                  // Continue anyway even if server deletion fails
                }
              }

              // Clear both local preview and server URL
              setLocalImage(null);
              setImageUrl(null);
            } catch (error) {
              console.error("Error in handleRemoveImage:", error);
              // Still clear the images locally even if server deletion fails
              setLocalImage(null);
              setImageUrl(null);
            } finally {
              setIsProcessing(false);
            }
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
