import { View, Image, ImageSourcePropType } from "react-native"; 
import React from "react";

interface doctorIconProps {
    doctorImage: ImageSourcePropType;
    verify?: boolean; // เพิ่ม verify ที่สามารถเป็นค่า true หรือ false
}

export default function DoctorIcon({ doctorImage, verify }: doctorIconProps) {
    return (
        <View className="w-12 h-12 mr-4 flex flex-shrink-0">
            <Image
                className="rounded-full w-full h-full"
                source={doctorImage}
            />
            {verify && (
                <Image
                    className="w-6 h-6 left-[2rem] bottom-[0.975rem]"
                    source={require("../../../../assets/Forum/verify.png")}
                />
            )}
        </View>
    );
}
