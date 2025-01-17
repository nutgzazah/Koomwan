import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-regular mb-8">Home</Text>
        <TouchableOpacity onPress={() => router.push("/user/login")}>
          <Text className="color-secondary text-button">User Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/doctor/login")}>
          <Text className="font-regular">Doctor Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("onboarding")}>
          <Text className="font-medium">Onboarding</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("profile")}>
          <Text className="font-bold">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
