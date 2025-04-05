import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import BreakLine from "../../../global/components/BreakLine";
import Loading from "../../../global/components/Loading";
import BASE_URL from "../../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AdditionalPill = {
  pill_id: string;
  pill_name: string;
  pill_type: string;
  description: string;
  pill_image?: string | null;
};

export default function MedicationDetail() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pillData, setPillData] = useState<AdditionalPill | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Extract parameters from route
  const id = params.id as string;
  const pill_name = Array.isArray(params.pill_name)
    ? params.pill_name[0]
    : params.pill_name || (params.name as string);
  const pill_type = params.pill_type || (params.type as string);
  const description = params.description || (params.details as string);
  const pill_image = params.pill_image || (params.image as string);

  useEffect(() => {
    try {
      // Instead of fetching, use the params
      if (id) {
        const pill: AdditionalPill = {
          pill_id: id,
          pill_name: pill_name || "ไม่มีชื่อยา",
          pill_type: Array.isArray(pill_type)
            ? pill_type[0]
            : pill_type || "ไม่ระบุประเภท",
          description: Array.isArray(description)
            ? description[0]
            : description || "ไม่มีรายละเอียด",
          pill_image: Array.isArray(pill_image)
            ? pill_image[0]
            : pill_image || null,
        };

        setPillData(pill);

        // If there's an image path, try to get the signed URL for it
        if (pill.pill_image) {
          loadImageUrl(pill.pill_image);
        }
      } else {
        setError("ไม่พบข้อมูล ID ยา");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error loading medication data:", err);
    } finally {
      setLoading(false);
    }
  }, [id, pill_name, pill_type, description, pill_image]);

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

  if (loading) {
    return <Loading />;
  }

  if (error || !pillData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <BackButton title="ย้อนกลับ" />
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../../assets/Home/none.png")}
            className="w-16 h-16 mb-4"
          />
          <Text className="text-description text-secondary font-regular">
            {error || "ไม่พบข้อมูลยา"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackButton title="ข้อมูลยา" />

      <ScrollView className="flex-1 px-4">
        <Card>
          <Text className="flex-1 text-headline text-secondary font-bold text-center">
            ยาเพิ่มเติม
          </Text>
          <BreakLine />

          {/* Pill Image */}
          <View className="w-full h-40 bg-background rounded-lg items-center justify-center border border-gray overflow-hidden">
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
                className="w-full h-full p-1"
                resizeMode="contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <View className="items-center">
                <Image
                  source={require("../../../assets/BeginnerSetup/add-image.png")}
                  className="w-16 h-16 mb-2"
                  resizeMode="contain"
                />
                <Text className="text-description text-gray font-regular">
                  {imageError ? "ไม่สามารถโหลดรูปภาพได้" : "ไม่มีรูปภาพ"}
                </Text>
              </View>
            )}
          </View>

          {/* Pill Name */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              ชื่อยา
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular h-12 justify-center">
              <Text className="text-description font-regular text-secondary">
                {pillData.pill_name}
              </Text>
            </View>
          </View>

          {/* Pill Type */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              ประเภท
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular h-12 justify-center">
              <Text className="text-description text-secondary font-regular">
                {pillData.pill_type}
              </Text>
            </View>
          </View>

          {/* Pill Description */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              รายละเอียด
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular min-h-24">
              <Text className="text-description text-secondary font-regular">
                {pillData.description || "ไม่มีรายละเอียด"}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
