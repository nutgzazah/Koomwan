import React from "react";
import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Card from "../../../../global/components/Card";
import BackButton from "../../../../global/components/BackButton";
import BreakLine from "../../../../global/components/BreakLine";

type RegularPill = {
  pill_id: number;
  user_id: number;
  pill_name: string;
  pill_type: string;
  description: string;
  pill_notify_time?: string;
  image?: string | null;
};

// Mock data object using id as key
const PILLS: { [key: string]: RegularPill } = {
  "1": {
    pill_id: 1,
    user_id: 1,
    pill_name: "ไกลพิไซด์ (Glipizide)",
    pill_type: "ยารักษาโรคเบาหวาน",
    description: "ยาลดระดับน้ำตาลในเลือด ใช้รักษาโรคเบาหวานชนิดที่ 2",
    image: null,
  },
  "2": {
    pill_id: 2,
    user_id: 1,
    pill_name: "เม็ทฟอร์มิน (Metformin)",
    pill_type: "ยารักษาโรคเบาหวาน",
    description:
      "ยาลดระดับน้ำตาลในเลือด ช่วยให้ร่างกายตอบสนองต่ออินซูลินดีขึ้น",
    image: null,
  },
  "3": {
    pill_id: 3,
    user_id: 1,
    pill_name: "อินซูลิน (Insulin)",
    pill_type: "ยาฉีด",
    description: "ฮอร์โมนที่ช่วยควบคุมระดับน้ำตาลในเลือด",
    image: null,
  },
};

export default function PillDetailScreen() {
  // Get parameters from the route - handle both id and pill_id to make it compatible with different routing approaches
  const params = useLocalSearchParams();
  const pillId = params.id || params.pill_id;

  // ดึงข้อมูลยาจาก PILLS object โดยใช้ id เป็น key
  // ถ้าไม่พบข้อมูลจะใช้ default values
  const pillDetails = PILLS[pillId as string] || {
    pill_id: Number(pillId),
    user_id: 1,
    pill_name: "ไม่พบข้อมูลยา",
    pill_type: "-",
    description: "ไม่มีข้อมูลรายละเอียด",
    image: null,
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackButton title="รายละเอียดยา" />

      <ScrollView className="flex-1 px-4">
        <Card>
          <Text className="flex-1 text-headline text-secondary font-bold text-center">
            ยา
          </Text>
          <BreakLine />

          {/* Pill Image */}
          <View className="w-full h-[150px] aspect-[2/1] bg-background rounded-lg items-center justify-center border border-gray">
            {pillDetails.image ? (
              <Image
                source={{ uri: pillDetails.image }}
                className="w-full h-[150px] p-1"
                resizeMode="contain"
              />
            ) : (
              <View className="items-center">
                <Image
                  source={require("../../../../assets/BeginnerSetup/add-image.png")}
                  className="w-16 h-16 mb-2"
                  resizeMode="contain"
                />
                <Text className="text-description text-gray font-regular">
                  ไม่มีรูปภาพ
                </Text>
              </View>
            )}
          </View>

          {/* Pill Name */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              ชื่อยา
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular h-12 justify-center">
              <Text className="text-description font-regular text-secondary">
                {pillDetails.pill_name}
              </Text>
            </View>
          </View>

          {/* Pill Type */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              ประเภท
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular h-12 justify-center">
              <Text className="text-description text-secondary font-regular">
                {pillDetails.pill_type}
              </Text>
            </View>
          </View>

          {/* Pill Description */}
          <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              รายละเอียด
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular min-h-[96px]">
              <Text className="text-description text-secondary font-regular">
                {pillDetails.description}
              </Text>
            </View>
          </View>

          {/* Notification Time - Commented out as per the reference design */}
          {/* {pillDetails.pill_notify_time && (
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                เวลาแจ้งเตือน
              </Text>
              <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular h-12 justify-center">
                <Text className="text-description text-secondary font-regular">
                  {pillDetails.pill_notify_time} น.
                </Text>
              </View>
            </View>
          )} */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
