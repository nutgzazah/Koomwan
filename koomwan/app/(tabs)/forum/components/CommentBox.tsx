import {
    View,
    Text,
    Image,
    Pressable,
    ImageSourcePropType,
    TouchableOpacity,
    Modal,
    Button,
    Alert
} from "react-native";
import Card from "../../../../global/components/Card";
import React, { useContext } from "react";
import DoctorIcon from "./DoctorIcon";
import DoctorProfileScreen from "./DoctorProfile";
import { useState } from "react";
import { AuthContext } from "../../../../context/authContext";
import dayjs from 'dayjs'; // Import dayjs to handle date formatting
import BASE_URL from "../../../../config";
import axios from "axios";

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
    postId: string,
    commentId: string,
    hospital: string,
    expert: string,
    occupation: string,
    email: string,
    document: string,
    onDeleteComment?: () => void;
    
}

export default function CommentCard({
    profileImage,
    doctorName,
    content,
    imageContentSource,
    commentTime, // ดึง commentTime มาใช้งาน
    isOwner, // รับ isOwner
    postId,
    commentId,
    hospital,
    expert,
    occupation,
    email,
    document,
    onDeleteComment,  // รับ props onDeleteComment
}: commentCardProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [state] = useContext(AuthContext);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // สถานะเปิดปิดของ modal
    const token = state?.token;
    const isOwnerComment = state?.user?.role === 'doctor' && state?.user?.firstname +' '+ state?.user?.lastname === doctorName || state?.user?.username === doctorName;
    console.log("State:",state)

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/v1/forum/comment/${postId}/${commentId}`);
            Alert.alert(
                "แจ้งเตือน", // ส่วนของ header หรือ title
                "ความคิดเห็นถูกลบสำเร็จ", // ข้อความที่จะแสดง
              );
            if (onDeleteComment) onDeleteComment();  // เรียกใช้ callback เมื่อทำการลบคอมเมนต์สำเร็จ
            setIsDeleteModalVisible(false); // ปิด modal หลังลบคอมเมนต์
        } catch (error) {
            console.error("Error deleting comment:", error);
            Alert.alert(
                "แจ้งเตือน", // ส่วนของ header หรือ title
                "เกิดข้อผิดพลาดในการเชื่อมต่อ", // ข้อความที่จะแสดง
              );
            setIsDeleteModalVisible(false); // ปิด modal ถ้ามีข้อผิดพลาด
        }
    };
    
    return (
        <>
            {/* Modal สำหรับยืนยันการลบ */}
            <Modal
                    transparent={true}
                    visible={isDeleteModalVisible}
                    animationType="fade"
                    onRequestClose={() => setIsDeleteModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View className="w-fit p-6 bg-white rounded-lg">
                            <Text className="font-sans text-center text-description font- pt-2 pb-4 px-2">คุณแน่ใจหรือว่าต้องการลบความคิดเห็นนี้?</Text>
                            <View className="flex-row justify-between mt-5 px-2">
                                <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
                                    <Text className="font-sans font-bold text-xl text-primary">ยกเลิก</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDelete}>
                                    <Text className="font-sans font-bold text-xl text-abnormal">ยืนยัน</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            <DoctorProfileScreen
                header="ข้อมูลส่วนตัวแพทย์"
                modalVisible={modalVisible}
                DoctorImage={profileImage}
                DoctorName={doctorName}
                setModalVisible={(() => setModalVisible(!setModalVisible))}
                hospital={hospital}
                expert={expert} 
                occupation={occupation} 
                email={email}
                document={document}/>
            <Card>
                <View className="flex flex-row pt-2">
                    <View className="w-min-fit">
                        <View className="flex flex-row justify-evenly items-center">
                            {(occupation || expert) ? (
                                <Pressable onPress={() => setModalVisible(true)}>
                                    <DoctorIcon doctorImage={profileImage} verify={!isOwner} />
                                </Pressable>
                            ) : (
                                    <DoctorIcon doctorImage={profileImage} verify={!isOwner} />
                            )}
                            {DoctorNameBox(doctorName, isOwner)}
                        </View>
                        <Text className="font-sans text-tag w-full text-left  mt-2">ตอบกลับเมื่อ {formatPostTime(commentTime)}</Text>
                    </View>
                    {isOwnerComment && (
                        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                            <Image source={require("../../../../assets/Forum/option.png")} className="w-6 h-6" />
                        </TouchableOpacity>
                    )}
                </View>
                {dropdownVisible && (
                    <View className="absolute bg-white border border-abnormal shadow-sm right-2 top-10 rounded-md p-3 mt-1">
                        <TouchableOpacity onPress={handleDelete} >
                            <Pressable onPress={() => { setIsDeleteModalVisible(true); setDropdownVisible(!dropdownVisible); }}>
                                <Text className="text-abnormal  font-bold font-sans">ลบความคิดเห็น</Text>
                            </Pressable>
                        </TouchableOpacity>
                    </View>
                )}
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
    return <View className="justify-start flex w-full mt-4">
        <Text className="font-sans text-body ml-3 mr-2">
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