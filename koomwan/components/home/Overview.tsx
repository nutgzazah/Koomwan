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
  isToday: boolean; // เพิ่ม property isToday เพื่อบ่งบอกว่าเป็นวันนี้
};

// ฟังก์ชันเพื่อรับวันที่ปัจจุบันแบบไทย (GMT+7)
const getCurrentThaiDate = (): Date => {
  const now = new Date();
  return now;
};

const Overview = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataItem[]>([]);
  const [hasRecords, setHasRecords] = useState(false);

  // Function to get text color based on BMI value
  const getBMIColor = (bmi: string | number) => {
    if (!bmi || bmi === "-") return "text-gray";
    const bmiValue = parseFloat(bmi.toString());
    const { color } = getBMICategory(bmiValue);
    return color;
  };

  // Process the records to get the last 7 days of data
  // ปรับปรุงฟังก์ชัน processRecords ให้ตรวจสอบทั้งยาประจำและยาเพิ่มเติม
  const processRecords = (
    healthRecords: any[] = [],
    regularPillData: any = {}
  ) => {
    const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const today = getCurrentThaiDate();

    // สร้างข้อมูลสำหรับ 7 วันล่าสุด
    const weekData: WeeklyDataItem[] = [];
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayIndex = currentDate.getDay();

      weekData.push({
        day: days[dayIndex],
        date: currentDate,
        bmi: "-",
        mood: "none" as Mood,
        hasPill: false,
        isToday: i === 0,
      });
    }

    // ตรวจสอบว่ามีข้อมูลใดๆ หรือไม่
    const hasHealthRecords = healthRecords && healthRecords.length > 0;
    const hasRegularPillData =
      regularPillData && Object.keys(regularPillData).length > 0;

    setHasRecords(hasHealthRecords || hasRegularPillData);

    if (!hasHealthRecords && !hasRegularPillData) {
      return weekData.reverse();
    }

    // ประมวลผลข้อมูลสุขภาพ (health records)
    if (hasHealthRecords) {
      // จัดกลุ่มข้อมูลสุขภาพตามวัน
      const healthRecordsByDay: { [key: string]: any[] } = {};
      healthRecords.forEach((record) => {
        const recordDate = new Date(record.recordtime).toDateString();
        if (!healthRecordsByDay[recordDate]) {
          healthRecordsByDay[recordDate] = [];
        }
        healthRecordsByDay[recordDate].push(record);
      });

      // อัปเดตข้อมูลในแต่ละวัน
      weekData.forEach((day) => {
        const dayDateString = day.date.toDateString();

        // ตรวจสอบข้อมูลสุขภาพ
        const dayHealthRecords = healthRecordsByDay[dayDateString] || [];
        if (dayHealthRecords.length > 0) {
          // เลือกบันทึกล่าสุดสำหรับ BMI และ mood
          const latestRecord = dayHealthRecords.sort(
            (a, b) =>
              new Date(b.recordtime).getTime() -
              new Date(a.recordtime).getTime()
          )[0];

          day.bmi = calculateBMI(
            latestRecord.weight,
            latestRecord.height
          ).toFixed(2);
          day.mood = latestRecord.moodstatus || "neutral";

          // ตรวจสอบยาเพิ่มเติมในทุกบันทึกของวันนั้น
          const hasAdditionPills = dayHealthRecords.some(
            (record) =>
              Array.isArray(record.additionpill) &&
              record.additionpill.length > 0
          );

          if (hasAdditionPills) {
            day.hasPill = true;
          }
        }
      });
    }

    // ประมวลผลข้อมูลยาประจำ (regular pill tracking)
    if (hasRegularPillData) {
      weekData.forEach((day) => {
        // ถ้ายังไม่มียา ให้ตรวจสอบยาประจำ
        if (!day.hasPill) {
          // แปลงวันที่เป็นรูปแบบ YYYY-MM-DD สำหรับเปรียบเทียบกับข้อมูลจาก API
          const formattedDate = formatDateToString(day.date);

          // ตรวจสอบว่ามีข้อมูลยาประจำในวันนั้นหรือไม่
          if (regularPillData[formattedDate]) {
            const dayPillData = regularPillData[formattedDate];

            // ตรวจสอบว่ามียาที่ทานแล้วในวันนั้นหรือไม่
            const hasTakenRegularPills = dayPillData.medications.some(
              (timeGroup: { medications: { taken: boolean }[] }) => {
                return timeGroup.medications.some((med) => med.taken === true);
              }
            );

            if (hasTakenRegularPills) {
              day.hasPill = true;
            }
          }
        }
      });
    }

    // กลับลำดับให้วันอาทิตย์อยู่ด้านซ้าย
    return weekData.reverse();
  };

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);

      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        console.error("Session expired or user not logged in");
        setLoading(false);
        return;
      }

      // แปลงข้อมูล
      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;
      const userHealthInfoId = auth.user.healthinfo;

      if (!userHealthInfoId) {
        throw new Error("Health information not found");
      }

      // 1. ดึงข้อมูลบันทึกสุขภาพ (มียาเพิ่มเติม - additionpill)
      console.log("Fetching health records...");
      const recordsResponse = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let regularPillData = {};

      try {
        // 2. ดึงข้อมูลยาประจำ (regularPillTracking)
        console.log("Fetching regular pill tracking data...");
        // ดึงข้อมูลยาประจำสำหรับช่วง 7 วันล่าสุด
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);

        const formattedToday = today.toISOString().split("T")[0];
        const formattedWeekAgo = weekAgo.toISOString().split("T")[0];

        const regularPillResponse = await axios.get(
          `${BASE_URL}/api/v1/regular-pills/range/${userId}?startDate=${formattedWeekAgo}&endDate=${formattedToday}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ถ้าการเรียก API สำเร็จ เก็บข้อมูล
        if (regularPillResponse.data && regularPillResponse.data.data) {
          regularPillData = regularPillResponse.data.data;
          console.log("Regular pill data fetched successfully");
        }
      } catch (pillError) {
        // ถ้าเกิดข้อผิดพลาดในการดึงข้อมูลยาประจำ ให้บันทึกข้อผิดพลาดแต่ยังดำเนินการต่อไป
        console.error("Error fetching regular pill data:", pillError);
        console.log("Continuing with health records only");
      }

      // ประมวลผลข้อมูลทั้งหมด
      const processedData = processRecords(
        recordsResponse.data.records || [],
        regularPillData
      );

      setWeeklyData(processedData);
    } catch (error) {
      setHasRecords(false);
      console.error("Error fetching data:", error);
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

  if (!hasRecords) {
    return (
      <Card>
        <Text className="text-title text-secondary font-regular">ภาพรวม</Text>
        <BreakLine />
        <Text className="text-body font-medium text-secondaryfont-regular mb-4">
          ยังไม่มีข้อมูลการบันทึกในสัปดาห์นี้
        </Text>
        <Text className="text-description font-regular text-secondary text-center mb-4">
          กรุณาบันทึกข้อมูลสุขภาพเพื่อดูข้อมูลรายสัปดาห์
        </Text>
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
            <Text
              className={`text-description font-regular ${
                item.isToday
                  ? "text-primary text-body font-bold"
                  : "text-secondary"
              } mb-2`}
            >
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
