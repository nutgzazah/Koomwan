import {
    View,
    Text,
    Image,
    Pressable
} from "react-native";
import React from "react";

interface DropdownChoiceProps {
    choice: string;
    isSelected: boolean;
    toggleSelection: () => void;
}

const checkedIcon = require("../../assets/checkbox_true.png");
const unCheckedIcon = require("../../assets/checkbox_false.png");

export default function DropdownChoice({
    choice,
    isSelected,
    toggleSelection,
}: DropdownChoiceProps) {
    return (
        <View className="flex flex-row items-center w-[19.25rem] h-8 mb-3">
            <Pressable
                className="w-7 h-6 mr-[1.125rem]"
                onPress={toggleSelection}
            >
                <Image
                    className="w-6 h-full"
                    source={isSelected ? checkedIcon : unCheckedIcon}
                />
            </Pressable>

            <Text className="font-sans text-body text-secondary">{choice}</Text>
        </View>
    );
}