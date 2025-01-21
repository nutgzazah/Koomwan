import { View, Text, Image, TouchableOpacity } from "react-native";
import Card from "../../../../global/components/Card";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";
import { useRouter } from "expo-router";

export default function ForumCard({ imageSource, isReplied, viewComments = false }: any) {
    const router = useRouter();
    const mockProfile = require("./TempMock/User.png");
    const mockDoctor = require("./TempMock/Doctor.png");
    const mockTextContent =
        `เอ่อช่วงนี้เลิกงานดึกประจำเลยทำให้ต้องออกกำลังกายตอนกลางคืนบ่อยๆ จะมีผลต่อระดับน้ำตาลในเลือดไหมครับ \nแล้วควรจะกินอะไรหลังออกกำลังกายดี?`;
    const mockLike = require("../../../../assets/Tracking/trash.png");
    const mockOptions = require("./TempMock/option.png");

    return (
        <Card>
            <View className="flex flex-row justify-evenly items-center">
                <Image source={mockProfile} className="rounded-full w-11 h-10 mr-2 ml-3" />
                <View className="w-64">
                    <Text
                        className="font-sans text-description"
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        อาทิตย์ สมใจ
                    </Text>
                    <Text className="font-sans text-tag">10 นาทีที่แล้ว</Text>
                </View>
                <View className="ml-7 w-10">
                    <TouchableOpacity className="w-6 h-6">
                        <Image source={mockOptions} className="w-full h-full" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="justify-start flex w-full mt-4">
                <Text className="font-sans text-tag ml-4 mr-2">
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
            <View className="flex flex-row-reverse justify-start w-full mt-5 mr-4">
                <View className="flex items-center">
                    <Image source={mockLike} className="w-6 h-6" />
                    <Text className="font-sans text-tag">1</Text>
                </View>
            </View>
            {!viewComments &&
                <>
                    <BreakLine />
                    <View className="w-full ml-5">
                        <TouchableOpacity onPress={() => router.push("/forum/post/1", { relativeToDirectory: false })}>
                            <Text className="font-sans text-tag">การตอบกลับ (2)</Text>
                        </TouchableOpacity>
                        <View className="flex flex-row items-center mt-4">
                            <Image source={mockDoctor} className="rounded-full w-10 h-10 mr-4" />
                            <View>
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
                    </View>
                </>
            }
        </Card>
    )
}
