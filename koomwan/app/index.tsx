import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";

export default function Index() {
  const isLoggedIn = true; //Test if logged in or not
  const router = useRouter();

  return isLoggedIn ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/onboarding" />
  );
}
