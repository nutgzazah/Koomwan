import { Text, SafeAreaView, ScrollView, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { LongButton } from "./components/LongButton";

//เริ่มด้วยหน้าให้บันทึกข้อมูล
// Main Page of Tracking Feature
//ยังแก้ไม่เสร็จในส่วนนี้
export default function TrackingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView>
      
      <Card>
        <Text className="text-2xl font-sans color-secondary text-center mt-2">บันทึกข้อมูลสุขภาพ</Text>
          <Text className="text-l font-sans color-secondary text-center mt-2">คุณได้บันทึกข้อมูลพื้นฐานเรียบร้อยแล้ว! พร้อมเริ่มต้นการวิเคราะห์สุขภาพของคุณได้เลย 🎉</Text>
        <BreakLine />
      </Card>


      <Card>
        <Text className="text-2xl font-sans color-secondary text-center mt-2">ข้อมูลสุขภาพ</Text>
        <BreakLine />
          <Text className="text-l font-sans color-secondary text-center mt-2">คุณได้บันทึกข้อมูลพื้นฐานเรียบร้อยแล้ว! พร้อมเริ่มต้นการวิเคราะห์สุขภาพของคุณได้เลย 🎉</Text>
      
      </Card>

      <Card>
        <Text className="text-2xl font-sans color-secondary text-center mt-2">ข้อมูลอารมณ์</Text>
        <BreakLine />
        <Image
          source={require("../../../assets/BeginnerSetup/shield-tick.png")}
          className="w-20 h-20 "
        />
          <Text className="text-l font-sans color-secondary text-center mt-2">คุณได้บันทึกข้อมูลพื้นฐานเรียบร้อยแล้ว! พร้อมเริ่มต้นการวิเคราะห์สุขภาพของคุณได้เลย 🎉</Text>
        <BreakLine />
        <LongButton title="ถัดไป" onPress={() => router.push("./tracking/medicineCollected")} />
      </Card>
     
    </SafeAreaView>
  );
}
