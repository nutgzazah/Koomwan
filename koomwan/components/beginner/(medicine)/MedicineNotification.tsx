import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import BackButton from "../../../global/components/BackButton";
import { useRouter } from "expo-router";

const MedicineNotification = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showDayPicker, setShowDayPicker] = useState<boolean>(false);

  const days: string[] = [
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์",
    "วันอาทิตย์",
    "ทุกวัน",
  ];

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ): void => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setShowDayPicker(false);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <BackButton title="ย้อนกลับ" />
      <View className="flex-1">
        <Card>
          <Text className="text-headline text-secondary font-bold text-center mb-4">
            เพิ่มการแจ้งเตือน
          </Text>
          <BreakLine />

          {/* Day Selection */}
          <View className="w-full mb-4">
            <Text className="text-description text-secondary font-regular mb-2">
              วัน
            </Text>
            <View className="w-full border border-gray rounded-lg bg-background p-4">
              <TouchableOpacity
                className="w-full flex-row justify-between rounded-lg bg-background"
                onPress={() => setShowDayPicker(true)}
              >
                <Text className="text-description font-regular text-secondary">
                  {selectedDay || "เลือกวัน"}
                </Text>
                <Image
                  source={require("../../../assets/BeginnerSetup/calendar.png")}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Selection */}
          <View className="w-full mb-4">
            <Text className="text-description text-secondary font-regular mb-2">
              เวลา
            </Text>
            <TouchableOpacity
              className="w-full border flex-row justify-between border-gray rounded-lg bg-background p-4"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-description font-regular text-secondary">
                {formatTime(selectedTime)}
              </Text>
              <Image
                source={require("../../../assets/BeginnerSetup/clock.png")}
                className="w-6 h-6"
              />
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
              minimumDate={new Date(new Date().setHours(0, 0, 0))}
              maximumDate={new Date(new Date().setHours(23, 59, 0))}
            />
          )}

          {/* Add Button */}
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-md mt-4"
            onPress={() => router.back()}
          >
            <Text className="text-button text-card text-center font-bold">
              เพิ่ม
            </Text>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Bottom Sheet Modal for Day Selection */}
      <Modal
        visible={showDayPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDayPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-card rounded-t-3xl">
            {/* Handle bar */}
            <View className="items-center pt-2 pb-4">
              <View className="w-10 h-1 rounded-full bg-gray" />
            </View>

            <View className="px-6 pb-8">
              <Text className="text-headline text-secondary font-bold text-center mb-2 mt-1">
                เลือกวัน
              </Text>
              <BreakLine />

              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  className="flex-row items-center justify-between py-3"
                  onPress={() => handleDaySelect(day)}
                >
                  <Text className="text-description font-regular text-secondary">
                    {day}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedDay === day
                        ? "bg-primary border-primary"
                        : "border-gray"
                    } justify-center items-center`}
                  >
                    {selectedDay === day && (
                      <View className="w-3 h-3 rounded-full bg-card" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                className="mt-6 bg-primary py-4 rounded-md"
                onPress={() => setShowDayPicker(false)}
              >
                <Text className="text-button font-regular text-card text-center">
                  ตกลง
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MedicineNotification;
