import React, { useState, useEffect } from "react";
import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import BreakLine from "../../../global/components/BreakLine";
import Loading from "../../../global/components/Loading";

type AdditionalPill = {
  pill_id: string;
  pill_name: string;
  pill_type: string;
  description: string;
  pill_image?: string | null;
};

export default function MedicationDetail() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pillData, setPillData] = useState<AdditionalPill | null>(null);

  // Extract parameters from route
  const id = params.id as string;
  const pill_name = params.pill_name as string;
  const pill_type = params.pill_type as string;
  const description = params.description as string;
  const pill_image = params.pill_image as string;

  useEffect(() => {
    try {
      // Instead of fetching, use the params
      if (id) {
        const pill: AdditionalPill = {
          pill_id: id,
          pill_name: pill_name || "ไม่มีชื่อยา",
          pill_type: pill_type || "ไม่ระบุประเภท",
          description: description || "ไม่มีรายละเอียด",
          pill_image: pill_image || null,
        };

        setPillData(pill);
      } else {
        setError("ไม่พบข้อมูล ID ยา");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error loading medication data:", err);
    } finally {
      setLoading(false);
    }
  }, [id, pill_name, pill_type, description, pill_image]);

  if (loading) {
    return <Loading />;
  }

  if (error || !pillData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <BackButton title="ย้อนกลับ" />
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../../assets/Home/none.png")}
            className="w-16 h-16 mb-4"
          />
          <Text className="text-description text-secondary font-regular">
            {error || "ไม่พบข้อมูลยา"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackButton title="ข้อมูลยา" />

      <ScrollView className="flex-1 px-4">
        <Card>
          <Text className="flex-1 text-headline text-secondary font-bold text-center">
            ยาเพิ่มเติม
          </Text>
          <BreakLine />

          {/* Pill Image */}
          <View className="w-full h-40 bg-background rounded-lg items-center justify-center border border-gray">
            {pillData.pill_image ? (
              <Image
                source={{ uri: pillData.pill_image }}
                className="w-full h-full p-1"
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
              <Text className="text-description font-regular text-secondary">
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
            <View className="w-full bg-background border border-gray rounded p-2 px-4 text-description font-regular min-h-24">
              <Text className="text-description text-secondary font-regular">
                {pillData.description}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
