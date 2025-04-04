import React from "react";
import { View, TextInput, Image } from "react-native";

interface searchBoxProps {
    value: string,
    fullSize: boolean,
    placeholder: string,
    onChangeText: (Text: string) => void;
}

export default function SearchBox({
    value,
    fullSize = false,
    placeholder,
    onChangeText,
}: searchBoxProps) {
    return (
        <View className={`flex flex-row bg-card rounded-full border-gray border-x-[1px] border-y-[1px] ${
            fullSize ? "w-full" : "w-[21rem]"
        } h-12 items-center`}
        >
            <Image
                className="w-6 h-6 ml-4"
                source={require("../../assets/Resource/search-normal.png")}
            />
            <TextInput
                className={`pl-2 font-sans text-description text-secondary overflow-x-scroll w-52 pt-[0.125rem] pb-[0.125rem]`}
                numberOfLines={1}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={"#CBCBCB"}
                secureTextEntry={false}
                onChangeText={onChangeText}
            />
        </View>
    )
}