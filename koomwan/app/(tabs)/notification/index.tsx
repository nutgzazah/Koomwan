import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  Text
} from "react-native";
import React, { useState } from "react";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import NotificationCard from "./components/NotificationCard";

export default function ResourceScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <Card>
            <Text className="font-sans text-title text-secondary">
                การแจ้งเตือน
            </Text>
            <BreakLine/>
            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}