import { Text, Image, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

interface backButtonProps {
    title: string;
    path?: string; // ✅ เพิ่ม path แบบ optional
}

export default function BackButton({ title, path }: backButtonProps) {
    const router = useRouter();

    return (
        <Pressable
            className="flex flex-row ml-6 mt-6 mb-3 items-center"
            onPress={() => {
                if (path) {
                    router.replace(path); // ✅ ถ้ามี path ให้ไป path นั้น
                } else {
                    router.back();     // ✅ ถ้าไม่มี path ให้ถอยกลับ
                }
            }}
        >
            <Image 
                className="w-8 h-8 mr-3"
                source={require("../../assets/arrow-circle-left.png")}
            />
            <Text className="font-sans text-body text-secondary">
                {title}
            </Text>
        </Pressable>
    );
}
