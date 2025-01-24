import React from "react";
import { Stack } from "expo-router";


export default function SuggestionLayout() {
  return (
    //The Stack Indicate Which Main Pages And Sub-Pages Suggestion Feature Has.
    <Stack screenOptions={{ headerShown: false }}>    
      <Stack.Screen name="index" />
      <Stack.Screen name="suggestionResult" />
    </Stack>
  );
}