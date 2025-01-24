import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";

type SelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: string[];
  title: string;
};

export default function SelectionModal({
  visible,
  onClose,
  onSelect,
  options,
  title,
}: SelectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background rounded-t-3xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-title text-secondary font-bold">
              เลือก{title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-primary font-bold text-body">
                เสร็จสิ้น
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-80">
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className="py-4 border-b border-gray"
                onPress={() => onSelect(option)}
              >
                <Text className="text-description text-secondary text-center font-regular">
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
