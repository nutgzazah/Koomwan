import {
    View,
    Text,
    Image,
    Pressable,
    ImageSourcePropType
} from "react-native";
import Card from "../../../../global/components/Card";
import React from "react";
import DoctorIcon from "./DoctorIcon";
import DoctorProfileScreen from "./DoctorProfile";
import { useState } from "react";

interface commentCardProps {
    profileImage: ImageSourcePropType,
    doctorName: string,
    content: string
    imageContentSource: ImageSourcePropType
}

export default function CommentCard({
    profileImage,
    doctorName,
    content,
    imageContentSource,
}: commentCardProps) {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <DoctorProfileScreen
                header="ข้อมูลส่วนตัวแพทย์"
                modalVisible={modalVisible}
                setModalVisible={(() => setModalVisible(!setModalVisible))}
            />
            <Card>
                <View className="flex flex-row justify-evenly items-center">
                    <Pressable onPress={(() => setModalVisible(true))}>
                        <DoctorIcon doctorImage={profileImage} />
                    </Pressable>
                    {DoctorNameBox(doctorName)}
                </View>
                <Text className="font-sans text-tag w-full text-left ml-6 mt-1">ตอบกลับเมื่อ 5 นาทีที่แล้ว</Text>
                {ContentBox(content)}
                {/*Handling if no image is found.*/}
                <View className="w-auto h-auto mt-6">
                    <Image
                        className="max-w-80 max-h-80"
                        source={imageContentSource}
                    />
                </View>
            </Card>
        </>
    )
}
function ContentBox(content: string) {
    return <View className="justify-start flex w-full mt-2">
        <Text className="font-sans text-tag ml-3 mr-2">
            {content}
        </Text>
    </View>;
}

function DoctorNameBox(doctorName: string) {
    return (
        <View className="w-72 mr-7">
            <Text
                className="font-sans text-description"
                numberOfLines={1}
                ellipsizeMode='tail'
            >
                {doctorName}
            </Text>
            <View className="bg-primary rounded-3xl h-6 w-20 items-center">
                <Text className="text-white text-tag">
                    แพทย์
                </Text>
            </View>
        </View>
    );
}

