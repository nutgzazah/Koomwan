import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import BackButton from "../../../../global/components/BackButton";
import Card from "../../../../global/components/Card";
import { useRouter } from "expo-router";
import BreakLine from "../../../../global/components/BreakLine";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <BackButton title="ย้อนกลับ" />
      <View className="w-full">
        <Card>
          <Text className="text-title text-secondary font-bold">
            การช่วยเหลือผู้ใช้งาน
          </Text>
          <BreakLine />
          <Text className="text-body text-secondary font-regular">
            เราสามารถช่วยเหลืออะไรคุณได้บ้าง
          </Text>
        </Card>
        {/* Help List */}
        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/(account)")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              บัญชี
            </Text>
            <Image
              source={require("../../../../assets/Profile/user-1.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/(health)")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              การติดตามสุขภาพ
            </Text>
            <Image
              source={require("../../../../assets/Profile/health-square.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/other")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              อื่นๆ
            </Text>
            <Image
              source={require("../../../../assets/Profile/other.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
}
