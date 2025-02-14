import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

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
          onPress={() => {
            // TODO: Handle Log out
            router.dismissTo("/(tabs)");
          }}
        >
          <Text className="text-white text-center font-bold text-button">
            ล็อกเอาท์
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
