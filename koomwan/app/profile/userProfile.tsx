import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import BackButton from "../../global/components/BackButton";
import { router, useRouter } from "expo-router";
import axios from "axios";

// InfoRow component สำหรับแสดงข้อมูลแต่ละแถว
interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
  isButton?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  isButton = false,
}) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center">
      <Image source={icon} className="w-6 h-6" />
      <Text className="text-description text-secondary ml-2 font-regular">
        {label}
      </Text>
    </View>
    {isButton ? (
      <TouchableOpacity
        className="bg-primary px-4 py-1 rounded"
        onPress={() => router.push("/profile/editProfile")}
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

export default function ProfileScreen() {
  const router = useRouter();
  interface ProfileData {
    profileImage: string;
    username: string;
    height: string;
    age: string;
    gender: string;
    role: string;
    phone: string;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/userProfile"
        ); // Replace with your actual API endpoint
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, []);

  const userInfo = {
    username: "Somchai123",
    profileImage: require("../../assets/Profile/images/profile.png"),
    height: "168",
    birthDate: "09/01/2541",
    gender: "ชาย",
    status: "ผู้ป่วยเบาหวาน",
    email: "",
    phone: "0819430552",
  };

  if (!profileData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="ข้อมูลบัญชีผู้ใช้งาน" />

        <Card>
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">
              โปรไฟล์ของฉัน
            </Text>
            <BreakLine />

            {/* Profile Image */}
            <View className="relative mb-4">
              <Image
                source={{ uri: profileData.profileImage }}
                className="w-[150px] h-[150px] rounded-full"
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
            <View className="w-full space-y-6 py-2 gap-4">
              <InfoRow
                icon={require("../../assets/Profile/ruler-pen.png")}
                label="ส่วนสูง"
                value={profileData.height}
              />

              <InfoRow
                icon={require("../../assets/Profile/cake.png")}
                label="วันเกิด"
                value={profileData.age}
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
                value="เพิ่มอีเมล"
                isButton={true}
              />

              <InfoRow
                icon={require("../../assets/Profile/phone.png")}
                label="เบอร์โทรศัพท์"
                value={profileData.phone}
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
