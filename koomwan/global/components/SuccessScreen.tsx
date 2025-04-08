import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { AuthLayout } from "../../components/login_signin/AuthLayout";
import { useRouter } from "expo-router";
import Modal from "./Modal";

type SuccessScreenProps = {
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
  backgroundImage: any;
  showModal?: boolean;
  modalMessage?: string;
};

export default function SuccessScreen({
  title,
  message,
  buttonText,
  onButtonPress,
  backgroundImage,
  showModal = false,
  modalMessage = "",
}: SuccessScreenProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(showModal);

  return (
    <AuthLayout backgroundImage={backgroundImage}>
      <View className="items-center pt-8">
        <View className="p-4 mb-4">
          <Image
            source={require("../../assets/Login/tick-circle.png")}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>

        <Text className="text-display font-bold text-secondary mb-2">
          {title}
        </Text>

        <Text className="text-description text-secondary mb-8 font-regular text-center">
          {message}
        </Text>

        <View className="h-[1px] w-full bg-gray mb-8" />

        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-md"
          onPress={onButtonPress}
        >
          <Text className="text-card text-center font-bold text-button">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        title="สำเร็จ"
        message={modalMessage}
        confirmText="ตกลง"
        onConfirm={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        type="success"
        showCancelButton={false}
      />
    </AuthLayout>
  );
}
