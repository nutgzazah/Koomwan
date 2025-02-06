import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../../../global/components/Card";
import BackButton from "../../../../../global/components/BackButton";
import BreakLine from "../../../../../global/components/BreakLine";

export default function DataUpdateHelpScreen() {
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
                  ข้อมูลที่แก้ไขไม่อัพเดตตามที่กรอก
                </Text>

                <BreakLine />
              </View>

              <Text className="text-description text-secondary font-regular mb-6">
                หากข้อมูลบัญชีที่คุณแก้ไขไม่อัพเดตตามที่กรอก
                ลองทำตามวิธีแก้ไขนี้
              </Text>

              {/* Step 1 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  1. ตรวจสอบการบันทึกข้อมูล
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ตรวจสอบว่าคุณได้กด "บันทึก" หรือ "ยืนยัน"
                  หลังจากแก้ไขข้อมูลเรียบร้อยแล้ว
                </Text>
              </View>

              {/* Step 2 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  2. รีเฟรชแอปพลิเคชัน
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ปิดแอปพลิเคชันแล้วเปิดใหม่อีกครั้งเพื่อให้ระบบรีเฟรชข้อมูลล่าสุด
                </Text>
              </View>

              {/* Step 3 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  3. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  การเชื่อมต่ออินเทอร์เน็ตที่ไม่เสถียรอาจทำให้ข้อมูลที่แก้ไขไม่ถูกบันทึก
                  ตรวจสอบการเชื่อมต่อและลองแก้ไขข้อมูลใหม่อีกครั้ง
                </Text>
              </View>

              {/* Step 4 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  4. อัปเดตแอปพลิเคชัน
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ตรวจสอบว่าแอปพลิเคชันเป็นเวอร์ชันล่าสุด
                  หากไม่ใช่ให้ทำการอัปเดตผ่าน App Store หรือ Play Store
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
