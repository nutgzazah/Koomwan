import { View, Text, Image, TouchableOpacity } from "react-native";
import Card from "../../../../global/components/Card";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";
import { useRouter } from "expo-router";

export default function CommentCard({ imageSource, isReplied }: any) {
    const router = useRouter();
    const mockDoctor = require("./TempMock/Doctor.png");
    const mockTextContent =
        `เอ่อช่วงนี้เลิกงานดึกประจำเลยทำให้ต้องออกกำลังกายตอนกลางคืนบ่อยๆ จะมีผลต่อระดับน้ำตาลในเลือดไหมครับ \nแล้วควรจะกินอะไรหลังออกกำลังกายดี?`;
    const mockLike = require("../../../../assets/Tracking/trash.png");
    const mockOptions = require("./TempMock/option.png");

    return (
        <Card>
            <View className="flex flex-row justify-evenly items-center">
                <Image source={mockDoctor} className="rounded-full w-11 h-10 mr-2" />
                <View className="w-72 mr-7">
                    <Text
                        className="font-sans text-description"
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        นายแพทย์ภูรินทร์ ดำรงค์ธรรม
                    </Text>
                    <View className="bg-primary rounded-3xl h-6 w-20 items-center">
                        <Text className="text-white text-tag">
                            แพทย์
                        </Text>
                    </View>
                </View>
            </View>
            <Text className="font-sans text-tag w-full text-left ml-6 mt-1">ตอบกลับเมื่อ 5 นาทีที่แล้ว</Text>
            <View className="justify-start flex w-full mt-2">
                <Text className="font-sans text-tag ml-3 mr-2">
                    {mockTextContent}
                </Text>
            </View>
            {
                imageSource
                    ?
                    <View className="w-80 h-80 mt-6">
                        <Image
                            className="w-full h-full"
                            source={imageSource}
                        />
                    </View>
                    :
                    <></>
            }
        </Card>
    )
}
