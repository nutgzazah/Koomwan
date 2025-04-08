import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Dimensions, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import BASE_URL from "../../config";
import Loading from "../../global/components/Loading";
import EmptyHomeCard from "./emptystate/EmptyHome";

// Define the API response type for blood sugar records
interface BloodSugarRecord {
  _id: string;
  recordtime: string;
  bloodsugar: number;
}

// Format date to Thai format
const formatThaiDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Thai day names
  const thaiDays = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];

  // Thai month names
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

  const day = thaiDays[date.getDay()];
  const dayNum = date.getDate();
  const month = thaiMonths[date.getMonth()];

  return `วัน${day}ที่ ${dayNum} ${month}`;
};

interface BloodSugarChartProps {
  healthInfoId?: string; // Optional healthInfoId prop
}

const BloodSugarChart = ({ healthInfoId }: BloodSugarChartProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bloodSugarData, setBloodSugarData] = useState<BloodSugarRecord[]>([]);
  const [chartData, setChartData] = useState({
    labels: [""],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(57, 114, 240, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  });
  const [lastRecordDate, setLastRecordDate] = useState<string>("");
  const [lastBloodSugarValue, setLastBloodSugarValue] = useState<number>(0);
  const [hasRecords, setHasRecords] = useState<boolean>(false);

  const screenWidth = Dimensions.get("window").width - 48; // Full width minus padding

  // Format date to Thai format with GMT+7 timezone
  const formatThaiDate = (dateString: string): string => {
    // Create date object from string
    const date = new Date(dateString);

    const bangkokTime = new Date(date);

    // Thai day names
    const thaiDays = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];

    // Thai month names
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

    /* const day = thaiDays[bangkokTime.getDay()]; */
    const dayNum = bangkokTime.getDate();
    const month = thaiMonths[bangkokTime.getMonth()];
    const year = bangkokTime.getFullYear() + 543;

    // Format time as HH:MM
    const hours = bangkokTime.getHours().toString().padStart(2, "0");
    const minutes = bangkokTime.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}:${minutes} น.`;

    return `วันที่ ${dayNum} ${month} ${year} เวลา ${timeStr}`;
  };

  const fetchBloodSugarData = async () => {
    try {
      setLoading(true);

      // Get auth data from local storage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
        return;
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;
      const userHealthInfoId = healthInfoId || auth.user.healthinfo;

      if (!userHealthInfoId) {
        throw new Error("Health information not found");
      }

      // Use the getRecord endpoint from your API
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
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

      // Filter records that have bloodsugar field and sort by date
      const allRecords = response.data.records;

      // Check if there are any records at all
      if (allRecords.length === 0) {
        setHasRecords(false);
        setLoading(false);
        return;
      }

      const bloodSugarRecords = allRecords
        .filter(
          (record: BloodSugarRecord) =>
            record.bloodsugar !== undefined && record.bloodsugar !== null
        )
        .sort(
          (a: BloodSugarRecord, b: BloodSugarRecord) =>
            new Date(b.recordtime).getTime() - new Date(a.recordtime).getTime()
        ); // Sort by date (newest first)

      // Get only the 5 most recent records
      const records = bloodSugarRecords.slice(0, 5);

      if (records.length > 0) {
        // Has blood sugar records
        setHasRecords(true);

        // Sort records by date (oldest first) for proper chart display
        const sortedRecords = [...records].sort(
          (a, b) =>
            new Date(a.recordtime).getTime() - new Date(b.recordtime).getTime()
        );

        setBloodSugarData(sortedRecords);

        // Prepare chart data
        // แก้ไขส่วนที่เตรียม labels สำหรับกราฟ
        const labels = sortedRecords.map((record) => {
          const date = new Date(record.recordtime);
          // ปรับเวลาเป็น GMT+7
          const bangkokTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
          return `${bangkokTime.getDate()}/${bangkokTime.getMonth() + 1}`;
        });

        const values = sortedRecords.map((record) => record.bloodsugar);

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              color: (opacity = 1) => `rgba(57, 114, 240, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        });

        // Set the most recent record data
        const latestRecord = sortedRecords[sortedRecords.length - 1];
        setLastRecordDate(formatThaiDate(latestRecord.recordtime));
        setLastBloodSugarValue(latestRecord.bloodsugar);
      } else {
        // Has records but no blood sugar data
        setHasRecords(true);
        setBloodSugarData([]);
      }
    } catch (err) {
      console.log("Error fetching blood sugar data:", err);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchBloodSugarData();
  }, [healthInfoId]);

  // Refresh data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBloodSugarData();
      return () => {
        // Optional cleanup if needed
      };
    }, [healthInfoId])
  );

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(57, 114, 240, ${opacity})`,
    labelColor: () => "#3E3B5B",
    style: {
      borderRadius: 16,
      fontFamily: "K2D-Regular",
      fontSize: 8,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "0",
      stroke: "#3972F0",
    },
  };

  // Function to determine blood sugar status
  const getBloodSugarStatus = (value: number): string => {
    if (value < 70) return "ต่ำกว่าเกณฑ์";
    if (value <= 130) return "ปกติ";
    return "สูงกว่าเกณฑ์";
  };

  // Function to determine text color based on status
  const getStatusColor = (value: number): string => {
    if (value < 70) return "text-warning";
    if (value <= 130) return "text-normal";
    return "text-abnormal";
  };

  // If no records exist, show the empty state component
  if (!loading && !hasRecords) {
    return (
      <EmptyHomeCard
        title="ยังไม่มีข้อมูลบันทึกสุขภาพ"
        subtitle="กรุณาบันทึกข้อมูลสุขภาพเพื่อติดตามค่าน้ำตาลในเลือดของคุณ"
        buttonText="บันทึกข้อมูลสุขภาพ"
        /* icon={require("../../assets/Home/graph_notfound.png")} */
      />
    );
  }

  // If loading or error, still use Card wrapper
  if (loading || error) {
    return (
      <Card>
        <View className="w-full justify-center items-center">
          <Text className="text-title font-bold text-secondary">
            สุขภาพโดยรวม
          </Text>
          <BreakLine />

          {loading ? (
            <Loading />
          ) : (
            <View className="py-16">
              <Text className="text-description text-secondary font-regular text-center">
                กรุณาลองใหม่อีกครั้ง
              </Text>
            </View>
          )}
        </View>
      </Card>
    );
  }

  // If no blood sugar data, return EmptyHomeCard without Card wrapper
  if (bloodSugarData.length === 0) {
    return (
      <EmptyHomeCard
        title="ยังไม่มีข้อมูลน้ำตาลในเลือดล่าสุด"
        subtitle="คุณมีข้อมูลบันทึกสุขภาพแล้ว แต่ยังไม่มีการบันทึกค่าน้ำตาลในเลือด"
        buttonText="บันทึกข้อมูลสุขภาพ"
        /* icon={require("../../assets/Home/graph_notfound.png")} */
      />
    );
  }

  return (
    <Card>
      <View className="w-full justify-center items-center">
        <Text className="text-title font-bold text-secondary">
          สุขภาพโดยรวม
        </Text>
        <BreakLine />

        <Text className="text-headline font-regular text-secondary mb-2">
          ระดับน้ำตาลในเลือดของฉัน
        </Text>

        <Text className="text-tag font-regular text-secondary mb-2">
          บันทึกล่าสุด ณ {lastRecordDate}
        </Text>

        <View className="flex-row items-center mb-4 justify-center">
          <Text className="text-description font-regular text-secondary">
            {lastBloodSugarValue}
          </Text>
          <Text className="text-description font-regular text-secondary ml-1">
            มก./ดล.
          </Text>
          <Text
            className={`text-description font-medium ml-2 ${getStatusColor(
              lastBloodSugarValue
            )}`}
          >
            ({getBloodSugarStatus(lastBloodSugarValue)})
          </Text>
        </View>

        <View className="w-full justify-center items-center p-1">
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withInnerLines={true}
            withOuterLines={true}
            withDots={true}
            withShadow={true}
            yAxisLabel=""
            yAxisInterval={20}
            fromZero={false}
            segments={5}
          />
        </View>

        <View className="w-full mt-2 items-center justify-center">
          <Text className="text-tag font-medium text-secondary">
            ช่วงปกติ: 70 - 130 มก./ดล.
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default BloodSugarChart;
