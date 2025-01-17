import { View, Text, SafeAreaView } from "react-native";
import React from "react";

export default function SuggestionScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-sans mb-8">Suggestion</Text>
      </View>
    </SafeAreaView>
  );
}
