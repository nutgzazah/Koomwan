import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

type StatusModalProps = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
};

const StatusModal = ({ visible, isLoading, onClose }: StatusModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-card rounded-lg p-6 mx-4 items-center min-w-[300px]">
          {isLoading ? (
            <>
              <ActivityIndicator
                size="large"
                color="#3972F0"
                className="mb-4 mt-2"
              />
              <Text className="text-description text-secondary font-regular">
                กำลังบันทึกข้อมูลของคุณ
              </Text>
            </>
          ) : (
            <>
              <Image
                source={require("../../assets/Login/tick-circle.png")}
                className="w-[100px] h-[100px] mb-4 mt-2"
              />
              <Text className="text-headline text-secondary font-bold mb-2">
                บันทึกข้อมูลของคุณสำเร็จ!
              </Text>
              <Text className="text-description text-secondary font-regular text-center mb-6">
                กรุณารอแอดมินตรวจสอบและยืนยันการสมัครของคุณ
                เราจะทำการส่งอีเมลผลการตรวจสอบให้คุณโดยเร็วที่สุด!
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-20 py-4 rounded-lg bg-primary "
              >
                <Text className="text-card text-button text-center font-bold">
                  ปิด
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
