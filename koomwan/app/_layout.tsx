import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { navTopConfig } from "../global/components/NavBarTop";
import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "K2D-Bold": require("../assets/fonts/K2D-Bold.ttf"),
    "K2D-Regular": require("../assets/fonts/K2D-Regular.ttf"),
    "K2D-Medium": require("../assets/fonts/K2D-Medium.ttf"),
  });

  const config: navTopConfig = {
    targetRoute: "(tabs)",
    profileIconPath: require("../assets/Navbar/mock-profile.png"),
    profileRoute: "../(tabs)/forum",
    logoIconPath: require("../assets/Navbar/Logo.png"),
    homeRoute: "../(tabs)",
    notificationsIconPath: require("../assets/Navbar/notification.png"),
    notificationsRoute: "../(tabs)/resource",
    role: "ทั่วไป",
  }

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/index" />

      {/* ข้างล่างนี้เป็น NavBarTop */}
      <Stack.Screen
        name={config.targetRoute}
        options={{
            headerShown: true,
            headerLeft: () => (
                <TouchableOpacity onPress={(() => router.push(config.profileRoute))}>
                  <View className="flex-row items-baseline">
                    <Image
                        source={config.profileIconPath}
                        style={{ width: 48, height: 48, marginTop: 14, marginBottom: 13 }}
                    />
                    <View className="bg-primary right-6 px-3 rounded-3xl">
                      <Text className="text-card font-sans font-medium">{config.role}</Text>
                    </View>
                    
                  </View>
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <TouchableOpacity onPress={(() => router.push(config.homeRoute))}>
                    <Image
                        source={config.logoIconPath}
                        style={{ width: 40, height: 40 }}
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={(() => router.push(config.notificationsRoute))}>
                    <Image
                        source={config.notificationsIconPath}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
            ),
            headerTitleAlign: "center",
        }} 
      />

      <Stack.Screen name="profile/index" />

      <Stack.Screen name="user/login" />
      <Stack.Screen name="user/signin" />
      <Stack.Screen name="doctor/login" />
      <Stack.Screen name="doctor/signin" />
    </Stack>
  );
}
