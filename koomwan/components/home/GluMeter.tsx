import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Alert } from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import axios from "axios";
import BASE_URL from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import Loading from "../../global/components/Loading";
import EmptyHomeCard from "./emptystate/EmptyHome";

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
  const [hasRecords, setHasRecords] = useState(false);

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

      // Check if there are any records
      if (!response.data.records || response.data.records.length === 0) {
        setHasRecords(false);
        setStatus("none");
        setLoading(false);
        return;
      }

      // User has at least one record
      setHasRecords(true);

      if (response.data.records.length > 0) {
        // Sort records by date to get the most recent records first
        const sortedRecords = response.data.records.sort(
          (a: Record, b: Record) =>
            new Date(b.recordtime).getTime() - new Date(a.recordtime).getTime()
        );

        // First, check the latest record
        const latestRecord = sortedRecords[0];

        // Check if the latest record has blood sugar data
        if (
          (latestRecord.bloodsugar !== undefined &&
            latestRecord.bloodsugar !== null) ||
          (latestRecord.a1c !== undefined && latestRecord.a1c !== null)
        ) {
          // Use the latest record
          setBloodSugarData({
            bloodsugar: latestRecord.bloodsugar,
            a1c: latestRecord.a1c,
            recordtime: latestRecord.recordtime,
          });

          // Determine status
          determineStatus(latestRecord);
        } else {
          // If latest record doesn't have blood sugar data, find the most recent record that does
          const recordWithBloodSugar = sortedRecords.find(
            (record: Record) =>
              (record.bloodsugar !== undefined && record.bloodsugar !== null) ||
              (record.a1c !== undefined && record.a1c !== null)
          );

          if (recordWithBloodSugar) {
            // Found a record with blood sugar data
            setBloodSugarData({
              bloodsugar: recordWithBloodSugar.bloodsugar,
              a1c: recordWithBloodSugar.a1c,
              recordtime: recordWithBloodSugar.recordtime,
            });

            // Determine status
            determineStatus(recordWithBloodSugar);
          } else {
            // No records with blood sugar data found
            setStatus("none");
          }
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

  // Helper function to determine status based on blood sugar or a1c values
  const determineStatus = (record: Record) => {
    // จัดเก็บสถานะจากค่าน้ำตาลในเลือดและค่า A1C
    let bloodSugarStatus = "none";
    let a1cStatus = "none";

    // ตรวจสอบค่าน้ำตาลในเลือด
    if (record.bloodsugar !== undefined && record.bloodsugar !== null) {
      if (record.bloodsugar < 100) {
        bloodSugarStatus = "normal";
      } else if (record.bloodsugar >= 100 && record.bloodsugar < 126) {
        bloodSugarStatus = "risk";
      } else if (record.bloodsugar >= 126) {
        bloodSugarStatus = "diabetes";
      }
    }

    // ตรวจสอบค่า A1C
    if (record.a1c !== undefined && record.a1c !== null) {
      if (record.a1c < 5.7) {
        a1cStatus = "normal";
      } else if (record.a1c >= 5.7 && record.a1c < 6.5) {
        a1cStatus = "risk";
      } else if (record.a1c >= 6.5) {
        a1cStatus = "diabetes";
      }
    }

    // ถ้ามีทั้งสองค่า ให้เลือกค่าที่แย่กว่า (diabetes > risk > normal)
    if (bloodSugarStatus !== "none" && a1cStatus !== "none") {
      if (bloodSugarStatus === "diabetes" || a1cStatus === "diabetes") {
        setStatus("diabetes");
      } else if (bloodSugarStatus === "risk" || a1cStatus === "risk") {
        setStatus("risk");
      } else {
        setStatus("normal");
      }
    }
    // ถ้ามีแค่ค่าใดค่าหนึ่ง ให้ใช้ค่านั้น
    else if (bloodSugarStatus !== "none") {
      setStatus(bloodSugarStatus as "normal" | "risk" | "diabetes");
    } else if (a1cStatus !== "none") {
      setStatus(a1cStatus as "normal" | "risk" | "diabetes");
    } else {
      setStatus("none");
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

  // Show empty state if no records found
  if (!hasRecords) {
    return (
      <EmptyHomeCard
        header="ระดับน้ำตาลในเลือดล่าสุด"
        title="ยังไม่มีข้อมูลน้ำตาลในเลือด"
        subtitle="กรุณาบันทึกข้อมูลสุขภาพเพื่อติดตามความเสี่ยงของคุณ"
        buttonText="บันทึกข้อมูลสุขภาพ"
        navigateTo="/(tabs)/tracking"
        icon={require("../../assets/Home/a1c-none.png")}
      />
    );
  }

  // Show no blood sugar data state
  if (status === "none" && hasRecords) {
    return (
      <EmptyHomeCard
        header="ระดับน้ำตาลในเลือดล่าสุด"
        title="ยังไม่มีข้อมูลค่าน้ำตาลในเลือด"
        subtitle="คุณมีข้อมูลบันทึกสุขภาพแล้ว แต่ยังไม่มีข้อมูลน้ำตาลในเลือด กรุณาบันทึกข้อมูลเพิ่มเติม"
        buttonText="บันทึกข้อมูลสุขภาพ"
        navigateTo="/(tabs)/tracking"
        icon={require("../../assets/Home/a1c-none.png")}
      />
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
            {bloodSugarData.bloodsugar} มก./ดล.
          </Text>
        </Text>
      )}

      {/* A1C Value (if available) */}
      {bloodSugarData?.a1c && (
        <Text className="text-description font-regular text-center mt-1">
          <Text className="text-secondary">ค่า A1C: </Text>
          <Text className={currentStatus.color}>{bloodSugarData.a1c}%</Text>
        </Text>
      )}

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
