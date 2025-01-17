import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import Card, { BreakLine } from "../../global/components/Card";

const exampleIcon = require("../../assets/BeginnerSetup/cake.png") // ลบทิ้งตอนทำจริง

// ฉบับสาธิตการ์ด
export default function ResourceScreen() {
  return (
    <SafeAreaView className="flex-1">
      <Card>
        <Text className="text-2xl font-sans">Resource</Text>
        <BreakLine />
        <Image source={exampleIcon} className="h-20 w-20"/>
        <Text className="text-display font-sans">An Example Icon</Text>
        <Text className="text-2xl font-sans">More Content</Text>
        <Text className="text-2xl font-sans">Coming Soon</Text>
      </Card>
    </SafeAreaView>
  );
}
