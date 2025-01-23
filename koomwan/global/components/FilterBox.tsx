import React from "react";
import { View, Text, Pressable } from "react-native";

interface twoChoiceFilterBoxProps {
    first_choice: string,
    second_choice: string,
    first_onPress: () => void,
    second_onPress: () => void,
    current_choice: number,
}

export default function TwoChoiceFilterBox({
    first_choice,
    second_choice,
    first_onPress,
    second_onPress,
    current_choice = 1
}: twoChoiceFilterBoxProps) {
    return (
        <View className="flex flex-row items-center w-full h-8 bg-card rounded-md">
            <Pressable 
                className={`w-[50%] h-full rounded-md`}
                onPress={first_onPress}
            >
                <View className={`w-full h-1 ${current_choice == 1 ? "bg-primary" : "bg-background"}`}></View>
                <Text
                    className={`font-sans text-button text-center ${current_choice == 1 ? "text-primary" : "text-secondary"}`
                }>
                    {first_choice}
                </Text>
            </Pressable>
            <Pressable 
                className={`w-[50%] h-full rounded-md`}
                onPress={second_onPress}
            >
                <View className={`w-full h-1 ${current_choice == 2 ? "bg-primary" : "bg-background"}`}></View>
                <Text
                    className={`font-sans text-button text-center ${current_choice == 2 ? "text-primary" : "text-secondary"}`
                }>
                    {second_choice}
                </Text>
            </Pressable>
        </View>
    )
}
