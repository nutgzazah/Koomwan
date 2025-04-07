import { 
  SafeAreaView, 
  Text, 
  View, 
  Image, 
  Modal, 
  Pressable 
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import { AuthContext } from "../../../context/authContext";
import BreakLine from "../../../global/components/BreakLine";
import { ShortButton } from "../tracking/components/ShortButton";
import Loading from "../../../global/components/Loading";

export default function SuggestionScreen() {
  const router = useRouter();
  const [state] = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false);
  console.log("State Suggestion: ",state)

  const handleConfirm = () => {
    setShowModal(false);
    router.push("./suggestion/suggestionResult");
  };

  return (
    <SafeAreaView className="flex-1 mt-2">
      <Card>
        <Text className="text-title font-bold font-sans text-secondary">
          ประเมินสุขภาพ
        </Text>
        <BreakLine />
        <Image
          source={require("../../../assets/Suggestion/heart-secondary.png")}
          className="w-50 h-25 my-10"
        />
        <BreakLine />
        <Text className="text-body font-bold font-sans text-primary text-center mt-1">
          ยังไม่มีการประเมินสุขภาพ
        </Text>
        <Text className="text-description font-sans text-secondary text-center mt-1">
          เริ่มต้นสร้างการประเมินสุขภาพ เพื่อรับการวิเคราะห์ {"\n"} และข้อเสนอต่างๆ
        </Text>
        <ShortButton
          title="เริ่มสร้างการประเมิน"
          onPress={() => setShowModal(true)}
          iconSrc={require("../../../assets/Suggestion/shield-line.png")}
          iconPosition="left"
          className="mt-12 mb-4"
        />
      </Card>

      {/* Modal ยืนยัน */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl ">
            <Text className="font-sans text-headline font-bold text-primary mb-4 text-center">
              ยืนยันการเริ่มต้นประเมิน
            </Text>
            <Text className="font-sans text-description text-center text-secondary mb-4">
              คุณต้องการเริ่มต้นสร้างการประเมินสุขภาพหรือไม่?
            </Text>
            <View className="flex-row justify-around mt-2">
              <Pressable
                onPress={() => setShowModal(false)}
                className=" mt-2 px-10 py-4 rounded-xl"
              >
                <Text className="text-secondary text-description font-bold font-sans">ยกเลิก</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                className="bg-primary mt-2 px-10 py-4 rounded-xl"
              >
                <Text className="font-sans text-description font-bold text-white">ยืนยัน</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
