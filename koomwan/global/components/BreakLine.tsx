import React from "react";
import { View } from "react-native";


// เมื่อเรียกใช้ จะมีเส้นแนวนอนกั้นระหว่าง elements  
export default function BreakLine() {
    return (
        <View className="h-[1px] w-full border-[1px] border-gray mx-3 my-4" />
    )
}