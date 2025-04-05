import {
    View,
    Text,
    Image,
    Pressable,
    ImageSourcePropType,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Card from "../../../../global/components/Card";
import React, { useContext, useState } from "react";
import DoctorIcon from "./DoctorIcon";
import BASE_URL from "../../../../config"
import { AuthContext } from "../../../../context/authContext";
import axios from "axios";


interface commentReplyCardProps {
    profileImage: ImageSourcePropType,
    username: string,
    imageContentSource: ImageSourcePropType
    isOwner: boolean, // เพิ่มค่า isOwner
    postId: string; // เพิ่ม postId สำหรับใช้กับ API
    onCommentAdded: () => void; // ✅ เพิ่มอันนี้เข้าไป
}

const MAX_LENGTH = 500;

export default function CommentReplyCard({
    profileImage,
    username,
    imageContentSource,
    isOwner, // รับ isOwner
    postId, // รับ postId
    onCommentAdded
}: commentReplyCardProps) {
    const [replyText, setReplyText] = useState(""); // เก็บค่าข้อความที่พิมพ์
    const [state] = useContext(AuthContext);
    const token = state?.token;
    // console.log("State:",state)

    const remainingChars = MAX_LENGTH - replyText.length;
    const charColor =
        remainingChars > 50 ? "text-primary" : remainingChars > 10 ? "text-warning" : "text-abnormal";


    const handleSubmit = async () => {
        if (!token) {
            console.error("No token found, user might not be logged in.");
            return;
        }

        if (replyText.trim() === "") {
            alert("กรุณากรอกข้อความ");
            return;
        }

        if (replyText.length > MAX_LENGTH) {
            alert("ข้อความต้องไม่เกิน 300 อักขระ");
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/forum/comment/${postId}`,
                { answer: replyText },
            );

            console.log("Comment submitted:", response.data);
            onCommentAdded(); // ✅ เรียกใช้งานเพื่อบังคับให้ ForumScreen โหลดคอมเมนต์ใหม่
            setReplyText(""); // ล้างช่องพิมพ์หลังส่งสำเร็จ
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };
    
    return (

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
                <View className=" border-b-4 w-full h-fit border-primary rounded-3xl px-3 py-2">
                    <TextInput
                        className="font-sans text-body ml-3 mr-2 h-fit"
                        placeholder="เพิ่มการตอบกลับ..."
                        value={replyText}
                        onChangeText={(text) => {
                            if (text.length <= MAX_LENGTH) {
                                setReplyText(text.replace(/\n/g, " "));
                            }
                        }}
                        multiline
                    />
                    <Text className={`text-right mt-2 font-sans text-tag ${charColor}`}>
                    เหลือ {remainingChars} อักขระ
                    </Text>
                </View>

                {/* ปุ่มส่งความคิดเห็น */}
                <Pressable 
                    className="bg-primary mt-4 px-4 py-2 rounded-full items-center"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-bold">ส่งความคิดเห็น</Text>
                </Pressable>
            </Card>
    )
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

