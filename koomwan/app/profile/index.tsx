import React from "react";
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
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

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
                source={require("../../assets/Profile/images/profile.png")}
                className="w-[150px] h-[150px] rounded-full"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0"
                onPress={() => router.push("/profile/editprofile")}
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
                Somchai123
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
                <Text className="text-description text-secondary ml-2">
                  168 ซม.
                </Text>
              </View>

              {/* Age */}
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Profile/cake.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary ml-2">
                  26 ปี
                </Text>
              </View>

              {/* Gender */}
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Profile/sex.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary ml-2">
                  ชาย
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View className="w-full">
          {/* User Account Info */}
          <Card>
            <TouchableOpacity className="flex-row items-center py-1 px-2 mt-2">
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
            <TouchableOpacity className="flex-row items-center py-1 px-2 mt-2">
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
            <TouchableOpacity className="flex-row items-center py-1 px-2 mt-2">
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
