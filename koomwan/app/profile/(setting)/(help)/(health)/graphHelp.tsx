import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../../../global/components/Card";
import BackButton from "../../../../../global/components/BackButton";
import BreakLine from "../../../../../global/components/BreakLine";

export default function GraphHelpScreen() {
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
                  กราฟหรือรายงานไม่แสดงผล
                </Text>

                <BreakLine />
              </View>

              <Text className="text-description text-secondary font-regular mb-6">
                หากกราฟหรือรายงานสุขภาพไม่แสดงผลตามปกติ
                ให้ลองทำตามวิธีแก้ไขต่อไปนี้
              </Text>

              {/* Step 1 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  1. รีเฟรชหน้าจอ
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ปิดหน้าจอลงเพื่อรีเฟรชข้อมูล หรือปิดแอปพลิเคชันแล้วเปิดใหม่
                </Text>
              </View>

              {/* Step 2 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  2. ตรวจสอบการป้อนข้อมูล
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ตรวจสอบว่าคุณได้ป้อนข้อมูลสุขภาพครบถ้วนและถูกต้อง
                  เพราะข้อมูลไม่สมบูรณ์อาจทำให้กราฟหรือรายงานไม่แสดงผล
                </Text>
              </View>

              {/* Step 3 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  3. เปลี่ยนช่วงเวลาการแสดงผล
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ตรวจสอบว่าคุณเลือกช่วงเวลาการแสดงผลที่เหมาะสม เช่น รายวัน
                  รายสัปดาห์ หรือรายเดือน
                </Text>
              </View>

              {/* Step 4 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  4. อัปเดตแอปพลิเคชัน
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  กราฟหรือรายงานอาจไม่แสดงผลหากคุณใช้เวอร์ชันเก่า
                  ตรวจสอบและอัปเดตแอปพลิเคชันให้เป็นเวอร์ชันล่าสุด
                </Text>
              </View>

              {/* Step 5 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  5. ล้างแคชของแอปพลิเคชัน
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
