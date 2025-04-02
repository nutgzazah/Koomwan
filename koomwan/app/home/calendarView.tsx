import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Image } from "react-native";
import BackButton from "../../global/components/BackButton";
import Card from "../../global/components/Card";
import Checkbox from "expo-checkbox";
import BreakLine from "../../global/components/BreakLine";
import { useRouter } from "expo-router";
import { getEmotionImage } from "../../constant/emotion";
import { calculateBMI } from "../../util/bmi";
import { useCalendarData, HealthLog } from "../../hooks/useCalendar";
import Loading from "../../global/components/Loading";
import {
  getTodayLocalDate,
  isDateInPast,
  formatTimeToThai,
} from "../../util/date";

const CalendarScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
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

  // ใช้ hook ที่สร้างขึ้นเพื่อจัดการข้อมูลปฏิทิน
  const {
    loading,
    refreshing,
    markedDates,
    dayData,
    error,
    refreshCalendarData,
    handlePillStatusChange,
  } = useCalendarData();
  useFocusEffect(
    React.useCallback(() => {
      setSelectedDate(getTodayLocalDate());
      refreshCalendarData();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const checkDateInterval = setInterval(() => {
      const currentDate = getTodayLocalDate();
      if (currentDate !== selectedDate) {
        setSelectedDate(currentDate);
        refreshCalendarData();
      }
    }, 3600000);

    return () => clearInterval(checkDateInterval);
  }, [selectedDate]);

  // แสดงข้อผิดพลาด (ถ้ามี)
  if (error) {
    Alert.alert("ข้อผิดพลาด", error);
  }

  // เมื่อกดเลือกวันในปฏิทิน
  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // ดึงข้อมูลของวันที่เลือก
  const getSelectedDayData = () => {
    return dayData[selectedDate] || { medications: [], healthLogs: [] };
  };

  // ไปยังหน้ารายละเอียดยา
  const navigateToPillDetail = (pillId: string, pillName: string) => {
    router.push({
      pathname: "/profile/(med)/(medDetail)/[id]",
      params: { id: pillId, pill_name: pillName },
    });
  };

  // แสดงรายการยาประจำ
  const renderMedicationLogs = () => {
    const selectedDayData = getSelectedDayData();
    const isPastDate = isDateInPast(selectedDate);

    console.log(
      "Selected day medications:",
      JSON.stringify(selectedDayData.medications)
    );
    if (
      !selectedDayData.medications ||
      selectedDayData.medications.length === 0
    ) {
      return null;
    }

    return (
      <View className="mt-4">
        <Card>
          <Text className="text-headline font-medium text-secondary">
            ยาประจำ
          </Text>
          <BreakLine />
          {selectedDayData.medications.map((medicationLog, timeIndex) => (
            <View
              key={`medication-time-${selectedDate}-${medicationLog.time}-${timeIndex}`}
              className="mb-4 justify-between"
            >
              <Text className="text-description text-secondary mb-2 font-regular">
                เวลา {medicationLog.time}
              </Text>
              {medicationLog.medications.map((medication, medIndex) => (
                <View
                  key={`${selectedDate}-${medicationLog.time}-${medication.id}-${medIndex}`}
                  className="flex-row items-center justify-between mt-2 gap-8"
                >
                  <View className="flex-row items-center">
                    <Checkbox
                      value={medication.taken}
                      disabled={isPastDate || medication.isPastMedication}
                      className={`w-6 h-6 rounded border ${
                        isPastDate || medication.isPastMedication
                          ? "opacity-60"
                          : ""
                      }`}
                      color={medication.taken ? "#3972F0" : "#F8F8F8"}
                      onValueChange={(newValue) =>
                        !isPastDate && !medication.isPastMedication
                          ? handlePillStatusChange(
                              medication.id,
                              selectedDate,
                              medicationLog.time,
                              newValue
                            )
                          : null
                      }
                    />
                    <Image
                      source={require("../../assets/Home/medicine.png")}
                      className="w-6 h-6 ml-2"
                    />
                    <Text className="text-description text-secondary font-regular ml-2">
                      {medication.name || "ไม่ระบุชื่อยา"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigateToPillDetail(
                        medication.id,
                        medication.name || "ไม่ระบุชื่อยา"
                      )
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
          {isPastDate && (
            <Text className="text-tag font-regular text-secondary opacity-60 text-center mt-2">
              *ไม่สามารถเปลี่ยนแปลงสถานะยาของวันที่ผ่านมาได้
            </Text>
          )}
        </Card>
      </View>
    );
  };

  // แสดงรายการบันทึกสุขภาพ
  const renderHealthLog = (log: HealthLog, index: number) => (
    <TouchableOpacity
      key={`health-log-${log.id}-${index}`}
      onPress={() =>
        router.push({
          pathname: "/home/healthinfo/[id]",
          params: { id: log.id },
        })
      }
    >
      <Card>
        <View className="justify-between p-2">
          <View className="flex-row justify-between">
            <Text className="text-description text-secondary font-regular">
              เวลา{" "}
              {log.time.endsWith(" น.")
                ? log.time
                : `${formatTimeToThai(log.time)}`}
            </Text>
            {log.mood && log.mood !== "none" && (
              <Image
                source={getEmotionImage(log.mood)}
                className="w-8 h-8"
                resizeMode="contain"
              />
            )}
          </View>

          <View className="flex-row flex-wrap justify-center gap-4 mt-4 items-center">
            {log.weight && log.height && (
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Home/body-blue.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary font-regular ml-1">
                  {calculateBMI(log.weight, log.height).toFixed(2)}
                </Text>
              </View>
            )}
            {log.blood_pressure && (
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Home/blood-pressure.png")}
                  className="w-6 h-6"
                />
                <Text className="text-description text-secondary font-regular ml-1">
                  {log.blood_pressure.systolic}/{log.blood_pressure.diastolic}
                </Text>
              </View>
            )}
            {log.blood_sugar_level && (
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Home/glucose-blue.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-description text-secondary font-regular ml-1">
                  {log.blood_sugar_level}
                </Text>
              </View>
            )}
            {log.a1c && (
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Home/a1c.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-description text-secondary font-regular ml-1">
                  {log.a1c}
                </Text>
              </View>
            )}
            {/* แสดงไอคอนยาเพิ่มเติม (additional pills) ถ้ามี */}
            {log.additionalPills && log.additionalPills.length > 0 && (
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/Home/medicine.png")}
                  className="w-6 h-6"
                />
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  // แสดงข้อความเมื่อไม่มีข้อมูล
  const renderEmptyState = () => (
    <View className="justify-center items-center mt-8">
      <Image
        source={require("../../assets/Home/none.png")}
        className="w-16 h-16"
      />
      <Text className="text-body text-secondary font-bold text-center mt-4">
        ไม่มีการบันทึกในวันนี้
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshCalendarData}
          />
        }
      >
        <BackButton title="หน้าหลัก" />
        <View className="mx-2 py-2">
          <View className="rounded-[10px] overflow-hidden">
            <Calendar
              current={selectedDate}
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#3972F0",
                  ...(markedDates[selectedDate] || {}),
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
                textDayFontSize: 16,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 14,
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

          {loading ? (
            <Loading />
          ) : (
            <View className="mt-4">
              <Text className="text-body font-regular text-secondary px-4">
                {new Date(selectedDate).toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  era: "short",
                })}
              </Text>

              {renderMedicationLogs()}

              {getSelectedDayData().healthLogs &&
              getSelectedDayData().healthLogs.length > 0
                ? getSelectedDayData().healthLogs.map((log, index) =>
                    renderHealthLog(log, index)
                  )
                : !getSelectedDayData().medications?.length &&
                  renderEmptyState()}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
