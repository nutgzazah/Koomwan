import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  Text
} from "react-native";
import React, { useState } from "react";

export default function ResourceScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <Text>Notification</Text>
      </ScrollView>
    </SafeAreaView>
  );
}