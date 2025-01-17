import React from "react";
import { View } from "react-native";

type Props = {
    children?: React.ReactNode
};


// เมื่อเรียกใช้ จะมีเส้นแนวนอนกั้นระหว่าง elements  
export function BreakLine() {
    return (
        <View className="h-[1px] w-full border-[1px] border-gray mx-3 my-4" />
    )
}

// เรียกใช้ในรูปแบบ
// <Card>
//  <{สิ่งที่ต้องการใช้จะใส่}>
// <Card/>
export default function Card({ children }: Props) {
    return (
        <View className={"rounded-2xl elevation-md bg-card my-4 mx-6 px-3 pt-4 pb-7 drop-shadow"}>
            <View className="flex flex-col justify-between items-center">
                {children}
            </View>
        </View>
    )
}