import {
    View,
    Text,
    Image,
    Pressable,
    ImageSourcePropType,
    TextInput
} from "react-native";
import Card from "../../../../global/components/Card";
import React, { useState } from "react";
import DoctorIcon from "./DoctorIcon";


interface commentReplyCardProps {
    profileImage: ImageSourcePropType,
    username: string,
    imageContentSource: ImageSourcePropType
    isOwner: boolean, // เพิ่มค่า isOwner
}

export default function CommentReplyCard({
    profileImage,
    username,
    imageContentSource,
    isOwner, // รับ isOwner
}: commentReplyCardProps) {
    const [replyText, setReplyText] = useState(""); // เก็บค่าข้อความที่พิมพ์
    
    return (
        <>
            <Card>
                <View className="flex flex-row justify-evenly items-center">
                    <DoctorIcon doctorImage={profileImage} verify={!isOwner} />
                    {DoctorNameBox(username, isOwner)}
                </View>

                {/*Handling if no image is found.*/}
                <View className="w-auto h-auto mt-6">
                    <Image
                        className="max-w-80 max-h-80"
                        source={imageContentSource }
                        resizeMode="cover"
                    />
                </View>

                {/* กล่องพิมพ์ข้อความ */}
                <View className=" border-b-4 w-full h-24 border-primary rounded-3xl px-3 py-2">
                    <TextInput
                        className="font-sans text-body ml-3 mr-2"
                        placeholder="เพิ่มการตอบกลับ..."
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                    />
                </View>
            </Card>
        </>
    )
}
function replyBox(reply: string) {
    return <View className="justify-start flex w-full mt-2">
        <Text className="font-sans text-body ml-3 mr-2">
            
        </Text>
    </View>;
}

function DoctorNameBox(username: string, isOwner: boolean) {
    return (
        <View className="w-72 mr-7">
            <Text
                className="font-sans text-description"
                numberOfLines={1}
                ellipsizeMode='tail'
            >
                {username}
            </Text>
            {!isOwner && (
                <View className="bg-primary rounded-3xl h-6 w-20 items-center">
                    <Text className="text-white text-tag">แพทย์</Text>
                </View>
            )}
        </View>
    );
}

