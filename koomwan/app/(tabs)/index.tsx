import { View, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-regular mb-8">Home</Text>
      </View>
    </SafeAreaView>
  );
}
