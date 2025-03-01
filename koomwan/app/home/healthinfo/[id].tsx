import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import EmotionDisplay from "../../../components/home/healthinfo/EmotionDisplay";
import { calculateBMI, getBMICategory } from "../../utils/bmi";
import BMISection from "../../../components/home/healthinfo/BMISection";

type HealthLogData = {
  date: string;
  time: string;
  mood?:
    | "laughing"
    | "happy"
    | "neutral"
    | "irritated"
    | "sick"
    | "crying"
    | "angry"
    | "none";
  weight?: number;
  height?: number;
  blood_pressure?: string;
  blood_sugar_level?: number;
  a1c?: number;
  medications?: Array<{
    pill_name: string;
    pill_id: number;
  }>;
};

const CalendarHealthScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data - ในการใช้งานจริงดึงข้อมูลตาม id ที่ได้รับมา
  const mockHealthDetails: { [key: string]: HealthLogData } = {
    "1": {
      date: "4 ธันวาคม พ.ศ. 2567",
      time: "13.32 น.",
      mood: "happy",
      weight: 70,
      height: 168,
      blood_pressure: "120",
      blood_sugar_level: 78,
      a1c: 4.8,
      medications: [
        { pill_name: "พาราเซตามอล", pill_id: 3 },
        { pill_name: "Metformin", pill_id: 2 },
      ],
    },
    "2": {
      date: "4 ธันวาคม พ.ศ. 2567",
      time: "08.17 น.",
      mood: "none",
      weight: 85,
      height: 180,
      a1c: 7.1,
      medications: [{ pill_name: "Glipizide", pill_id: 1 }],
    },
    "3": {
      date: "12 ธันวาคม พ.ศ. 2567",
      time: "18.00 น.",
      mood: "crying",
      medications: [],
    },
  };

  const healthData = mockHealthDetails[id as string];

  // Calculate BMI
  const bmi =
    healthData.height && healthData.weight
      ? calculateBMI(healthData.weight, healthData.height)
      : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  if (!healthData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView showsVerticalScrollIndicator={false}>
          <BackButton title="มุมมองปฏิทิน" />
          <View className="items-center justify-center h-64">
            <Text className="text-headline text-secondary font-regular">
              ไม่พบข้อมูลสุขภาพ
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="มุมมองปฏิทิน" />

        <Card>
          <View className="w-full">
            <Text className="text-headline text-secondary font-medium text-center py-4">
              วันที่ {healthData.date}
            </Text>
            <Text className="text-description text-secondary font-regular text-center mt-1">
              เวลา {healthData.time}
            </Text>

            <BreakLine />

            <EmotionDisplay mood={healthData.mood || "none"} />

            <BreakLine />
            <View className="items-center mt-2">
              <Text className="text-headline text-secondary font-medium mb-4 ">
                ข้อมูลที่บันทึก
              </Text>
            </View>

            {/* น้ำหนัก */}
            <View className="flex-row flex-wrap items-center justify-evenly px-2 ">
              {healthData.weight ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-e-none py-4 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/weight.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-body text-primary font-regular ml-2">
                      {healthData.weight} กก.
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    น้ำหนัก
                  </Text>
                </View>
              ) : (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-e-none py-4 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/weight.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      ไม่พบข้อมูล
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    น้ำหนัก
                  </Text>
                </View>
              )}

              {/* ความสูง */}
              {healthData.height ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-s-none py-4 px-1 items-center">
                  <View className="flex-row items-center ">
                    <Image
                      source={require("../../../assets/Home/height.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-body text-primary font-regular ml-2">
                      {healthData.height} ซม.
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    ส่วนสูง
                  </Text>
                </View>
              ) : (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-s-none py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/height.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      ไม่พบข้อมูล
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    ส่วนสูง
                  </Text>
                </View>
              )}

              {/* น้ำตาลในเลือด */}
              {healthData.blood_sugar_level ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-e-none py-4 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/glucose-blue.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      {healthData.blood_sugar_level} มก./ดล.
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    น้ำตาล
                  </Text>
                </View>
              ) : (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-e-none py-4 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/glucose-blue.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      ไม่พบข้อมูล
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    น้ำตาล
                  </Text>
                </View>
              )}

              {/* ความดันเลือด */}
              {healthData.blood_pressure ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-s-none py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/blood-pressure.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      {healthData.blood_pressure} มม.ปรอท
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    ความดันเลือด
                  </Text>
                </View>
              ) : (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-s-none py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/blood-pressure.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      ไม่พบข้อมูล
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular ml-10">
                    ความดันเลือด
                  </Text>
                </View>
              )}

              {healthData.a1c ? (
                <View className="w-full mb-6 bg-background rounded-[10px] py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/a1c.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-body text-primary font-regular ml-2">
                      {healthData.a1c} %
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular items-center">
                    น้ำตาลเฉลี่ยสะสม
                  </Text>
                </View>
              ) : (
                <View className="w-full mb-6 bg-background rounded-[10px] py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/a1c.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      ไม่พบข้อมูล
                    </Text>
                  </View>
                  <Text className="text-tag text-secondary font-regular items-center">
                    น้ำตาลเฉลี่ยสะสม
                  </Text>
                </View>
              )}
            </View>

            <BMISection bmi={bmi} bmiCategory={bmiCategory} />

            <BreakLine />

            <View className="items-center mt-2">
              <Text className="text-headline text-secondary font-medium mb-4">
                ระดับน้ำตาลในเลือดของฉัน
              </Text>
            </View>

            {healthData.blood_sugar_level ? (
              <View className="items-center mb-6">
                <Image
                  source={require("../../../assets/Home/a1c-blue.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
                <Text className="text-description text-secondary font-regular">
                  {healthData.blood_sugar_level} มก./ดล.
                </Text>
              </View>
            ) : (
              <View className="items-center mb-6">
                <Image
                  source={require("../../../assets/Home/a1c-none.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
                <Text className="text-headline text-secondary font-bold text-center">
                  ไม่มีการบันทึก
                </Text>
                <Text className="text-description text-secondary font-regular text-center mt-2">
                  ยังไม่มีข้อมูลการบันทึกระดับน้ำตาลในเลือด
                </Text>
              </View>
            )}

            <BreakLine />

            <View className="items-center mt-2">
              <Text className="text-headline text-secondary font-medium mb-4">
                ยาเพิ่มเติมของฉัน
              </Text>
            </View>

            {healthData.medications && healthData.medications.length > 0 ? (
              healthData.medications.map((med, index) => (
                <View
                  key={index}
                  className="w-full flex-row justify-between items-center px-4 py-1 mb-2"
                >
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/medicine.png")}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                    <Text className="text-description font-regular ml-2">
                      {med.pill_name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/home/med/detail",
                        params: { pill_name: med.pill_name },
                      })
                    }
                  >
                    <Text className="text-description text-primary font-bold">
                      รายละเอียดยา
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="items-center py-2 mb-4">
                <Text className="text-description text-secondary font-regular">
                  ไม่มีข้อมูลยาเพิ่มเติม
                </Text>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarHealthScreen;
