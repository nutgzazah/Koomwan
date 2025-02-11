import {
    View,
    Text,
    Image,
    Pressable,
    TextInput,
    TouchableOpacity
} from "react-native";
import React, { useState } from "react";

interface DropdownProps {
    choices: string[];
    selectedChoice: string;
    onChoiceChange?: (choice: string) => void;
    onOtherTextChange?: (text: string) => void;
}

const arrowDownIcon = require("../../../../assets/Tracking/arrow-down.png");
const arrowUpIcon = require("../../../../assets/Tracking/arrow-up.png");

export default function Dropdown({
    choices,
    selectedChoice,
    onChoiceChange,
    onOtherTextChange
}: DropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [otherText, setOtherText] = useState("");

    const handleSelect = (choice: string) => {
        if (onChoiceChange) {
            onChoiceChange(choice);
        }
        if (choice === "อื่นๆ") {
            setOtherText(""); // Clear other text if "อื่นๆ" is selected
        }
    };

    return (
        <View className="mb-2 px-1 ">
            <TouchableOpacity
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-desciption font-sans bg-background border border-gray flex flex-row items-center border bg-background p-2 rounded-lg"
            >
                <Text className="text-desciption font-sans flex-1 text-gray ">{selectedChoice || "เลือกประเภท"}</Text>
                <Image
                    source={isDropdownOpen ? arrowUpIcon : arrowDownIcon}
                    className="w-7 h-7"
                />
            </TouchableOpacity>

            {isDropdownOpen && (
                <View className="text-desciption font-sans bg-background border border-gray mt-2 rounded-lg">
                    {choices.map((choice) => (
                        <Pressable
                            key={choice}
                            onPress={() => handleSelect(choice)}
                            className="p-0"
                        >
                            <Text
                                className={`text-desciption font-sans text-secondary p-3 ${selectedChoice === choice ? 'bg-primary text-white' : ''}`}
                            >
                                {choice}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}

            {selectedChoice === "อื่นๆ" && (
                <TextInput
                    value={otherText}
                    onChangeText={(text) => {
                        setOtherText(text);
                        if (onOtherTextChange) {
                            onOtherTextChange(text);
                        }
                    }}
                    placeholder="ระบุประเภทอื่นๆ"
                    className="text-desciption font-sans bg-background border border-gray rounded-lg p-3 mt-2"
                />
            )}
        </View>
    );
}
