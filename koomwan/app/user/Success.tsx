import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import { router } from "expo-router";

export default function MedicationSuccessScreen() {
  const handleStartRecording = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-4">
        <Card>
          <View className="items-center">
            <Text className="text-title text-secondary font-bold mb-2 text-center">
              บันทึกข้อมูลพื้นฐานเสร็จสิ้น!
            </Text>
            <BreakLine />
            <Image
              source={require("../../assets/BeginnerSetup/shield-tick.png")}
              className="w-[100px] h-[100px] mb-4"
              resizeMode="contain"
            />

            <Text className="text-description text-secondary font-regular mb-8 text-center">
              คุณได้บันทึกข้อมูลพื้นฐานเรียบร้อยแล้ว!
              พร้อมเริ่มต้นการวิเคราะห์สุขภาพของคุณ
              {"\n"}มาร่วมกันดูแลสุขภาพของคุณ
              สู่การเดินทางที่ทำให้สุขภาพดีขึ้นกันเถอะ!🎉
            </Text>

            <View>
              <TouchableOpacity
                className="w-full bg-primary py-4 px-4 rounded-[5px]"
                onPress={handleStartRecording}
              >
                <Text className="text-card text-center font-bold text-button ">
                  เริ่มต้นการบันทึก
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
