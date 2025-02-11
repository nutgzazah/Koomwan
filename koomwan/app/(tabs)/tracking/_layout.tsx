import React from "react";
import { Stack } from "expo-router";


export default function TrackingLayout() {
  return (
    //The Stack Indicate Which Main Pages And Sub-Pages The Tracking Feature Has.
    <Stack screenOptions={{ headerShown: false }}>    
      <Stack.Screen name="index" />
      <Stack.Screen name="medicineCollected" />
      <Stack.Screen name="medicineDetail" />
      <Stack.Screen name="addMedicine" />
      <Stack.Screen name="summaryTracking" /> 
    </Stack>
  );
}