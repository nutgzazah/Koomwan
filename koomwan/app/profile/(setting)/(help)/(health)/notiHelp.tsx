import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../../../global/components/Card";
import BackButton from "../../../../../global/components/BackButton";
import BreakLine from "../../../../../global/components/BreakLine";

export default function NotificationHelpScreen() {
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
                  การแจ้งเตือนไม่ทำงาน
                </Text>

                <BreakLine />
              </View>

              <Text className="text-description text-secondary font-regular mb-6">
                หากการแจ้งเตือนเกี่ยวกับสุขภาพไม่ทำงานตามที่ตั้งไว้
                ลองทำตามขั้นตอนเหล่านี้:
              </Text>

              {/* Step 1 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  1. ตรวจสอบการตั้งค่าการแจ้งเตือน
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ไปที่ การตั้งค่า {">"} การแจ้งเตือน
                  และตรวจสอบว่าได้เปิดการแจ้งเตือนที่ต้องการแล้ว
                </Text>
              </View>

              {/* Step 2 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  2. ปิดแล้วเปิดการแจ้งเตือนใหม่
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ลองปิดการแจ้งเตือนทั้งหมดแล้วเปิดใหม่อีกครั้ง
                </Text>
              </View>

              {/* Step 3 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  3. รีสตาร์ทอุปกรณ์
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  รีสตาร์ทอุปกรณ์ของคุณเพื่อรีเฟรชระบบการแจ้งเตือน
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
