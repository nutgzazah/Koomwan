import {
    View,
    Modal,
    Alert,
    Text,
    ScrollView,
    Pressable,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import BreakLine from "./BreakLine";
import DropdownChoice from "./DropdownChoice";

interface ModalScreenProps {
    header: string;
    modalClosePlaceholder: string;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    choices: string[];
    onChoiceSelect: (selectedChoice: string[]) => void;
}

export default function PopupScreen({
    header,
    modalClosePlaceholder,
    modalVisible = false,
    setModalVisible,
    choices,
    onChoiceSelect,
}: ModalScreenProps) {
    const [selectedChoice, setselectedChoice] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setselectedChoice((prevSelected) => {
            if (category === "ทั้งหมด") {
                // If "ทั้งหมด" is selected, reset to just "ทั้งหมด"
                return ["ทั้งหมด"];
            } else {
                // Otherwise, toggle the selected category
                const updatedSelection = prevSelected.includes(category)
                    ? prevSelected.filter((item) => item !== category)
                    : [...prevSelected, category];

                // If the selection now has categories other than "ทั้งหมด", remove "ทั้งหมด"
                if (updatedSelection.includes(category) && updatedSelection.includes("ทั้งหมด")) {
                    return updatedSelection.filter((item) => item !== "ทั้งหมด");
                }

                return updatedSelection;
            }
        });
    };

    const handleApplyFilters = () => {
        onChoiceSelect(selectedChoice);
        setModalVisible(false);
    };

    const handleCancel = () => {
        setselectedChoice([]); // เคลียร์การเลือกเมื่อกดยกเลิก
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
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
                            showsVerticalScrollIndicator={true}
                            persistentScrollbar={true}
                        >
                            {choices.map((choice, index) => (
                                <DropdownChoice
                                    key={index}
                                    choice={choice}
                                    isSelected={selectedChoice.includes(choice)}
                                    toggleSelection={() => toggleCategory(choice)}
                                />
                            ))}
                        </ScrollView>
                        <View className="flex flex-row justify-between w-full px-5">
                            <Pressable
                                className="w-[8rem] h-12 bg-primary rounded-md justify-center items-center mt-4"
                                onPress={handleApplyFilters}
                            >
                                <Text className="font-sans text-button text-card">
                                    {modalClosePlaceholder}
                                </Text>
                            </Pressable>

                            <Pressable
                                className="w-[8rem] h-12 bg-secondary rounded-md justify-center items-center mt-4"
                                onPress={handleCancel}
                            >
                                <Text className="font-sans text-button text-white">
                                    ยกเลิก
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}