import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Card from "../../../../global/components/Card";
import BackButton from "../../../../global/components/BackButton";
import BreakLine from "../../../../global/components/BreakLine";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../../config";
import Loading from "../../../../global/components/Loading";

interface Medication {
  _id: string;
  pillName: string;
  pillType: string;
  description: string;
  pillImage?: string;
  reminderTimes?: string[];
}

interface HealthInfo {
  _id: string;
  regularpill: Medication[];
}

export default function PillDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pillId = params.id || params.pill_id;

  const [loading, setLoading] = useState(true);
  const [pillDetails, setPillDetails] = useState<Medication | null>(null);
  const [errorShown, setErrorShown] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    fetchPillDetails();
  }, [pillId]);

  // Function to fetch signed URL for the pill image
  const fetchImageUrl = async (pillImagePath: string) => {
    try {
      setLoadingImage(true);

      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) return null;

      const auth = JSON.parse(authData);
      const token = auth.token;

      // Extract folder and filename from the path
      const pathParts = pillImagePath.split("/");
      if (pathParts.length < 2) return null;

      const fileName = pathParts.pop();
      const folder = pathParts.pop();

      if (!fileName || !folder) return null;

      // Request a signed URL from the server
      const response = await axios.get(
        `${BASE_URL}/api/v1/storage/getFileUrl`,
        {
          params: {
            fileName,
            folder,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.url) {
        console.log("Image URL fetched successfully:", response.data.url);
        return response.data.url;
      }

      return null;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    } finally {
      setLoadingImage(false);
    }
  };

  const fetchPillDetails = async () => {
    try {
      setLoading(true);

      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Get the healthInfoId from user profile
      const userResponse = await axios.get(
        `${BASE_URL}/api/v1/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data.success && userResponse.data.user.healthinfo) {
        const healthInfoId = userResponse.data.user.healthinfo._id;

        // Fetch health info to get regular medication list
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const healthInfo: HealthInfo = response.data.healthInfo;
          // Find the specific medication by ID
          const medication = healthInfo.regularpill.find(
            (med) => med._id === pillId
          );

          if (medication) {
            setPillDetails(medication);

            // If medication has an image, fetch the signed URL
            if (medication.pillImage) {
              const url = await fetchImageUrl(medication.pillImage);
              setImageUrl(url);
            }
          } else {
            console.error("ไม่พบข้อมูลยาที่ต้องการ");
            if (!errorShown) {
              Alert.alert("ขออภัย", "ไม่พบข้อมูลยาที่ต้องการ");
              setErrorShown(true);
            }
          }
        } else {
          console.error("ไม่สามารถดึงข้อมูลยาได้:", response.data);
          if (!errorShown) {
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลยาได้");
            setErrorShown(true);
          }
        }
      } else {
        console.error("ไม่พบข้อมูลสุขภาพของผู้ใช้:", userResponse.data);
        if (!errorShown) {
          Alert.alert("เกิดข้อผิดพลาด", "ไม่พบข้อมูลสุขภาพของผู้ใช้");
          setErrorShown(true);
        }
      }
    } catch (err) {
      console.error("Error fetching pill details:", err);
      if (!errorShown) {
        Alert.alert(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่อีกครั้ง"
        );
        setErrorShown(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Use fallback data if no pill details found
  const pillData = pillDetails || {
    _id: String(pillId),
    pillName: "ไม่พบข้อมูลยา",
    pillType: "-",
    description: "ไม่มีข้อมูลรายละเอียด",
    pillImage: undefined,
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackButton title="ย้อนกลับ" />

      <ScrollView className="flex-1 px-4">
        <Card>
          <Text className="flex-1 text-headline text-secondary font-bold text-center">
            ยาประจำ
          </Text>
          <BreakLine />

          {/* Pill Image */}
          <View className="w-full h-[150px] aspect-[2/1] bg-background rounded-lg items-center justify-center border border-gray">
            {loadingImage ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#3972F0" />
                <Text className="text-description text-gray font-regular mt-2">
                  กำลังโหลดรูปภาพ...
                </Text>
              </View>
            ) : imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-[150px] p-1"
                resizeMode="contain"
              />
            ) : (
              <View className="items-center">
                <Image
                  source={require("../../../../assets/BeginnerSetup/add-image.png")}
                  className="w-16 h-16 mb-2"
                  resizeMode="contain"
                />
                <Text className="text-description text-gray font-regular">
                  ไม่มีรูปภาพ
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
                {pillData.pillName}
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
                {pillData.pillType || "-"}
              </Text>
            </View>
          </View>

          {/* Pill Description */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              รายละเอียด
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular min-h-[96px]">
              <Text className="text-description text-secondary font-regular">
                {pillData.description || "ไม่มีข้อมูลรายละเอียด"}
              </Text>
            </View>
          </View>

          {/* Reminder Times */}
          {pillData.reminderTimes && pillData.reminderTimes.length > 0 && (
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                เวลาแจ้งเตือน
              </Text>
              <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular min-h-[48px] justify-center">
                <Text className="text-description text-secondary font-regular">
                  {pillData.reminderTimes
                    .map((time) => {
                      const formattedTime = time.includes("/")
                        ? time.replace("/", " เวลา ") + " น."
                        : time + " น.";
                      return formattedTime;
                    })
                    .join("\n")}
                </Text>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
