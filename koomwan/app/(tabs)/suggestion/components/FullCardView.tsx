import { Text, View, Image, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";

interface FullCardData {
  title: string;
  content: string;
  imageSrc: any;
}

interface FullCardViewProps {
  cardData: FullCardData;
  closeModal: () => void;
}

export default function FullCardView({ cardData, closeModal }: FullCardViewProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to open Modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Function to close Modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    closeModal(); // Call the closeModal function passed via props
  };

  return (
    <View className="flex-1 justify-center items-center">
      {/* Button to open Modal */}
      <TouchableOpacity onPress={openModal} className="mb-4">
        <Text className="text-lg text-blue-500">Open Full Card</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible} // Control Modal visibility
        onRequestClose={handleCloseModal} // Close Modal on back press
      >
        <View className="flex-1 justify-center items-center bg-opacity-90 bg-gray-800">
          <View className="bg-card p-6 rounded-lg w-80">
            <TouchableOpacity onPress={handleCloseModal} className="mb-4">
              <Text className="text-lg text-red-500">Close</Text>
            </TouchableOpacity>
            <Image
              source={cardData.imageSrc}
              className="w-full h-40 rounded-lg"
              resizeMode="contain"
            />
            <Text className="text-2xl font-sans text-primary mt-2">{cardData.title}</Text>
            <Text className="text-sm font-sans text-secondary mt-2">{cardData.content}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
