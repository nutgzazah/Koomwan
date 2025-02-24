import React from "react";
import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import BreakLine from "../../../global/components/BreakLine";

type RegularPill = {
  pill_id: number;
  user_id: number;
  pill_name: string;
  pill_type: string;
  description: string;
  pill_notify_time?: string;
  image?: string | null;
};

export default function MedicationDetail() {
  const { pill_id, pill_name } = useLocalSearchParams();

  // Mock data - ในการใช้งานจริงดึงข้อมูลตาม pill_id ที่ได้รับมา
  const mockPillDetails: { [key: string]: RegularPill } = {
    Glipizide: {
      pill_id: 1,
      user_id: 1,
      pill_name: "Glipizide",
      pill_type: "ยารักษาโรคเบาหวาน",
      description: "ยาลดระดับน้ำตาลในเลือด ใช้รักษาโรคเบาหวานชนิดที่ 2",
      image: null,
    },
    Metformin: {
      pill_id: 2,
      user_id: 1,
      pill_name: "Metformin",
      pill_type: "ยารักษาโรคเบาหวาน",
      description:
        "ยาลดระดับน้ำตาลในเลือด ช่วยให้ร่างกายตอบสนองต่ออินซูลินดีขึ้น",
      image: null,
    },
  };

  const pillData = mockPillDetails[pill_name as string];

  if (!pillData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <BackButton title="ย้อนกลับ" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-description text-secondary font-regular">
            ไม่พบข้อมูลยา
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackButton title="ย้อนกลับ" />

      <ScrollView className="flex-1 px-4">
        <Card>
          <Text className="flex-1 text-headline text-secondary font-bold text-center">
            ยาประจำ
          </Text>
          <BreakLine />

          {/* Pill Image */}
          <View className="w-full h-[150px] aspect-[2/1] bg-background rounded-lg items-center justify-center border border-gray">
            {pillData.image ? (
              <Image
                source={{ uri: pillData.image }}
                className="w-full h-[150px] p-1"
                resizeMode="contain"
              />
            ) : (
              <View className="items-center">
                <Image
                  source={require("../../../assets/BeginnerSetup/add-image.png")}
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
              <Text className="text-description font-regular text-secondary font-regular">
                {pillData.pill_name}
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
                {pillData.pill_type}
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
                {pillData.description}
              </Text>
            </View>
          </View>

          {/* Notification Time */}
          {/* <View className="mt-4 w-full">
            <Text className="text-description text-secondary font-regular mb-2">
              เวลาแจ้งเตือน
            </Text>
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular h-12 justify-center">
              <Text className="text-description text-secondary font-regular">
                {pillData.pill_notify_time} น.
              </Text>
            </View>
          </View> */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
