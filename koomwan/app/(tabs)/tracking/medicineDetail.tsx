import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import InputFieldOne from "./components/InputFieldOne";
import InputFieldLong from "./components/InputFieldLong";
import BASE_URL from "../../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MedicineDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract parameters from navigation
  const [medicineName, setMedicineName] = useState(
    (params.name as string) || "ไม่ระบุชื่อยา"
  );
  const [medicineType, setMedicineType] = useState(
    (params.type as string) || "ไม่ระบุประเภท"
  );
  const [medicineDetails, setMedicineDetails] = useState(
    (params.details as string) || ""
  );
  const [isRegularMed, setIsRegularMed] = useState(params.isRegular === "true");

  // Image states
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Function to extract folder and filename from different path formats
  const extractFolderAndFilename = (
    path: string
  ): { folder: string; fileName: string } | null => {
    // If it's a full URL (from local server)
    if (path.includes(`${BASE_URL}/uploads/`)) {
      const parts = path.split("/");
      const fileName = parts.pop() || "";
      return { folder: "uploads", fileName };
    }

    // If it's a path with folder/filename format
    if (path.includes("/") && !path.startsWith("file://")) {
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
  };

  // Function to fetch a signed URL for the image
  const fetchImageUrl = async (imagePath: string) => {
    try {
      // Skip for local file paths
      if (imagePath.startsWith("file://")) {
        return imagePath;
      }

      // Skip for external URLs
      if (imagePath.startsWith("http") && !imagePath.includes(BASE_URL)) {
        return imagePath;
      }

      setImageLoading(true);

      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) return null;

      const auth = JSON.parse(authData);
      const token = auth.token;

      // Extract folder and filename
      const pathInfo = extractFolderAndFilename(imagePath);
      if (!pathInfo) return imagePath;

      // Request a signed URL from the server
      const response = await axios.get(
        `${BASE_URL}/api/v1/storage/getFileUrl`,
        {
          params: {
            fileName: pathInfo.fileName,
            folder: pathInfo.folder,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.url) {
        console.log("Image URL fetched successfully");
        return response.data.url;
      }

      return null;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  // Function to load the image URL based on the path
  const loadImageUrl = async (imagePath: string) => {
    try {
      setImageLoading(true);

      // If it's a local path (starts with file://), use it directly
      if (imagePath.startsWith("file://")) {
        setImageUrl(imagePath);
        return;
      }

      // For all other paths, try to get a signed URL
      const url = await fetchImageUrl(imagePath);
      if (url) {
        setImageUrl(url);
      } else {
        setImageError(true);
      }
    } catch (error) {
      console.error("Error loading image URL:", error);
      setImageError(true);
    } finally {
      setImageLoading(false);
    }
  };

  // Load image when component mounts
  useEffect(() => {
    if (params.image) {
      loadImageUrl(params.image as string);
    } else {
      setImageError(true);
    }
  }, [params.image]);

  // Handle edit button press
  const handleEditPress = () => {
    if (!isRegularMed) {
      router.push({
        pathname: "./addMedicine",
        params: {
          id: params.id,
          name: medicineName,
          type: medicineType,
          details: medicineDetails,
          image: params.image,
          isEdit: "true",
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackButton title="ย้อนกลับ" />
      <ScrollView className="mb-24">
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2">
            ยาเพิ่มเติม
          </Text>
          <BreakLine />

          {/* Medicine Image */}
          <View className="w-full h-60 bg-background rounded-lg items-center justify-center border border-gray overflow-hidden mb-4">
            {imageLoading ? (
              <View className="items-center justify-center">
                <ActivityIndicator size="large" color="#3972F0" />
                <Text className="text-description text-gray font-regular mt-2">
                  กำลังโหลดรูปภาพ...
                </Text>
              </View>
            ) : imageUrl && !imageError ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: "90%", height: "90%" }}
                resizeMode="contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <View className="items-center">
                <Image
                  source={require("../../../assets/Tracking/Medicine.png")}
                  className="w-16 h-16 mb-2"
                  resizeMode="contain"
                />
                <Text className="text-description text-gray font-regular">
                  {imageError ? "ไม่สามารถโหลดรูปภาพได้" : "ไม่มีรูปภาพ"}
                </Text>
              </View>
            )}
          </View>

          {/* Medicine Details */}
          <InputFieldOne
            label="ชื่อยา"
            value={medicineName}
            placeholder="ชื่อยา"
            editable={false}
            onChangeText={setMedicineName}
          />

          <InputFieldOne
            label="ประเภท"
            value={medicineType}
            placeholder="ประเภทยา"
            editable={false}
            onChangeText={setMedicineType}
          />

          <InputFieldLong
            label="รายละเอียด"
            value={medicineDetails}
            placeholder="รายละเอียดยา"
            editable={false}
            onChangeText={setMedicineDetails}
          />

          {/* Edit button for additional medicines only */}
          {/* {!isRegularMed && (
            <TouchableOpacity
              className="bg-primary rounded-[10px] py-4 px-8 mt-6"
              onPress={handleEditPress}
            >
              <Text className="font-sans text-button font-bold text-card text-center">
                แก้ไขข้อมูลยา
              </Text>
            </TouchableOpacity>
          )} */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
