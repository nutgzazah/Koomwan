import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import React from "react";
import { AuthProvider } from "../context/authContext";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "K2D-Bold": require("../assets/fonts/K2D-Bold.ttf"),
    "K2D-Regular": require("../assets/fonts/K2D-Regular.ttf"),
    "K2D-Medium": require("../assets/fonts/K2D-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/index" />

      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="profile/index" />

      <Stack.Screen name="user/login" />
      <Stack.Screen name="user/signin" />

      <Stack.Screen name="doctor/signin" />
    </Stack>
    </AuthProvider>
  );
}
