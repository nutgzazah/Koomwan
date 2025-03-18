import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Alert } from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import axios from "axios";
import BASE_URL from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import Loading from "../../global/components/Loading";

interface BloodSugarData {
  bloodsugar: number;
  a1c: number;
  recordtime: string;
}

interface Record {
  _id: string;
  recordtime: string;
  bloodsugar?: number;
  a1c?: number;
  [key: string]: any;
}

interface BloodSugarStatusProps {
  userId?: string; // Optional if using stored user data
  healthInfoId?: string; // Optional if using stored health info
}

const BloodSugarStatus: React.FC<BloodSugarStatusProps> = ({
  userId,
  healthInfoId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bloodSugarData, setBloodSugarData] = useState<BloodSugarData | null>(
    null
  );
  const [status, setStatus] = useState<"none" | "normal" | "risk" | "diabetes">(
    "none"
  );

  // Fetch blood sugar data function
  const fetchBloodSugarData = async () => {
    try {
      setLoading(true);

      // Get auth data from local storage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
        setLoading(false);
        return;
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      const currentUserId = userId || auth.user._id;

      // Use API
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the API request was successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch blood sugar data"
        );
      }

      if (response.data.records.length > 0) {
        // Sort records by date to get the most recent
        const sortedRecords = response.data.records.sort(
          (a: Record, b: Record) =>
            new Date(b.recordtime).getTime() - new Date(a.recordtime).getTime()
        );

        const latestRecord = sortedRecords[0];

        // Check if we have bloodsugar or a1c data
        if (
          latestRecord.bloodsugar !== undefined ||
          latestRecord.a1c !== undefined
        ) {
          setBloodSugarData({
            bloodsugar: latestRecord.bloodsugar,
            a1c: latestRecord.a1c,
            recordtime: latestRecord.recordtime,
          });

          // Determine status based on blood sugar levels
          if (latestRecord.bloodsugar) {
            if (latestRecord.bloodsugar < 100) {
              setStatus("normal");
            } else if (
              latestRecord.bloodsugar >= 100 &&
              latestRecord.bloodsugar < 126
            ) {
              setStatus("risk");
            } else if (latestRecord.bloodsugar >= 126) {
              setStatus("diabetes");
            }
          } else if (latestRecord.a1c) {
            // If bloodsugar is not available, use A1C if available
            if (latestRecord.a1c < 5.7) {
              setStatus("normal");
            } else if (latestRecord.a1c >= 5.7 && latestRecord.a1c < 6.5) {
              setStatus("risk");
            } else if (latestRecord.a1c >= 6.5) {
              setStatus("diabetes");
            }
          } else {
            setStatus("none");
          }
        } else {
          setStatus("none");
        }
      } else {
        setStatus("none");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching blood sugar data:", error);

      // Handle unauthorized access
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log("Session Expired", "Please login again");
        AsyncStorage.removeItem("@auth");
        /* router.push("/user/login"); */
      } else {
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      }

      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchBloodSugarData();
  }, [userId, healthInfoId]);

  // Refresh data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBloodSugarData();
      return () => {
        // Optional cleanup if needed
      };
    }, [userId, healthInfoId])
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "ไม่มีข้อมูล";

    // สร้าง Date object จากค่าที่รับเข้ามา
    const date = new Date(dateString);

    // ปรับเวลาให้เป็น GMT+7 (เวลาประเทศไทย)
    const bangkokTime = new Date(date);

    // ชื่อวันภาษาไทย
    const thaiDays = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];

    // ชื่อเดือนภาษาไทย
    const thaiMonths = [
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
    ];

    const day = bangkokTime.getDate();
    const month = thaiMonths[bangkokTime.getMonth()];
    const year = bangkokTime.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    const hours = bangkokTime.getHours().toString().padStart(2, "0");
    const minutes = bangkokTime.getMinutes().toString().padStart(2, "0");

    return `วันที่ ${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
  };

  const statusConfig = {
    none: {
      color: "text-secondary",
      text: "ไม่มีข้อมูล",
      message:
        "ยังไม่มีข้อมูลระดับน้ำตาลในเลือดของคุณ\nกรุณาบันทึกค่าน้ำตาลในเลือด\nเพื่อติดตามสุขภาพของคุณ",
      image: require("../../assets/Home/a1c-none.png"),
    },
    normal: {
      color: "text-normal",
      text: "สภาวะปกติ",
      message:
        "น้ำตาลในเลือดของคุณอยู่ในเกณฑ์ดีแล้ว!\nรักษาการกินที่สมดุล ออกกำลังกาย\nและตรวจสุขภาพสม่ำเสมอ\nเพื่อค่าน้ำตาลอยู่ในเกณฑ์ที่ดีต่อไป!",
      image: require("../../assets/Home/a1c-normal.png"),
    },
    risk: {
      color: "text-warning",
      text: "ภาวะเสี่ยง \nหรือเบาหวานแฝง",
      message:
        "ค่าน้ำตาลในเลือดของคุณอยู่ในเกณฑ์เสี่ยง\nควรปรับเปลี่ยนพฤติกรรมการกิน\nและออกกำลังกายอย่างสม่ำเสมอ",
      image: require("../../assets/Home/a1c-warning.png"),
    },
    diabetes: {
      color: "text-abnormal",
      text: "เสี่ยงเบาหวาน",
      message:
        "ค่าน้ำตาลในเลือดของคุณอยู่ในเกณฑ์เสี่ยงเบาหวาน\nควรพบแพทย์เพื่อรับคำแนะนำ\nและปรับเปลี่ยนพฤติกรรมโดยด่วน",
      image: require("../../assets/Home/a1c-abnormal.png"),
    },
  };

  const currentStatus = statusConfig[status];

  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <View className="items-center justify-center py-12">
          <Text className="text-body text-secondary text-center font-regular pt-4">
            ระดับน้ำตาลในเลือดล่าสุดของฉัน
          </Text>
          <Text className="text-description text-secondary font-regular text-center">
            {error}
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      {/* Title */}
      <Text className="text-body text-secondary text-center font-regular pt-4">
        ระดับน้ำตาลในเลือดล่าสุดของฉัน
      </Text>

      {/* Date */}
      <Text className="text-tag font-regular text-secondary text-center mt-2">
        บันทึกล่าสุด ณ{" "}
        {bloodSugarData?.recordtime
          ? formatDate(bloodSugarData.recordtime)
          : "ไม่มีข้อมูล"}
      </Text>

      {/* Blood Sugar Value */}
      {bloodSugarData?.bloodsugar && (
        <Text className="text-description font-regular text-center mt-4">
          <Text className="text-secondary">ค่าน้ำตาลในเลือด: </Text>
          <Text className={currentStatus.color}>
            {bloodSugarData.bloodsugar} mg/dL
          </Text>
        </Text>
      )}

      {/* A1C Value - Commented out as in your original code */}
      {/* {bloodSugarData?.a1c && (
        <Text className="text-headline font-bold text-center mt-1">
          <Text className="text-secondary">ค่า A1C: </Text>
          <Text className={currentStatus.color}>{bloodSugarData.a1c}%</Text>
        </Text>
      )} */}

      {/* Blood Sugar Display */}
      <View className="pt-4">
        <Image
          source={currentStatus.image}
          className="mx-auto w-[150px] h-[150px]"
          resizeMode="contain"
        />
        <Text
          className={`text-title font-bold text-center ${currentStatus.color}`}
        >
          {currentStatus.text}
        </Text>
      </View>

      {/* Divider */}
      <BreakLine />

      {/* Status Message */}
      <View className="bg-background p-4 rounded-[10px]">
        <Text className="text-description font-regular text-secondary text-center">
          {currentStatus.message}
        </Text>
      </View>
    </Card>
  );
};

export default BloodSugarStatus;
