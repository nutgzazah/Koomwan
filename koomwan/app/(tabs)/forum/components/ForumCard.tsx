import {
    View,
    Text,
    Image,
    Pressable,
    ImageSourcePropType,
} from "react-native";
import Card from "../../../../global/components/Card";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";
import { useState } from "react";
import { useRouter } from "expo-router";
import PopupScreen from "../../../../global/components/PopupScreen";
import DoctorIcon from "./DoctorIcon";

import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("th");

const defaultUserAvatar01 = require("../../../../assets/Avatars/koomwanAvatar01.png");

interface forumCardProps {
    imageContent?: string | ImageSourcePropType | undefined; // รองรับทั้ง URL หรือไฟล์ท้องถิ่น
    like: number
    comments: number
    userimage: ImageSourcePropType
    userName: string
    doctorImage: ImageSourcePropType
    doctorName: string
    content: string
    viewComments: boolean
    posttime: string
    postId: string; 
}

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

export default function ForumCard({
    imageContent,
    like,
    comments,
    userimage,
    userName,
    doctorImage,
    doctorName,
    content,
    viewComments,
    posttime,
    postId,
}: forumCardProps) {
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
                    <Image 
                    source={userimage}
                    resizeMode="cover"
                    onError={() => console.error("Error loading image:", userimage)}
                    className="rounded-full w-11 h-10 mr-2 ml-3" />
                    <View className="w-64">
                        <Text
                            className="font-sans text-description"
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {userName}
                        </Text>
                        <Text className="font-sans text-tag">{formatPostTime(posttime)}</Text>
                    </View>
                    <View className="ml-7 w-10">
                        <Pressable
                            className="w-6 h-6"
                            onPress={() => setModalVisible(true)}
                        >
                            <Image source={require("../../../../assets/Forum/option.png")} className="w-full h-full" />
                        </Pressable>
                    </View>
                </View>
                <View className="justify-start flex w-full mt-4">
                    <Text className="font-sans text-body ml-4 mr-2">
                        {content}
                    </Text>
                </View>
                {
                    imageContent ? (
                        <View className="w-auto h-auto mt-6">
                            <Image
                                style={{ width: 336, height: 336 }} // แก้ให้มีขนาดแน่นอน
                                source={
                                    typeof imageContent === "string"
                                        ? { uri: imageContent }
                                        : imageContent
                                }
                                resizeMode="cover"
                                onError={() => console.error("Error loading image:", imageContent)}
                            />
                        </View>
                    ) : null
                }
                <View className="flex flex-row-reverse justify-start w-full mt-5 mr-4">
                    <View className="flex items-center">
                        {
                            isLike
                                ?
                                <LikeButton />
                                :
                                <UnlikeButton />
                        }
                        <Text className="font-sans text-tag">{likes}</Text>
                    </View>
                </View>
                {comments !== 0 && !viewComments &&
                    <CommentTrigger postId={postId} />
                }
                {comments === 0 && !viewComments && 
                    <NoCommentsBox />
                }
            </Card>
        </>
    )

    function LikeButton(): React.ReactNode {
        return <Pressable
            className="w-6 h-6"
            onPress={onPressedLike}
        >
            <Image source={require("../../../../assets/Forum/heart_bold.png")} className="w-6 h-6" />
        </Pressable>;
    }

    function UnlikeButton(): React.ReactNode {
        return <Pressable
            className="w-6 h-6"
            onPress={onPressedLike}
        >
            <Image source={require("../../../../assets/Forum/heart.png")} className="w-6 h-6" />
        </Pressable>;
    }

    function CommentTrigger({ postId }: { postId: string }): React.ReactNode {
        return <>
            <BreakLine />
            <View className="w-full ml-5">
                <Pressable onPress={() => router.push({
                    pathname: `/forum/post/${postId}`,
                    params: { postId: postId },  // Add the postId as a parameter
                })}>
                    <Text className="font-sans text-tag">การตอบกลับ ({comments})</Text>
                </Pressable>
                {doctorName && (
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
                )}
            </View>
        </>;
    }

    function NoCommentsBox(): React.ReactNode {
        return <>
            <BreakLine />
            <View className="w-full ml-5">
                <Text className="font-sans text-tag text-abnormal">การตอบกลับ ({comments})</Text>
            </View>
        </>;
    }
}
