import { View, Text, Image, TouchableOpacity } from "react-native";
import Card from "../../../../global/components/Card";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";
import { useState } from "react";
import { useRouter } from "expo-router";
import PopupScreen from "../../../../global/components/PopupScreen";
import DoctorIcon from "./DoctorIcon";

export default function ForumCard({
    imageContent,
    like,
    comments,
    userimage,
    userName,
    doctorImage,
    doctorName,
    content,
}: any) {
    const [likes, setLikes] = useState(like);
    const [isLike, setIsLike] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const mockChoices: string[] = [
        "สแปม",
        "คำพูดรุนแรง",
        "ข้อมูลเท็จ",
        "การคุกคาม",
        "เนื้อหาไม่เหมาะสม",
        "อื่นๆ",
    ];

    const onPressedLike = () => {
        if (isLike) {
            setLikes(likes - 1);
            setIsLike(false);
        }
        else if (!isLike) {
            setLikes(likes + 1);
            setIsLike(true);
        }
    }

    return (
        <>
            <PopupScreen
                header="รายงานโพสต์"
                modalVisible={modalVisible}
                setModalVisible={(() => setModalVisible(!setModalVisible))}
                choices={mockChoices}
                modalClosePlaceholder="ส่งรายงาน"
            />
            <Card>
                <View className="flex flex-row justify-evenly items-center">
                    <Image source={userimage} className="rounded-full w-11 h-10 mr-2 ml-3" />
                    <View className="w-64">
                        <Text
                            className="font-sans text-description"
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {userName}
                        </Text>
                        <Text className="font-sans text-tag">10 นาทีที่แล้ว</Text>
                    </View>
                    <View className="ml-7 w-10">
                        <TouchableOpacity
                            className="w-6 h-6"
                            onPress={() => setModalVisible(true)}
                        >
                            <Image source={require("../../../../assets/Forum/option.png")} className="w-full h-full" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="justify-start flex w-full mt-4">
                    <Text className="font-sans text-tag ml-4 mr-2">
                        {content}
                    </Text>
                </View>
                {
                    imageContent
                        ?
                        <View className="w-auto h-auto mt-6">
                            <Image
                                className="max-w-[21rem] max-h-[21rem]"
                                source={imageContent}
                            />
                        </View>
                        :
                        <></>
                }
                <View className="flex flex-row-reverse justify-start w-full mt-5 mr-4">
                    <View className="flex items-center">
                        {
                            isLike
                                ?
                                <TouchableOpacity
                                    className="w-6 h-6"
                                    onPress={onPressedLike}
                                >
                                    <Image source={require("../../../../assets/Forum/heart_bold.png")} className="w-6 h-6" />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    className="w-6 h-6"
                                    onPress={onPressedLike}
                                >
                                    <Image source={require("../../../../assets/Forum/heart.png")} className="w-6 h-6" />
                                </TouchableOpacity>
                        }
                        <Text className="font-sans text-tag">{likes}</Text>
                    </View>
                </View>
                <BreakLine />
                {comments !== 0
                    ?
                    <View className="w-full ml-5">
                        <TouchableOpacity onPress={() => router.push("/forum/post/1", { relativeToDirectory: false })}>
                            <Text className="font-sans text-tag">การตอบกลับ ({comments})</Text>
                        </TouchableOpacity>
                        <View className="flex flex-row items-center mt-4">
                            <DoctorIcon doctorImage={doctorImage} />
                            <View>
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
                        </View>
                    </View>
                    :
                    <View className="w-full ml-5">
                        <Text className="font-sans text-tag text-abnormal">การตอบกลับ ({comments})</Text>
                    </View>
                }
            </Card>
        </>
    )
}
