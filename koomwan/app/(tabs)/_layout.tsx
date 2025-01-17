import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="suggestion"
        options={{
          title: "Suggest",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Tracking",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="resource"
        options={{
          title: "Resource",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: "Forum",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
