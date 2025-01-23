import { View, Image, ImageSourcePropType } from "react-native";
import React from "react";

interface doctorIconProps {
    doctorImage: ImageSourcePropType,
}

export default function DoctorIcon({ doctorImage }: doctorIconProps) {
    return (
        <View className="w-10 h-10 mr-4 flex flex-shrink-0">
            <Image
                className="rounded-full w-full h-full"
                source={doctorImage}
            />
            <Image
                className="w-4 h-4 left-[1.625rem] bottom-[0.875rem]"
                source={require("../../../../assets/Forum/verify.png")}
            />
        </View>
    )
}