import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from "react-native";

type MedicationFormModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "confirm" | "success" | "error";
  isLoading?: boolean;
};

const MedicationFormModal = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type,
  isLoading = false,
}: MedicationFormModalProps) => {
  const getIconSource = () => {
    switch (type) {
      case "confirm":
        return require("../../../assets/Login/tick-circle.png");
      case "success":
        return require("../../../assets/Login/tick-circle.png");
      case "error":
        return require("../../../assets/Login/close-circle.png");
      default:
        return require("../../../assets/Login/tick-circle.png");
    }
  };

  const getConfirmButtonColor = () => {
    return "bg-primary";
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-card w-5/6 rounded-2xl p-6">
              <View className="items-center">
                <Image
                  source={getIconSource()}
                  className="w-16 h-16 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-title font-bold text-secondary mb-2">
                  {title}
                </Text>
                <Text className="text-description text-secondary text-center mb-6 font-regular">
                  {message}
                </Text>
              </View>

              <View className="h-[1px] w-full bg-gray mb-6" />

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 py-4 bg-background rounded-md mr-2"
                  onPress={onCancel}
                  disabled={isLoading}
                >
                  <Text className="text-secondary text-center font-bold text-button">
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-4 ${getConfirmButtonColor()} rounded-md ml-2`}
                  onPress={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text className="text-card text-center font-bold text-button">
                      {confirmText}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MedicationFormModal;
