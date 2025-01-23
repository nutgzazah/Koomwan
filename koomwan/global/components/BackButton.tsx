import { Text, Image, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

interface backButtonProps {
    title: string
}

export default function BackButton({ title }: backButtonProps) {
    const router = useRouter();

    return (
        <Pressable
            className="flex flex-row ml-6 mt-6 mb-3 items-center"
            onPress={() => router.back()}
        >
            <Image 
                className="w-8 h-8 mr-3"
                source={require("../../assets/arrow-circle-left.png")}
            />
            <Text className="font-sans text-body text-secondary">
                {title}
            </Text>
        </Pressable>
    )
}
