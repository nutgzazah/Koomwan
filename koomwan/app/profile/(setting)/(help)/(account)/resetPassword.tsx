import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../../../../global/components/Card";
import BackButton from "../../../../../global/components/BackButton";
import BreakLine from "../../../../../global/components/BreakLine";

export default function ResetPasswordHelpScreen() {
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
                  Reset รหัสผ่านไม่ได้
                </Text>

                <BreakLine />
              </View>

              <Text className="text-description text-secondary font-regular mb-6">
                หากคุณไม่สามารถรีเซ็ตรหัสผ่านด้วยหมายเลขโทรศัพท์ที่ลงทะเบียนไว้
                ลองทำตามขั้นตอนต่อไปนี้
              </Text>

              {/* Step 1 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  1. ตรวจสอบหมายเลขโทรศัพท์
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  ตรวจสอบว่าหมายเลขโทรศัพท์ที่คุณกรอกในการรีเซ็ตรหัสผ่านเป็นหมายเลขที่ถูกต้องและตรงกับที่ลงทะเบียนไว้กับแอปพลิเคชัน
                </Text>
              </View>

              {/* Step 2 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  2. ตรวจสอบรหัส OTP
                </Text>
                <View className="ml-4 mt-2">
                  <View className="flex-row items-start mb-2">
                    <Text className="text-description text-secondary mr-2">
                      •
                    </Text>
                    <Text className="text-description text-secondary font-regular flex-1">
                      หากไม่ได้รับรหัส OTP ภายใน 1 นาที ให้กด "ส่งรหัสใหม่"
                    </Text>
                  </View>
                  <View className="flex-row items-start mb-2">
                    <Text className="text-description text-secondary mr-2">
                      •
                    </Text>
                    <Text className="text-description text-secondary font-regular flex-1">
                      ตรวจสอบสัญญาณโทรศัพท์หรือเปลี่ยนตำแหน่งที่ตั้งเพื่อรับสัญญาณที่ดีขึ้น
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 3 */}
              <View className="mb-6">
                <Text className="text-description text-secondary font-regular">
                  3. ตรวจสอบการตั้งค่าระบบ
                </Text>
                <Text className="text-description text-secondary font-regular ml-4 mt-2">
                  บางครั้งอุปกรณ์ของคุณอาจบล็อกข้อความจากหมายเลขที่ไม่รู้จัก
                  ตรวจสอบและปิดการบล็อกเบอร์ที่ไม่รู้จักในเมนูการตั้งค่า {">"}{" "}
                  ข้อความ
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
