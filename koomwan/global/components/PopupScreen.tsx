import {
    View,
    Modal,
    Alert,
    Text,
    ScrollView,
    Pressable,
} from "react-native";
import React from "react";
import BreakLine from "./BreakLine";
import DropdownChoice from "./DropdownChoice";

interface modalScreenProps {
    header: string,
    modalClosePlaceholder: string
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void,
    choices: string[],
}

export default function PopupScreen({
    header,
    modalClosePlaceholder,
    modalVisible = false,
    setModalVisible,
    choices
}: modalScreenProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            <View className="flex-1 items-center justify-center">
                <View className="rounded-2xl bg-card items-center w-[23.75rem] h-[23rem] elevation-md drop-shadow">
                    <View className="flex flex-col justify-between items-center w-full px-5 pt-4 pb-7">
                        <Text className="font-sans text-body text-secondary">
                            {header}
                        </Text>
                        <BreakLine />
                        <ScrollView 
                            className="w-full h-52 mb-2"
                            showsVerticalScrollIndicator={false}
                        >
                            {choices.map((choice, index) => (
                                <DropdownChoice
                                    key={index}
                                    choice={choice}
                                />
                            ))}
                        </ScrollView>

                        <Pressable
                            className="w-[10.5rem] h-12 bg-primary rounded-md justify-center items-center"
                            onPress={(() => setModalVisible(false))}
                        >
                            <Text
                                className="font-sans text-button text-card"
                            >
                                {modalClosePlaceholder}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}