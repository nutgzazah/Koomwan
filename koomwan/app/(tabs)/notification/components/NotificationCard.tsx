import { Text, Image, Pressable, View } from "react-native";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";

interface notificationCardProps {
    user: string,
    createdAt: Date,
    title: string,
    detail: string,
    notificationType: string,
    pillId: string,
    pillName: string,
    isRead: boolean
    onPress: () => void
}

export default function NotificationCard() {
    return (
        <Pressable 
            className="mx-3 rounded-2xl w-full bg-background mb-3 border-[1px] border-gray drop-shadow"
            onPress={() => {}}
        >
            <View className="flex flex-col justify-between items-center mx-3 py-4">
                <View className="w-full">
                    <View className="flex flex-row items-start h-[2.625rem] w-full mb-[1.0625rem] justify-start">
                        <Image
                            className="w-[2.625rem] h-[2.625rem] mr-7"
                            source={require("../../../../assets/Notification/messages.png")}
                        />
                        <Text className="font-sans text-body text-secondary">
                            มีคนตอบกลับในฟอรัมของคุณ
                        </Text>
                    </View>
                    <View className="justify-start">
                        <Text className="font-sans text-tag text-secondary">
                            เมื่อวาน 17 : 00
                        </Text>
                    </View>
                </View>
                <BreakLine />
                <View className="flex flex-row items-center justify-start w-full">
                    <Text className="font-sans text-description text-secondary">
                        นายแพทย์ปรินทร์ วิเชียรได้ตอบกลับฟอรัมของคุณ
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}

