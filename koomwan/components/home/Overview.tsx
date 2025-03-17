import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getEmotionImage } from "../../constant/emotion";
import { calculateBMI, getBMICategory } from "../../util/bmi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../config";
import Loading from "../../global/components/Loading";

// Define mood type
type Mood =
  | "laughing"
  | "happy"
  | "neutral"
  | "irritated"
  | "sick"
  | "crying"
  | "angry"
  | "none";

// Define weekly data type
type WeeklyDataItem = {
  day: string;
  date: Date;
  bmi: string | number;
  mood: Mood | string; // Allow any string to accommodate API responses
  hasPill: boolean;
};

// ฟังก์ชันเพื่อรับวันที่ปัจจุบันแบบไทย (GMT+7)
const getCurrentThaiDate = (): Date => {
  const now = new Date();
  // เพิ่ม 7 ชั่วโมงเพื่อปรับเป็นเวลาไทย (GMT+7)
  return new Date(now.getTime() + 7 * 60 * 60 * 1000);
};

const Overview = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataItem[]>([]);

  // Function to get text color based on BMI value
  const getBMIColor = (bmi: string | number) => {
    if (!bmi || bmi === "-") return "text-gray";
    const bmiValue = parseFloat(bmi.toString());
    const { color } = getBMICategory(bmiValue);
    return color;
  };

  // Process the records to get the last 7 days of data
  const processRecords = (records: any[]) => {
    const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    // ใช้เวลาไทย (GMT+7) แทนเวลาเครื่อง
    const today = getCurrentThaiDate();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Create an array of the last 7 days (including today)
    const weekData: WeeklyDataItem[] = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = (dayOfWeek - i + 7) % 7; // Calculate the day of week (wrapping around)
      weekData.unshift({
        day: days[dayIndex],
        date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000),
        bmi: "-",
        mood: "none" as Mood,
        hasPill: false,
      });
    }

    // Map the records to the days
    if (records && records.length > 0) {
      records.forEach((record) => {
        // ปรับเวลาของข้อมูลให้เป็น GMT+7 เช่นกัน
        const recordTime = new Date(record.recordtime);
        const recordDateThai = new Date(
          recordTime.getTime() + 7 * 60 * 60 * 1000
        );

        // Only consider records from the last 7 days
        weekData.forEach((day) => {
          // เปรียบเทียบเฉพาะวันที่ เดือน ปี (ไม่รวมเวลา)
          const recordDate = recordDateThai.toDateString();
          const dayDate = day.date.toDateString();

          if (recordDate === dayDate) {
            day.bmi = calculateBMI(record.weight, record.height).toFixed(2);
            // Handle the mood from the API - ensure it's a valid Mood type if possible
            day.mood = record.moodstatus || "neutral";
            // Check if any pills were taken that day
            day.hasPill = record.additionpill && record.additionpill.length > 0;
          }
        });
      });
    }

    // Reverse to display Sunday first
    return weekData.reverse();
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);

      // Get auth data from local storage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        console.error("Session expired or user not logged in");
        setLoading(false);
        return;
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;
      const userHealthInfoId = auth.user.healthinfo;

      console.log("User ID:", userId);
      console.log("Health Info ID:", userHealthInfoId);

      if (!userHealthInfoId) {
        throw new Error("Health information not found");
      }

      console.log("Fetching records from API...");
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.status);
      console.log("Records count:", response.data.records?.length || 0);

      // Process the data
      const processedData = processRecords(response.data.records);
      console.log("Processed weekly data:", processedData);
      setWeeklyData(processedData);
    } catch (error) {
      console.error("Error fetching emotion data:", error);
      Alert.alert("Error", "Failed to load emotion data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when screen comes into focus
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      return () => {
        // Optional cleanup
      };
    }, [])
  );

  if (loading) {
    return (
      <Card>
        <Text className="text-title text-secondary font-regular">ภาพรวม</Text>
        <BreakLine />
        <Loading />
      </Card>
    );
  }

  return (
    <Card>
      <Text className="text-title text-secondary font-regular">ภาพรวม</Text>
      <BreakLine />

      {/* Emotion Grid */}
      <View className="flex-row justify-between w-full mb-8">
        {weeklyData.map((item, index) => (
          <View key={index} className="items-center">
            {/* Emotion Icon */}
            <View className="w-12 h-12 items-center justify-center mb-2">
              <Image
                source={getEmotionImage(item.mood as Mood)}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </View>

            {/* BMI Value */}
            <Text
              className={`text-tag font-regular mb-2`}
              style={{ color: getBMIColor(item.bmi) }}
            >
              {item.bmi}
            </Text>

            {/* Day */}
            <Text className="text-description font-regular text-secondary mb-2">
              {item.day}
            </Text>

            {/* Pill Indicator */}
            {item.hasPill && (
              <View className="w-6 h-6">
                <Image
                  source={require("../../assets/Home/medicine.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Calendar Button */}
      <TouchableOpacity
        className="w-full bg-primary py-4 rounded-lg flex-row justify-center items-center"
        onPress={() => router.push("/home/calendarView")}
      >
        <Text className="text-button font-bold text-card mr-2">
          มุมมองปฏิทิน
        </Text>
        <Image
          source={require("../../assets/Home/calendar.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Card>
  );
};

export default Overview;
