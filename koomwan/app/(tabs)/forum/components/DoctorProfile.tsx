import {
    View,
    Modal,
    Alert,
    Text,
    Image,
    Pressable,
    ImageSourcePropType,
} from "react-native";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";
import { useState } from "react";

interface doctorProfileScreenProps {
    header: string,
    modalVisible: boolean,
    DoctorImage: ImageSourcePropType,
    DoctorName: string,
    hospital: string,
    expert: string,
    occupation: string,
    email: string,
    setModalVisible: (visible: boolean) => void,
}

export default function DoctorProfileScreen({
    header,
    modalVisible = false,
    setModalVisible,
    DoctorImage,
    DoctorName,
    hospital,
    expert,
    occupation,
    email,
}: doctorProfileScreenProps) {
    const [showCertificate, setShowCertificate] = useState(false);

    return (
        <Modal
            // animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View className="rounded-2xl bg-card items-center w-[26rem] h-fit elevation-md drop-shadow pt-2">
                    <View className="flex flex-col justify-between items-center w-full px-5 pt-4 pb-7">
                        <Modal
                            // animationType="slide"
                            transparent={true}
                            visible={showCertificate}
                        >
                            <CertificationBox />
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
                                        className="w-8 h-8"
                                        source={require("../../../../assets/close-circle.png")}
                                    />
                                </Pressable>
                            </View>
                        </View>
                        <BreakLine />
                        <Image
                            className="w-[19.8125rem] h-[21.375rem] rounded-2xl"
                            source={DoctorImage}
                        />
                        <View>
                            <View className="flex flex-row items-center">
                                <Text
                                    className="font-sans text-body text-secondary my-2 mr-[0.375rem]"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                {DoctorName}</Text>
                                <Image
                                    className="w-6 h-6"
                                    source={require("../../../../assets/Forum/verify.png")}
                                />
                            </View>
                        </View>

                        <View className="bg-primary rounded-3xl h-fit py-1  w-[3.75rem] items-center">
                            <Text className="text-white text-description">
                                แพทย์
                            </Text>
                        </View>
                        <BreakLine />
                        <View className="w-[18.4375rem] h-fit mb-5">
                            <HospitalBox
                                hospital={hospital}
                            />
                            <ExpertBox
                                expertise={expert}
                            />
                            <OccupationBox
                                occupation={occupation}
                            />
                            <EmailionBox
                                email={email}
                            />
                        </View>
                        <CertificateTrigger/>
                    </View>
                </View>
            </View>
        </Modal>
    )

    interface hospitalBoxProps {
        hospital: string
    }

    interface expertBoxProps {
        expertise: string
    }

    interface occupationBoxProps {
        occupation: string
    }

    interface emailionBoxProps {
        email: string
    }

    function CertificationBox() {
        return <View className="flex-1 items-end justify-end right-16 bottom-56">
            <View className="rounded-2xl bg-card items-center w-[13.875rem] h-[19rem]">
                <Pressable
                    className="flex flex-col justify-between items-center w-full"
                    onPress={() => setShowCertificate(false)}
                >
                    <Image
                        className="w-full h-full"
                        source={require("../../../../assets/Forum/certificate-mock.png")} />
                </Pressable>
            </View>
        </View>;
    }

    function HospitalBox({ hospital }: hospitalBoxProps) {
        return <View className="flex flex-row w-full mb-1 items-center h-6">
            <Image
                className="w-6 h-6 mr-2"
                source={require("../../../../assets/Forum/hospital.png")} />
            <Text
                className="font-sans text-description text-secondary"
            >
                {hospital}
            </Text>
        </View>;
    }

    
    function ExpertBox({expertise} : expertBoxProps) {
        return <View className="flex flex-row w-full mb-1 items-center h-6">
            <Image
                className="w-6 h-6 mr-2"
                source={require("../../../../assets/Forum/Medicine.png")} />
            <Text
                className="font-sans text-description text-secondary"
                >
                {expertise}
            </Text>
        </View>;
    }
    
    function OccupationBox({ occupation }: occupationBoxProps) {
        return <View className="flex flex-row w-full mb-1 items-center h-6">
            <Image
                className="w-6 h-6 mr-2"
                source={require("../../../../assets/Forum/occupation.png")} />
            <Text
                className="font-sans text-description text-secondary"
            >
                {occupation}
            </Text>
        </View>;
    }

    function EmailionBox({ email }: emailionBoxProps) {
        return <View className="flex flex-row w-full mb-1 items-center h-6">
            <Image
                className="w-6 h-6 mr-2"
                source={require("../../../../assets/Forum/email.png")} />
            <Text
                className="font-sans text-description text-secondary"
            >
                {email}
            </Text>
        </View>;
    }

    function CertificateTrigger() {
        return <View className="flex flex-row w-full h-fit items-center justify-between">
            <Text className="font-sans text-tag text-secondary">
                เอกสารประกอบทางการแพทย์
            </Text>
            <Pressable
                className="flex flex-row bg-primary rounded-md h-[1.6875rem] w-auto items-center"
                onPress={(() => setShowCertificate(true))}
            >
                <Image
                    className="w-4 h-4 ml-[0.59375rem] mr-1"
                    source={require("../../../../assets/Forum/document-text.png")} />
                <Text className="text-white text-sub-button text-[0.625rem] mr-[0.59375rem]">
                    คลิกเพื่อดูรายละเอียด
                </Text>
            </Pressable>
        </View>;
    }
}