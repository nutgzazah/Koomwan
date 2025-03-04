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
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import BackButton from "../../global/components/BackButton";
import { useRouter } from "expo-router";
import Loading from "../../global/components/Loading";
import BASE_URL from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// InfoRow component สำหรับแสดงข้อมูลแต่ละแถว
interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
  isButton?: boolean;
  onPress?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  isButton = false,
  onPress,
}) => (
  <View className="flex-row items-center justify-between mb-4">
    <View className="flex-row items-center">
      <Image source={icon} className="w-6 h-6" />
      <Text className="text-description text-secondary ml-2 font-regular">
        {label}
      </Text>
    </View>
    {isButton ? (
      <TouchableOpacity
        className="bg-primary px-4 py-1 rounded"
        onPress={onPress}
      >
        <Text className="font-regular text-tag text-white">{value}</Text>
      </TouchableOpacity>
    ) : (
      <Text className="text-description text-secondary font-regular">
        {value}
      </Text>
    )}
  </View>
);

interface ProfileData {
  profileImage: string;
  username: string;
  height: number;
  birthdate: string;
  age: number;
  gender: string;
  status: string;
  email: string;
  phone: string;
  role: string;
}

export default function UserProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Format date to DD/MM/YYYY (พ.ศ.)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear() + 543}`;
  };

  // TH gender
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
          Alert.alert("Session Expired", "Please login again");
          router.push("/user/login");
          return;
        }

        let auth;
        try {
          auth = JSON.parse(authData);
        } catch (error) {
          Alert.alert("Session Expired", "Please login again");
          router.push("/user/login");
          return;
        }
        const token = auth.token;
        const userId = auth.user._id;
        const healthInfoId = auth.user.healthinfo;

        if (!userId || !token) {
          Alert.alert("Session Expired", "Please login again");
          router.push("/user/login");
          return;
        }

        const basicUserData = {
          _id: auth.user._id,
          username: auth.user.username,
          profileImage: auth.user.image,
          email: auth.user.email || "",
          phone: auth.user.phone || "",
        };

        // Default values
        let height = 0;
        let birthdate = new Date().toISOString();
        let gender = "-";
        let status = "ผู้ใช้ทั่วไป";
        /* let userRole = auth.user.role || "user"; */

        // Fetch health info using the API endpoint
        if (healthInfoId) {
          try {
            const healthInfoResponse = await axios.get(
              `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (healthInfoResponse.data.success) {
              const healthInfo = healthInfoResponse.data.healthInfo;
              height = healthInfo.height || 0;
              birthdate = healthInfo.birthdate || new Date().toISOString();
              gender = healthInfo.gender || "-";

              // Check diabetes type to determine status
              if (healthInfo.diabetestype === "diabetes") {
                status = "ผู้ป่วยเบาหวาน";
              } else if (healthInfo.diabetestype === "none") {
                status = "ผู้ใช้ทั่วไป";
              }
            }
          } catch (healthInfoError) {
            if (axios.isAxiosError(healthInfoError)) {
              if (healthInfoError.response?.status === 404) {
                Alert.alert("Error", "Health information not found.", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              } else {
                Alert.alert("Error", "Failed to fetch health information.", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              }
            } else {
              console.error("Error fetching health info:", healthInfoError);
              Alert.alert("Error", "An unexpected error occurred.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            }
          }
        }

        // Calculate age from birthdate
        const age = calculateAge(birthdate);
        const formattedBirthdate = formatDate(birthdate);

        const formattedData = {
          profileImage: basicUserData.profileImage
            ? `${BASE_URL}/uploads/${basicUserData.profileImage}`
            : `${BASE_URL}/uploads/koomwanAvatar01.png`,
          username: basicUserData.username,
          height: height,
          birthdate: formattedBirthdate,
          age: age,
          gender: getGenderDisplay(gender),
          status: status,
          email: basicUserData.email,
          phone: basicUserData.phone,
          role: status,
        };

        setProfileData(formattedData);
      } catch (error) {
        console.error("Error fetching profile data:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await AsyncStorage.multiRemove(["userId", "token", "@auth"]);
          Alert.alert("Session Expired", "Please login again", [
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
  }, []);

  if (loading || !profileData) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="ข้อมูลบัญชีผู้ใช้งาน" />

        <Card>
          <View className="flex-col items-center w-full mb-2">
            <Text className="text-title font-bold text-secondary">
              โปรไฟล์ของฉัน
            </Text>
            <BreakLine />

            {/* Profile Image */}
            <View className="relative mb-4">
              <Image
                source={{ uri: profileData.profileImage }}
                className="w-36 h-36 rounded-full"
                resizeMode="contain"
              />
            </View>

            {/* Username */}
            <View className="flex-row items-center mb-4">
              <Image
                source={require("../../assets/Profile/user.png")}
                className="w-6 h-6"
              />
              <Text className="text-headline font-bold text-secondary pl-2">
                {profileData.username}
              </Text>
            </View>

            <BreakLine />

            {/* User Info List */}
            <View className="w-full space-y-6 py-2">
              <InfoRow
                icon={require("../../assets/Profile/ruler-pen.png")}
                label="ส่วนสูง"
                value={`${profileData.height} ซม.`}
              />

              <InfoRow
                icon={require("../../assets/Profile/cake.png")}
                label="วันเกิด"
                value={profileData.birthdate}
              />

              <InfoRow
                icon={require("../../assets/Profile/sex.png")}
                label="เพศ"
                value={profileData.gender}
              />

              <InfoRow
                icon={require("../../assets/Profile/heart.png")}
                label="สถานะ"
                value={profileData.role}
              />

              <InfoRow
                icon={require("../../assets/Profile/email.png")}
                label="อีเมล"
                value={profileData.email || "เพิ่มอีเมล"}
                isButton={!profileData.email}
                onPress={() => router.push("/profile/editProfile")}
              />

              <InfoRow
                icon={require("../../assets/Profile/phone.png")}
                label="เบอร์โทรศัพท์"
                value={profileData.phone || "-"}
              />
            </View>
          </View>
        </Card>

        {/* Edit Profile Button */}
        <TouchableOpacity
          className="bg-primary mx-6 py-4 rounded-lg my-4"
          onPress={() => router.push("/profile/editProfile")}
        >
          <Text className="text-card text-center font-bold text-button">
            แก้ไขโปรไฟล์
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
