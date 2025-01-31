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

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="โปรไฟล์ของฉัน" />

        {/* Profile Card */}
        <Card>
          {/* Header */}
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">
              โปรไฟล์ของฉัน
            </Text>
            <BreakLine />

            {/* Profile Image */}
            <View className="relative mb-4">
              <Image
                source={require("../../assets/Profile/images/profile.png")}
                className="w-[150px] h-[150px] rounded-full"
              />
            </View>

            {/* Username */}
            <View className="flex-row items-center mb-4">
              <Image
                source={require("../../assets/Profile/user.png")}
                className="w-6 h-6 "
              />
              <Text className="text-headline font-bold text-secondary pl-2">
                Somchai123
              </Text>
            </View>

            <BreakLine />

            {/* User Info List */}
            <View className="w-full space-y-6 py-2 gap-4">
              {/* Height */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/Profile/ruler-pen.png")}
                    className="w-6 h-6 "
                  />
                  <Text className="text-description text-secondary ml-2 font-regular">
                    ส่วนสูง
                  </Text>
                </View>
                <Text className="text-description text-secondary font-regular">
                  168
                </Text>
              </View>

              {/* Birth Date */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/Profile/cake.png")}
                    className="w-6 h-6 "
                  />
                  <Text className="text-description text-secondary ml-2 font-regular">
                    วันเกิด
                  </Text>
                </View>
                <Text className="text-description text-secondary font-regular">
                  09/01/2541
                </Text>
              </View>

              {/* Gender */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/Profile/sex.png")}
                    className="w-6 h-6 "
                  />
                  <Text className="text-description text-secondary ml-2 font-regular">
                    เพศ
                  </Text>
                </View>
                <Text className="text-description text-secondary font-regular">
                  ชาย
                </Text>
              </View>

              {/* Status */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/Profile/heart.png")}
                    className="w-6 h-6 "
                  />
                  <Text className="text-description text-secondary ml-2 font-regular">
                    สถานะ
                  </Text>
                </View>
                <Text className="text-description text-secondary font-regular">
                  ผู้ป่วยเบาหวาน
                </Text>
              </View>

              {/* Email */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/Profile/email.png")}
                    className="w-6 h-6 tint-primary"
                  />
                  <Text className="text-description text-secondary ml-2 font-regular">
                    อีเมล
                  </Text>
                </View>
                <TouchableOpacity className="bg-primary px-4 py-1 rounded">
                  <Text className="font-regular text-tag text-white ">
                    เพิ่มอีเมล
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Phone */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/Profile/phone.png")}
                    className="w-6 h-6 tint-primary"
                  />
                  <Text className="text-description text-secondary ml-2 font-regular">
                    เบอร์โทรศัพท์
                  </Text>
                </View>
                <Text className="text-description text-secondary font-regular">
                  0819430552
                </Text>
              </View>
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
