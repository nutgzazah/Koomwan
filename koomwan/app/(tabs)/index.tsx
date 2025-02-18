import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Card from "../../global/components/Card";
import { useRouter } from "expo-router";
import BreakLine from "../../global/components/BreakLine";
import A1Cchart from "../../components/home/A1Cchart";
import BMI from "../../components/home/BMI";
import Emotion from "../../components/home/Emotion";
import BloodSugarStatus from "../../components/home/GluMeter";
import EmoteDisplay from "../../components/home/Emote";
import MedicationStatus from "../../components/home/MedStatus";
import HealthDashboard from "../../components/home/HealthStat";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="mb-8">
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-2xl font-regular mb-8">Home</Text>
          <TouchableOpacity onPress={() => router.push("/user/login")}>
            <Text className="color-secondary text-button">User Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/user/login")}>
            <Text className="font-regular">Doctor Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("onboarding")}>
            <Text className="font-medium">Onboarding</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("profile")}>
            <Text className="font-bold">Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/user/beginner")}>
            <Text className="font-bold">Beginner</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/doctor/signupinfo")}>
            <Text className="font-bold">Doctor info</Text>
          </TouchableOpacity>
        </View>

        <A1Cchart />
        <BMI />
        <Emotion />
        <BloodSugarStatus date="วันจันทร์ที่ 2 ธันวาคม" status="risk" />
        <EmoteDisplay mood="happy" />
        <MedicationStatus hasTakenMeds={true} />
        <HealthDashboard />
      </ScrollView>
    </SafeAreaView>
  );
}
