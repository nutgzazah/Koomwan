import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export const MedicineInput = () => (
  <View className="flex-col items-center w-full">
    <Image
      source={require("../../assets/BeginnerSetup/medicine.png")}
      className="w-32 h-32 mb-6"
      resizeMode="contain"
    />
    <View className="w-full">
      <TouchableOpacity
        className="w-full flex-row items-center justify-between bg-background rounded p-4"
        onPress={() => router.push("/user/MedicationForm")}
      >
        <Text className="text-gray pr-12 text-description font-regular">
          เพิ่มยาประจำของคุณ
        </Text>
        <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
          <Text className="text-card font-bold">+</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);
