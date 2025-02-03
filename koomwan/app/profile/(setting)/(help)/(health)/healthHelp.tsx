import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../../../global/components/Card";
import BackButton from "../../../../../global/components/BackButton";
import BreakLine from "../../../../../global/components/BreakLine";

export default function HealthDataHelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <BackButton title="การช่วยเหลือผู้ใช้งาน" />

        <View className="w-full px-4">
          <Card>
            <View className="w-full">
              <View className="items-center">
                <Text className="text-title text-secondary font-bold mb-4">
                  ข้อมูลสุขภาพไม่อัปเดต
                </Text>

                <BreakLine />
              </View>

              <Text className="text-description text-secondary font-regular mb-6">
                หากข้อมูลสุขภาพของคุณไม่อัปเดตในแอปพลิเคชัน
                ลองทำตามขั้นตอนต่อไปนี้:
              </Text>

              {/* Step 1 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  1. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ตรวจสอบว่าอุปกรณ์ของคุณเชื่อมต่อกับอินเทอร์เน็ตอย่างเสถียร
                  หากการเชื่อมต่อไม่เสถียร ข้อมูลอาจไม่อัปเดต
                </Text>
              </View>

              {/* Step 2 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  2. รีเฟรชแอปพลิเคชัน
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ปิดแอปพลิเคชันแล้วเปิดใหม่อีกครั้งหรือใช้ฟีเจอร์รีเฟรชบนหน้าแสดงข้อมูลสุขภาพ
                </Text>
              </View>

              {/* Step 3 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  3. ล้างแคชของแอปพลิเคชัน
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
