import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>OnboardingScreen</Text>

      <Text className=" font-medium font-sans">back</Text>
    </View>
  );
}
