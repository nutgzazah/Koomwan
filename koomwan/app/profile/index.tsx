import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import BackButton from "../../global/components/BackButton";
import { useRouter } from "expo-router";
import Loading from "../../global/components/Loading";
import BASE_URL from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

interface HealthRecord {
  height: number;
  weight: number;
  bloodsugar: number;
  a1c: number;
  bloodpressure: {
    systolic: number;
    diastolic: number;
  };
  moodstatus: string;
  additionpill: Array<{
    pillName: string;
    pillImage?: string;
    pillType: string;
    description?: string;
    takePillTimes?: string[];
  }>;
  recordtime: string;
  _id: string;
}

interface UserData {
  _id: string;
  username: string;
  profileImage?: string;
  healthinfo: {
    height: number;
    weight: number;
    dateOfBirth: string;
    gender: string;
  };
}

interface ProfileData {
  profileImage: string;
  username: string;
  height: number;
  age: number;
  gender: string;
}

export default function IndexProfileScreen() {
  const router = useRouter();
  const { refresh, timestamp } = useLocalSearchParams();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [latestRecord, setLatestRecord] = useState<HealthRecord | null>(null);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Display TH gender
  const getGenderDisplay = (gender: string): string => {
    switch (gender.toLowerCase()) {
      case "male":
        return "ชาย";
      case "female":
        return "หญิง";
      default:
        return "-";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authData = await AsyncStorage.getItem("@auth");

        if (!authData) {
          Alert.alert("Session Expired ", "Please login again");
          router.push("/user/login");
          return;
        }

        const auth = JSON.parse(authData);
        const token = auth.token;
        const userId = auth.user._id;
        const healthInfoId = auth.user.healthinfo;

        console.log("Health Info ID:", healthInfoId);

        if (!userId || !token) {
          Alert.alert("Session Expired 2", "Please login again");
          router.push("/user/login");
          return;
        }

        const basicUserData = {
          _id: auth.user._id,
          username: auth.user.username,
          profileImage: auth.user.image,
        };

        // Default values
        let height = 0;
        let birthdate = new Date().toISOString();
        let gender = "-";

        // Fetch health info using the API endpoint
        if (healthInfoId) {
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

            console.log(
              "Health info response:",
              healthInfoResponse.data.success
            );

            if (healthInfoResponse.data.success) {
              const healthInfo = healthInfoResponse.data.healthInfo;
              height = healthInfo.height || 0;
              birthdate = healthInfo.birthdate || new Date().toISOString();
              gender = healthInfo.gender || "-";
              console.log("Using health info from API:", { height, gender });
            }
          } catch (healthInfoError) {
            console.error("Error fetching health info:", healthInfoError);
          }
        }

        //fetch records for latest data
        try {
          const recordsResponse = await axios.get(
            `${BASE_URL}/api/v1/user/getRecord/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (
            recordsResponse.data.success &&
            recordsResponse.data.records.length > 0
          ) {
            const recordsData = recordsResponse.data.records;
            const latestRec = recordsData.sort(
              (a: HealthRecord, b: HealthRecord) =>
                new Date(b.recordtime).getTime() -
                new Date(a.recordtime).getTime()
            )[0];

            setRecords(recordsData);
            setLatestRecord(latestRec);
          }
        } catch (recordsError) {
          console.error("Error fetching records:", recordsError);
        }

        // Calculate age from birthdate
        const age = calculateAge(birthdate);
        console.log("Calculated age:", age);

        const formattedData = {
          profileImage: basicUserData.profileImage
            ? `${BASE_URL}/uploads/${basicUserData.profileImage}`
            : "koomwan/assets/koomwan-profile.png",
          username: basicUserData.username,
          height: height,
          age: age,
          gender: getGenderDisplay(gender),
        };

        console.log("Final profile data:", formattedData);
        setProfileData(formattedData);
      } catch (error) {
        console.error("Error fetching profile data:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await AsyncStorage.multiRemove(["userId", "token", "@auth"]);
          Alert.alert("Session Expired 3", "Please login again", [
            { text: "OK", onPress: () => router.push("/user/login") },
          ]);
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later.",
            [{ text: "OK", onPress: () => router.back() }]
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timestamp]);

  if (loading || !profileData) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="ย้อนกลับ" />

        {/* Profile Card */}
        <Card>
          {/* Header */}
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">
              โปรไฟล์ของฉัน
            </Text>
            <BreakLine />

            {/* Profile Image with Edit Button */}
            <View className="relative">
              <Image
                source={{ uri: profileData.profileImage }}
                className="w-[150px] h-[150px] rounded-full"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0"
                onPress={() => router.push("/profile/editProfile")}
              >
                <Image
                  source={require("../../assets/Profile/edit.png")}
                  className="w-12 h-12"
                />
              </TouchableOpacity>
            </View>

            {/* Username */}
            <View className="flex-row items-center mt-4">
              <Image
                source={require("../../assets/Profile/user.png")}
                className="w-6 h-6"
              />
              <Text className="text-headline font-bold text-secondary pl-2">
                {profileData.username}
              </Text>
            </View>

            <BreakLine />

            {/* User Stats */}
            <View className="flex-row items-center p-4 justify-between bg-background w-full h-16 rounded-lg">
              {/* Height */}
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Profile/ruler-pen.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary ml-2 font-regular">
                  {profileData.height} ซม.
                </Text>
              </View>

              {/* Age */}
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Profile/cake.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary ml-2 font-regular">
                  {profileData.age} ปี
                </Text>
              </View>

              {/* Gender */}
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Profile/sex.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary ml-2 font-regular">
                  {profileData.gender}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View className="w-full">
          {/* User Account Info */}
          <Card>
            <TouchableOpacity
              className="flex-row items-center py-1 px-2 mt-2"
              onPress={() => router.push("/profile/userProfile")}
            >
              <Text className="text-description text-secondary flex-1 font-bold">
                ข้อมูลบัญชีผู้ใช้งาน
              </Text>
              <Image
                source={require("../../assets/Profile/profile-circle.png")}
                className="w-7 h-7"
              />
            </TouchableOpacity>
          </Card>

          {/* Settings */}
          <Card>
            <TouchableOpacity
              className="flex-row items-center py-1 px-2 mt-2"
              onPress={() => router.push("/profile/(setting)")}
            >
              <Text className="text-description text-secondary flex-1 font-bold">
                การตั้งค่า
              </Text>
              <Image
                source={require("../../assets/Profile/setting.png")}
                className="w-7 h-7"
              />
            </TouchableOpacity>
          </Card>

          {/* Update Medicine */}
          <Card>
            <TouchableOpacity
              className="flex-row items-center py-1 px-2 mt-2"
              onPress={() => router.push("/profile/(med)")}
            >
              <Text className="text-description text-secondary flex-1 font-bold">
                อัพเดทข้อมูลยาประจำ
              </Text>
              <Image
                source={require("../../assets/Profile/edit-2.png")}
                className="w-7 h-7"
              />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
