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

import { useHealthRecord } from "../../../hooks/useHealthRecord";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import EmotionDisplay from "../../../components/home/healthinfo/EmotionDisplay";
import { calculateBMI, getBMICategory } from "../../../util/bmi";
import BMISection from "../../../components/home/healthinfo/BMISection";
import Loading from "../../../global/components/Loading";

const CalendarHealthScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { loading, record, error } = useHealthRecord(id as string);

  // For debugging
  React.useEffect(() => {
    if (record) {
      console.log("Rendering with record:", record);
    }
    if (error) {
      console.log("Error in component:", error);
    }
  }, [record, error]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <BackButton title="มุมมองปฏิทิน" />
        <Loading />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !record) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView showsVerticalScrollIndicator={false}>
          <BackButton title="มุมมองปฏิทิน" />
          <View className="items-center justify-center h-64">
            <Image
              source={require("../../../assets/Home/none.png")}
              className="w-16 h-16 mb-4"
            />
            <Text className="text-headline text-secondary font-regular">
              {error || "ไม่พบข้อมูลสุขภาพ"}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Calculate BMI
  const bmi =
    record.height &&
    record.weight &&
    !isNaN(record.height) &&
    !isNaN(record.weight)
      ? calculateBMI(record.weight, record.height)
      : null;

  // Get BMI category with text and color
  const bmiCategory = bmi && !isNaN(bmi) ? getBMICategory(bmi) : null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="มุมมองปฏิทิน" />

        <Card>
          <View className="w-full">
            <Text className="text-headline text-secondary font-medium text-center py-4">
              วันที่ {record.date}
            </Text>
            <Text className="text-description text-secondary font-regular text-center mt-1">
              เวลา {record.time}
            </Text>

            <BreakLine />

            <EmotionDisplay mood={record.mood || "none"} />

            <BreakLine />
            <View className="items-center mt-2">
              <Text className="text-headline text-secondary font-medium mb-4 ">
                ข้อมูลที่บันทึก
              </Text>
            </View>

            {/* น้ำหนัก */}
            <View className="flex-row flex-wrap items-center justify-evenly px-2 ">
              {record.weight && !isNaN(record.weight) ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-e-none py-4 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/weight.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-body text-primary font-regular ml-2">
                      {record.weight} กก.
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
              {record.height && !isNaN(record.height) ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-s-none py-4 px-1 items-center">
                  <View className="flex-row items-center ">
                    <Image
                      source={require("../../../assets/Home/height.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-body text-primary font-regular ml-2">
                      {record.height} ซม.
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
              {record.blood_sugar_level && !isNaN(record.blood_sugar_level) ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-e-none py-4 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/glucose-blue.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      {record.blood_sugar_level} มก./ดล.
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
              {record.blood_pressure &&
              record.blood_pressure.systolic &&
              record.blood_pressure.diastolic &&
              !isNaN(record.blood_pressure.systolic) &&
              !isNaN(record.blood_pressure.diastolic) ? (
                <View className="w-1/2 mb-6 bg-background rounded-[10px] rounded-s-none py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/blood-pressure.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-description text-primary font-regular ml-2">
                      {record.blood_pressure.systolic}/
                      {record.blood_pressure.diastolic} มม.ปรอท
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

              {record.a1c && !isNaN(record.a1c) ? (
                <View className="w-full mb-6 bg-background rounded-[10px] py-4 px-1 items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/a1c.png")}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="text-body text-primary font-regular ml-2">
                      {record.a1c} %
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

            {record.blood_sugar_level && !isNaN(record.blood_sugar_level) ? (
              <View className="items-center mb-6">
                <Image
                  source={require("../../../assets/Home/a1c-blue.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
                <Text className="text-description text-secondary font-regular">
                  {record.blood_sugar_level} มก./ดล.
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

            {record.medications &&
            Array.isArray(record.medications) &&
            record.medications.length > 0 ? (
              record.medications.map((med, index) => (
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
                        pathname: "/profile/(med)/(medDetail)/[id]",
                        params: { id: med.pill_id, pill_name: med.pill_name },
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
