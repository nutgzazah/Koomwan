import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useContext, useState } from "react";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import { AuthContext } from "../../../context/authContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();
  const [state, setState] = useContext(AuthContext)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  //Logout
  const handleLogout = async () => {
    setShowLogoutModal(false); // ปิด modal ด้วย
    setState({token:'',user:''})
    await AsyncStorage.removeItem('@auth')
    router.replace('/user/login')
    alert("ออกจากระบบเรียบร้อย")
  }

  return (
    <SafeAreaView>
      <BackButton title="ย้อนกลับ" />
      <View className="w-full">
        {/* Setting List */}
        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/term")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              เงื่อนไขการให้บริการ
            </Text>
            <Image
              source={require("../../../assets/Profile/arrow-right.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/privacy")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              นโยบายความเป็นส่วนตัว
            </Text>
            <Image
              source={require("../../../assets/Profile/arrow-right.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/(help)")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              การช่วยเหลือผู้ใช้งาน
            </Text>
            <Image
              source={require("../../../assets/Profile/arrow-right.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        {/* Log out Button */}
        <TouchableOpacity
          className="bg-abnormal mx-6 py-4 rounded-lg my-4"
          onPress={() => setShowLogoutModal(true)}
        >
          <Text className="text-white text-center font-bold text-button">
            ล็อกเอาท์
          </Text>
        </TouchableOpacity>
      </View>

       {/* Confirm Logout Modal */}
       <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-[75%]">
            <Text className="font-sans text-lg font-bold text-center mb-4">
              ยืนยันการออกจากระบบ
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="font-sans px-4 py-2">ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-abnormal px-4 py-2 rounded-lg"
                onPress={handleLogout}
              >
                <Text className="font-sans text-white px-4 py-2">ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
