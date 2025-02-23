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
    dropdownStyle?: object;
    closeOnSelect?: boolean;
}

const arrowDownIcon = require("../../../../assets/Tracking/arrow-down.png");
const arrowUpIcon = require("../../../../assets/Tracking/arrow-up.png");

export default function Dropdown({
    choices,
    selectedChoice,
    onChoiceChange,
    onOtherTextChange,
    dropdownStyle,
    closeOnSelect = false
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
        if (closeOnSelect) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <View className="mb-2">
            <TouchableOpacity
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex flex-row items-center border border-gray bg-background p-2 rounded-lg"
                style={dropdownStyle}
            >
                <Text className="text-desciption font-sans flex-1 text-gray">{selectedChoice || "เลือกประเภ"}</Text>
                <Image
                    source={isDropdownOpen ? arrowUpIcon : arrowDownIcon}
                    className="w-6 h-6"
                />
            </TouchableOpacity>

            {isDropdownOpen && (
                <View className="mt-2 bg-white border border-gray rounded-lg">
                    {choices.map((choice) => (
                        <Pressable
                            key={choice}
                            onPress={() => handleSelect(choice)}
                            className="p-1"
                        >
                            <Text
                                className={`text-desciption font-sans text-secondary ${selectedChoice === choice ? 'text-desciption font-sans bg-primary text-white p-1' : ''}`}
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
                    className="text-desciption font-sans border border-gray rounded-lg p-2 mt-2"
                />
            )}
        </View>
    );
}
