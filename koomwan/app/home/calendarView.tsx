import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Image } from "react-native";
import BackButton from "../../global/components/BackButton";
import Card from "../../global/components/Card";
import Checkbox from "expo-checkbox";
import BreakLine from "../../global/components/BreakLine";
import { useRouter } from "expo-router";

type MedicationLog = {
  time: string;
  medications: Array<{
    id: number;
    name: string;
    taken: boolean;
  }>;
};

type HealthLog = {
  id: number;
  time: string;
  height?: number;
  weight?: number;
  blood_sugar_level?: number;
  blood_pressure?: string;
  a1c?: number;
  mood?: "laugh" | "happy" | "none" | "cried" | "frustrated";
};

type DayData = {
  medications: MedicationLog[];
  healthLogs: HealthLog[];
};

const CalendarScreen = () => {
  const router = useRouter();
  // ตั้งค่าภาษาไทย
  LocaleConfig.locales["th"] = {
    monthNames: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    monthNamesShort: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    dayNames: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
    dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
  };
  LocaleConfig.defaultLocale = "th";

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: {
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
    };
  }>({});
  const [dayData, setDayData] = useState<DayData>({
    medications: [],
    healthLogs: [],
  });

  // Mock data
  const mockMarkedDates = {
    "2025-03-02": { marked: true, dotColor: "#3972F0" },
    "2025-03-04": { marked: true, dotColor: "#3972F0" },
  };

  const calculateBMI = (weight: number, height: number): number => {
    // Convert height to meters if it's in centimeters
    const heightInMeters = height > 3 ? height / 100 : height;
    return weight / (heightInMeters * heightInMeters);
  };

  // Function to get emotion image based on mood
  const getEmotionImage = (
    mood: "laugh" | "happy" | "none" | "cried" | "frustrated"
  ) => {
    const emotionMap: {
      [key in "laugh" | "happy" | "none" | "cried" | "frustrated"]: any;
    } = {
      laugh: require("../../assets/Home/emotion-laugh.png"),
      happy: require("../../assets/Home/emotion-happy.png"),
      none: require("../../assets/Home/emotion-none.png"),
      cried: require("../../assets/Home/emotion-cried.png"),
      frustrated: require("../../assets/Home/emotion-frustrated.png"),
    };
    return emotionMap[mood] || emotionMap.none;
  };

  const mockDayData: { [key: string]: DayData } = {
    "2025-03-02": {
      medications: [
        {
          time: "8.30 น.",
          medications: [
            { id: 1, name: "Glipizide", taken: true },
            { id: 2, name: "Metformin", taken: true },
          ],
        },
        {
          time: "12.30 น.",
          medications: [{ id: 3, name: "Glipizide", taken: false }],
        },
      ],
      healthLogs: [
        {
          id: 1,
          time: "13.32 น.",
          weight: 58,
          height: 160,
          blood_pressure: "78",
          mood: "happy",
          blood_sugar_level: 120,
          a1c: 6.5,
        },
        {
          id: 2,
          time: "08.17 น.",
          weight: 85,
          height: 180,
          mood: "none",
          a1c: 7.1,
        },
        {
          id: 3,
          time: "20.00 น.",
          weight: 70,
          height: 170,
          blood_sugar_level: 150,
          mood: "cried",
        },
      ],
    },
  };

  useEffect(() => {
    setMarkedDates(mockMarkedDates);
  }, []);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setDayData(
      mockDayData[day.dateString] || { medications: [], healthLogs: [] }
    );
  };

  const renderMedicationGroup = (medicationLog: MedicationLog) => (
    <Card key={medicationLog.time}>
      <View className="space-y-2">
        <Text className="text-description text-secondary font-regular px-2">
          เวลา {medicationLog.time}
        </Text>
        {medicationLog.medications.map((medication) => (
          <View
            key={`${medicationLog.time}-${medication.name}`}
            className="flex-row items-center justify-between mt-2"
          >
            <View className="flex-row items-center gap-2">
              <Checkbox
                value={medication.taken}
                className="w-6 h-6 rounded border"
                color={medication.taken ? "#3972F0" : "#CBCBCB"}
              />
              <Image
                source={require("../../assets/Home/medicine.png")}
                className="w-6 h-6"
              />
              <Text className="text-description text-secondary font-regular">
                {medication.name}
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary text-description font-regular">
                รายละเอียดยา
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Card>
  );

  const renderHealthLog = (log: HealthLog) => (
    <TouchableOpacity
      key={log.time}
      onPress={() =>
        router.push({
          pathname: "/home/healthinfo/[id]",
          params: { id: log.id },
        })
      }
    >
      <Card>
        <View className="justify-between">
          <Card>
            <View className="flex-row justify-between items-center gap-8 my-[-16px]">
              <Text className="text-description text-secondary font-regular ">
                เวลา {log.time}
              </Text>
              {log.mood && (
                <Image
                  source={getEmotionImage(log.mood)}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              )}
            </View>
          </Card>

          <View className="flex-row flex-wrap gap-4 my-[-8px]">
            {log.weight && log.height && (
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/Home/body-blue.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary font-regular">
                  {calculateBMI(log.weight, log.height).toFixed(2)}
                </Text>
              </View>
            )}
            {log.blood_pressure && (
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/Home/blood-pressure.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary font-regular">
                  {log.blood_pressure}
                </Text>
              </View>
            )}
            {log.blood_sugar_level && (
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/Home/glucose-blue.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-description text-secondary font-regular">
                  {log.blood_sugar_level}
                </Text>
              </View>
            )}
            {log.a1c && (
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/Home/a1c.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-description text-secondary font-regular">
                  {log.a1c}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="หน้าหลัก" />
        <View className=" mx-2 py-2">
          <View className="rounded-[10px] overflow-hidden ">
            <Calendar
              current={selectedDate}
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#3972F0",
                  ...markedDates[selectedDate],
                },
              }}
              theme={{
                backgroundColor: "#F8F8F8",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#FFFFFFFF",
                selectedDayBackgroundColor: "#3972F0",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#3972F0",
                dayTextColor: "#3E3B5B",
                textDisabledColor: "#d9e1e8",
                dotColor: "#FE5757",
                selectedDotColor: "#ffffff",
                arrowColor: "#FFFFFFFF",
                monthTextColor: "#FFFFFFFF",
                textDayFontFamily: "K2D-Regular",
                textMonthFontFamily: "K2D-Bold",
                textDayHeaderFontFamily: "K2D-Medium",
                textDayFontSize: 16, // เพิ่มขนาดตัวอักษรวันที่
                textMonthFontSize: 20, // เพิ่มขนาดตัวอักษรเดือน
                textDayHeaderFontSize: 14, // เพิ่มขนาดตัวอักษรหัวข้อวัน
                borderRadius: 10,
              }}
              enableSwipeMonths={true}
              headerStyle={{
                backgroundColor: "#3972F0",
                borderBottomWidth: 0,
                borderTopWidth: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                fontSize: 16,
              }}
            />
          </View>
          <View className="mt-4">
            <Text className="text-headline font-regular text-secondary px-4">
              {new Date(selectedDate).toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            {dayData.medications.length > 0 ? (
              <View className="mt-4">
                <Card>
                  <Text className="text-headline font-medium text-secondary ">
                    ยาประจำ
                  </Text>
                  <BreakLine />
                  {dayData.medications.map((medicationLog) => (
                    <View
                      key={medicationLog.time}
                      className="mb-4 justify-between"
                    >
                      <Text className="text-description text-secondary mb-2 font-regular">
                        เวลา {medicationLog.time}
                      </Text>
                      {medicationLog.medications.map((medication) => (
                        <View
                          key={`${medicationLog.time}-${medication.name}`}
                          className="flex-row items-center justify-between mt-2 gap-8"
                        >
                          <View className="flex-row items-center gap-2 justify-between">
                            <Checkbox
                              value={medication.taken}
                              className="w-6 h-6 rounded border"
                              color={medication.taken ? "#3972F0" : "#F8F8F8"}
                            />
                            <Image
                              source={require("../../assets/Home/medicine.png")}
                              className="w-6 h-6"
                            />
                            <Text className="text-description text-secondary font-regular">
                              {medication.name}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              router.push({
                                pathname: `/home/med/[id]`,
                                params: {
                                  pill_id: medication.id,
                                  pill_name: medication.name,
                                },
                              })
                            }
                          >
                            <Text className="text-primary text-description font-regular">
                              รายละเอียดยา
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ))}
                </Card>
              </View>
            ) : null}

            {dayData.healthLogs.length > 0 ? (
              dayData.healthLogs.map(renderHealthLog)
            ) : (
              <View className="justify-center items-center mt-8">
                <Image
                  source={require("../../assets/Home/none.png")}
                  className="w-16 h-16"
                />
                <Text className="text-description text-secondary font-bold text-center mt-4">
                  ไม่มีการบันทึก
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
