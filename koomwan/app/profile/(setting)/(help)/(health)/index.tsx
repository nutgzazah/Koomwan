import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import BackButton from "../../../../../global/components/BackButton";
import Card from "../../../../../global/components/Card";
import { useRouter } from "expo-router";
import BreakLine from "../../../../../global/components/BreakLine";

export default function HealthHelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <BackButton title="การช่วยเหลือผู้ใช้งาน" />
      <View className="w-full">
        <Card>
          <Text className="text-title text-secondary font-bold">
            การช่วยเหลือผู้ใช้งาน
          </Text>
          <BreakLine />
          <Text className="text-body text-secondary font-regular">
            การติดตามสุขภาพของคุณมีปัญหาอย่างไร
          </Text>
        </Card>
        {/* Help List */}
        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/healthHelp")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              ข้อมูลสุขภาพไม่อัปเดต
            </Text>
            <Image
              source={require("../../../../../assets/Profile/arrow-right.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/notiHelp")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              การแจ้งเตือนไม่ทำงาน
            </Text>
            <Image
              source={require("../../../../../assets/Profile/arrow-right.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity
            className="flex-row items-center py-1 px-2 mt-2"
            onPress={() => router.push("/profile/graphHelp")}
          >
            <Text className="text-description text-secondary flex-1 font-bold">
              กราฟหรือรายงานไม่แสดงผล
            </Text>
            <Image
              source={require("../../../../../assets/Profile/arrow-right.png")}
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
              อื่นๆ เกี่ยวกับการติดตามสุขภาพ
            </Text>
            <Image
              source={require("../../../../../assets/Profile/other.png")}
              className="w-7 h-7"
            />
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
}
