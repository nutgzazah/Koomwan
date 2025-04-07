import React from "react";
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "react-native";

type ModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "success" | "warning" | "error";
  showCancelButton?: boolean; // Add option to hide cancel button
};

export default function Modal({
  visible,
  title,
  message,
  confirmText,
  cancelText = "ยกเลิก",
  onConfirm,
  onCancel,
  type,
  showCancelButton = true,
}: ModalProps) {
  const getIconSource = () => {
    switch (type) {
      case "success":
        return require("../../assets/Login/tick-circle.png");
      case "warning":
        return require("../../assets/Login/warning-icon.png");
      case "error":
        return require("../../assets/Login/close-circle.png");
      default:
        return require("../../assets/Login/tick-circle.png");
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-primary";
      case "warning":
        return "bg-abnormal";
      case "error":
        return "bg-abnormal";
      default:
        return "bg-primary";
    }
  };

  return (
    <RNModal transparent visible={visible} animationType="fade">
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
                {showCancelButton && (
                  <TouchableOpacity
                    className="flex-1 py-4 bg-background rounded-md mr-2"
                    onPress={onCancel}
                  >
                    <Text className="text-secondary text-center font-bold text-button">
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className={`flex-1 py-4 ${getConfirmButtonColor()} rounded-md ${
                    showCancelButton ? "ml-2" : ""
                  }`}
                  onPress={onConfirm}
                >
                  <Text className="text-card text-center font-bold text-button">
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
