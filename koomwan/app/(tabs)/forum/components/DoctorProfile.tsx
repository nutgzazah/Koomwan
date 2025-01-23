import {
    View,
    Modal,
    Alert,
    Text,
    Image,
    Pressable,
} from "react-native";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";
import { useState } from "react";

interface doctorProfileScreenProps {
    header: string,
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void,
}

export default function DoctorProfileScreen({
    header,
    modalVisible = false,
    setModalVisible,
}: doctorProfileScreenProps) {
    const [showCertificate, setShowCertificate] = useState(false);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
                <View className="rounded-2xl bg-card items-center w-[26rem] h-[40.5rem] elevation-md drop-shadow">
                    <View className="flex flex-col justify-between items-center w-full px-5 pt-4 pb-7">
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={showCertificate}
                            >
                            <View className="flex-1 items-end justify-end right-16 bottom-56">
                                <View className="rounded-2xl bg-card items-center w-[13.875rem] h-[19rem]">
                                    <Pressable 
                                        className="flex flex-col justify-between items-center w-full"
                                        onPress={() => setShowCertificate(false)}
                                    >
                                        <Image
                                            className="w-full h-full"
                                            source={require("../../../../assets/Forum/certificate-mock.png")}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                        <View className="mx-3 w-full h-10">
                            <View className="justify-center w-full items-center flex">
                                <Text
                                    className="font-sans text-title text-secondary"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {header}
                                </Text>
                                <Pressable
                                    className="bottom-8 right-0 w-full flex flex-row-reverse"
                                    onPress={(() => setModalVisible(false))}
                                >
                                    <Image
                                        className="w-6 h-6"
                                        source={require("../../../../assets/close-circle.png")}
                                    />
                                </Pressable>
                            </View>
                        </View>
                        <BreakLine />
                        <Image
                            className="w-[19.8125rem] h-[21.375rem]"
                            source={require("../../../../assets/Forum/doctor-mock.png")}
                        />
                        <View>
                            <View className="flex flex-row items-center">
                                <Text
                                    className="font-sans text-body text-secondary mr-[0.375rem]"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    นายแพทย์ภูรินทร์ ดำรงค์ธรรม</Text>
                                <Image
                                    className="w-6 h-6"
                                    source={require("../../../../assets/Forum/verify.png")}
                                />
                            </View>
                        </View>

                        <View className="bg-primary rounded-3xl h-6 w-[3.75rem] items-center">
                            <Text className="text-white text-tag">
                                แพทย์
                            </Text>
                        </View>
                        <BreakLine />
                        <View className="w-[18.4375rem] h-[3.25rem] mb-5">
                            <View className="flex flex-row w-full mb-1 items-center h-6">
                                <Image
                                    className="w-4 h-4 mr-2"
                                    source={require("../../../../assets/Forum/hospital.png")}
                                />
                                <Text
                                    className="font-sans text-description text-secondary"
                                >
                                    โรงพยาบาลหัวเฉียว
                                </Text>
                            </View>
                            <View className="flex flex-row w-full items-center h-6">
                                <Image
                                    className="w-4 h-4 mr-2"
                                    source={require("../../../../assets/Forum/Medicine.png")}
                                />
                                <Text
                                    className="font-sans text-description text-secondary"
                                >
                                    เชี่ยวชาญด้านยา
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row w-full h-[1.6875rem] items-center justify-between">
                            <Text className="font-sans text-tag text-secondary">
                                เอกสารประกอบทางการแพทย์
                            </Text>
                            <Pressable
                                className="flex flex-row bg-primary rounded-md h-[1.6875rem] w-auto items-center"
                                onPress={(() => setShowCertificate(true))}
                            >
                                <Image
                                    className="w-4 h-4 ml-[0.59375rem] mr-1"
                                    source={require("../../../../assets/Forum/document-text.png")}
                                />
                                <Text className="text-white text-sub-button text-[0.625rem] mr-[0.59375rem]">
                                    คลิกเพื่อดูรายละเอียด
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}