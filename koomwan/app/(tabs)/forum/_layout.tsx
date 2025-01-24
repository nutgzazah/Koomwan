import React from "react";
import { Stack } from "expo-router";

export default function ForumLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="create"/>
            <Stack.Screen name="post"/>
        </Stack>
    )
}