import { View, Text, Image } from "react-native";
import { ImageSourcePropType } from "react-native";
import React from "react";


interface NavTabIconProps {
    focused: boolean;
    label: string;
    iconNormal: ImageSourcePropType;
    iconBold: ImageSourcePropType;
}

interface NavBigIconProps {
    icon: ImageSourcePropType;
}

// สิ่งที่แสดงผลใน Tabs แต่ละแทบ
export function NavTabIcon({
    focused,
    label,
    iconNormal,
    iconBold
}: NavTabIconProps) {
    return (
        <View className="items-center w-20 mt-3 ml-3">
            <Image
                source={focused ? iconBold : iconNormal}
                className="h-6 w-6"
            />
            <Text className={`font-sans text-sub-button text-center ${focused ? "color-primary" : "color-secondary"}`}>
                {label}
            </Text>
        </View>
    )
}

export function NavBigIcon({ icon }: NavBigIconProps) {
    return (
        <View className="items-center justify-center w-14 h-14 rounded-full bg-primary mb-9">
            <Image
                source={icon}
                className="w-6 h-6 color-card"
            />
        </View>
    )
}