import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { AuthLayout } from "../../components/login_signin/AuthLayout";
import { useRouter } from "expo-router";

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <AuthLayout
      backgroundImage={require("../../assets/Signup/images/signup1.png")}
    >
      <View className="flex-1">
        <View className="items-center mb-8">
          <Text className="text-display font-bold text-secondary mb-5">
            ลงทะเบียน
          </Text>
          <Text className="text-description font-regular text-secondary ">
            มาเป็นส่วนหนึ่งเดียวกับพวกเรา!
          </Text>
        </View>

        <View className="h-[1px] bg-gray mb-8" />

        <TouchableOpacity
          onPress={() => router.push("/user/signin")}
          className="mb-4"
        >
          <View className="bg-background rounded-xl p-6 border border-gray">
            <View className="items-center">
              <Image
                source={require("../../assets/Signup/role_user.png")}
                className="w-20 h-20"
              />
              <Text className="mt-4 text-body font-medium text-secondary text-center">
                ลงทะเบียนสำหรับผู้ใช้ทั่วไป
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/doctor/signin")}
          className="mb-8"
        >
          <View className="bg-background rounded-xl p-6 border border-gray">
            <View className="items-center">
              <Image
                source={require("../../assets/Signup/role_doctor.png")}
                className="w-20 h-20"
              />
              <Text className="mt-4 text-body font-medium text-secondary text-center">
                ลงทะเบียนสำหรับ{"\n"}บุคลากรทางการแพทย์
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View className="flex-row justify-center mb-5">
          <Text className="text-description text-gray font-regular">
            มีบัญชีผู้ใช้แล้วใช่ไหม?{"  "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/user/login")}>
            <Text className="text-button font-bold text-primary font-regular">
              เข้าสู่ระบบ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}
