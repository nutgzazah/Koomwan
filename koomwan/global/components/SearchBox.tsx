import React from "react";
import { View, TextInput, Image } from "react-native";

interface searchBoxProps {
    value: string,
    size: string,
    placeholder: string,
    onChangeText: (Text: string) => void;
}

export default function SearchBox({
    value,
    size = "big",
    placeholder,
    onChangeText,
}: searchBoxProps) {
    return (
        <View className={`flex flex-row rounded-md border-gray border-x-[1px] border-y-[1px] w-[21rem] h-8 items-center`}>
            <Image
                className="w-4 h-4 ml-2"
                source={require("../../assets/Resource/search-normal.png")}
            />
            <TextInput
                className={`font-sans text-sub-button text-secondary overflow-x-scroll w-52 pt-[0.125rem] pb-[0.125rem]`}
                numberOfLines={1}
                placeholder={placeholder}
                placeholderTextColor={"#CBCBCB"}
                secureTextEntry={false}
                onChangeText={onChangeText}
            />
        </View>
    )
}