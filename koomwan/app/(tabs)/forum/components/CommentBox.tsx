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
import dayjs from 'dayjs'; // Import dayjs to handle date formatting

// ฟังก์ชันที่ใช้ในการคำนวณเวลา
const formatPostTime = (posttime: string): string => {
    const postDate = dayjs(posttime);
    const now = dayjs();
    const diffMinutes = now.diff(postDate, "minute");
    const diffHours = now.diff(postDate, "hour");
    const diffDays = now.diff(postDate, "day");
    const diffWeeks = now.diff(postDate, "week");

    if (diffMinutes < 1) return "เมื่อสักครู่";
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return postDate.format("D MMMM ") + (postDate.year() + 543);
};

interface commentCardProps {
    profileImage: ImageSourcePropType,
    doctorName: string,
    content: string
    imageContentSource: ImageSourcePropType
    commentTime: string // รับเวลา commentTime จาก props
    isOwner: boolean, // เพิ่มค่า isOwner
}

export default function CommentCard({
    profileImage,
    doctorName,
    content,
    imageContentSource,
    commentTime, // ดึง commentTime มาใช้งาน
    isOwner, // รับ isOwner
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
                    {DoctorNameBox(doctorName, isOwner)}
                </View>
                <Text className="font-sans text-tag w-full text-left ml-6 mt-1">ตอบกลับเมื่อ {formatPostTime(commentTime)}</Text>
                {ContentBox(content)}
                {/*Handling if no image is found.*/}
                <View className="w-auto h-auto mt-6">
                    <Image
                        className="max-w-80 max-h-80"
                        source={imageContentSource }
                        resizeMode="cover"
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

function DoctorNameBox(doctorName: string, isOwner: boolean) {
    return (
        <View className="w-72 mr-7">
            <Text
                className="font-sans text-description"
                numberOfLines={1}
                ellipsizeMode='tail'
            >
                {doctorName}
            </Text>
            {!isOwner && (
                <View className="bg-primary rounded-3xl h-6 w-20 items-center">
                    <Text className="text-white text-tag">แพทย์</Text>
                </View>
            )}
        </View>
    );
}

