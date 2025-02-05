import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../../../global/components/Card";
import BackButton from "../../../../../global/components/BackButton";
import BreakLine from "../../../../../global/components/BreakLine";

export default function ForgotPasswordHelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <BackButton title="ย้อนกลับ" />

        <View className="w-full px-4">
          <Card>
            <View className="w-full">
              <View className="items-center">
                <Text className="text-title text-secondary font-bold mb-4">
                  ลืมรหัสผ่าน
                </Text>

                <BreakLine />
              </View>

              <Text className="text-description text-secondary font-regular mb-6">
                หากคุณลืมรหัสผ่าน เมื่อคุณอยู่ในหน้า ล็อกอิน หรือยืนยันรหัสผ่าน
                คุณสามารถกดที่ปุ่ม คุณลืมรหัสผ่าน?
              </Text>

              <Text className="text-description text-secondary font-regular mb-6">
                เมื่อคุณกดไปที่ปุ่ม กรอกหมายเลขโทรศัพท์ของคุณ แล้วเราจะทำการส่ง
                OTP ทาง SMS ให้คุณกรอก OTP ที่ได้มาเพื่อยืนยันตัวตน
              </Text>

              <Text className="text-description text-secondary font-regular mb-6">
                จากนั้นเราให้คุณเข้าสู่หน้า Reset รหัสผ่าน
                ตั้งค่ารหัสผ่านใหม่ตามคำแนะนำ เมื่อเปลี่ยนรหัสผ่านเรียบร้อยแล้ว
                คุณสามารถใช้รหัสผ่านใหม่ในการเข้าระบบได้ทันที
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
