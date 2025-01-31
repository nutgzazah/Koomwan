import React from "react";
import { View } from "react-native";

type Props = {
    children?: React.ReactNode
};

// Call in this form
// <DoctorDisplayCard>
//  <{child elements}>
// <DoctorDisplayCard/>
export default function DoctorDisplayCard({ children }: Props) {
    return (
        // Card for Doctor View (Notification)
        <View className={"rounded-2xl my-4 mx-6 px-3 pt-3 pb-7 "}>
            <View className="flex flex-col justify-between items-center">
                {children}
            </View>
        </View>
    )
}