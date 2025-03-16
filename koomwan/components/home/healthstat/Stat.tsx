import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../../config";
import Loading from "../../../global/components/Loading";
import { calculateBMI } from "../../../util/bmi";

const screenWidth = Dimensions.get("window").width;

interface HealthRecordData {
  healthinfo: string;
  recordtime: string;
  height: number;
  weight: number;
  bloodsugar?: number;
  a1c?: number;
  bloodpressure?: {
    systolic?: number;
    diastolic?: number;
  };
}

// Define the type for the stats object
interface StatsItem {
  highest: string;
  average: string;
  lowest: string;
}

// Define the type for each stats data item
interface StatData {
  title: string;
  data: number[];
  unit: string;
  stats: StatsItem;
}

export default function HealthStats() {
  // รับค่า index จาก path parameter
  const { id } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(Number(id) || 0);
  const [loading, setLoading] = useState(true);
  const [healthRecords, setHealthRecords] = useState<HealthRecordData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // สร้างข้อมูลสถิติจากข้อมูลที่ได้จาก API
  const [statsData, setStatsData] = useState<StatData[]>([
    {
      title: "ดัชนีมวลกาย",
      data: [] as number[],
      unit: "กก./ม.²",
      stats: {
        highest: "0",
        average: "0",
        lowest: "0",
      },
    },
    {
      title: "น้ำตาล",
      data: [] as number[],
      unit: "มก./ดล.",
      stats: {
        highest: "0",
        average: "0",
        lowest: "0",
      },
    },
    {
      title: "น้ำหนัก",
      data: [] as number[],
      unit: "กก.",
      stats: {
        highest: "0",
        average: "0",
        lowest: "0",
      },
    },
    {
      title: "น้ำตาลเฉลี่ยสะสม",
      data: [] as number[],
      unit: "%",
      stats: {
        highest: "0",
        average: "0",
        lowest: "0",
      },
    },
  ]);

  // คำนวณค่าสถิติต่างๆ
  const calculateStats = (data: number[]): StatsItem => {
    if (data.length === 0) {
      return { highest: "0", average: "0", lowest: "0" };
    }

    const highest = Math.max(...data).toFixed(2);
    const average = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2);
    const lowest = Math.min(...data).toFixed(2);

    return { highest, average, lowest };
  };

  // ดึงข้อมูลสุขภาพจาก API
  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ดึงข้อมูลจาก AsyncStorage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        return;
      }

      // แปลงข้อมูล auth
      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;
      const userHealthInfoId = auth.user.healthinfo;

      if (!userHealthInfoId) {
        throw new Error("Health information not found");
      }

      // เรียกใช้ API
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch health data");
      }

      // ดึงข้อมูลจาก response
      const records: HealthRecordData[] = response.data.records || [];

      if (records && records.length > 0) {
        // เรียงข้อมูลตามวันที่ (ล่าสุดก่อน)
        const sortedRecords = records.sort(
          (a, b) =>
            new Date(b.recordtime).getTime() - new Date(a.recordtime).getTime()
        );

        // เลือก 5 รายการล่าสุด และกลับลำดับให้เป็นเก่าสุดไปล่าสุด (สำหรับแสดงกราฟจากซ้ายไปขวา)
        const recentRecords = sortedRecords.slice(0, 5).reverse();
        setHealthRecords(recentRecords);

        // สร้างข้อมูลสำหรับแต่ละประเภทสถิติ
        const weightValues = recentRecords.map((record) => record.weight);
        const bmiValues = recentRecords.map((record) =>
          calculateBMI(record.weight, record.height)
        );
        const sugarValues = recentRecords
          .filter(
            (record) =>
              record.bloodsugar !== undefined && record.bloodsugar !== null
          )
          .map((record) => record.bloodsugar as number);
        const hba1cValues = recentRecords
          .filter((record) => record.a1c !== undefined && record.a1c !== null)
          .map((record) => record.a1c as number);

        // อัปเดตข้อมูลสถิติทั้งหมด
        const newStatsData: StatData[] = [
          {
            title: "ดัชนีมวลกาย",
            data: bmiValues,
            unit: "กก./ม.²",
            stats: calculateStats(bmiValues),
          },
          {
            title: "น้ำตาล",
            data: sugarValues,
            unit: "มก./ดล.",
            stats: calculateStats(sugarValues),
          },
          {
            title: "น้ำหนัก",
            data: weightValues,
            unit: "กก.",
            stats: calculateStats(weightValues),
          },
          {
            title: "น้ำตาลเฉลี่ยสะสม",
            data: hba1cValues,
            unit: "%",
            stats: calculateStats(hba1cValues),
          },
        ];

        setStatsData(newStatsData);
      } else {
        console.log("No health records found for this user");
      }
    } catch (err) {
      console.error("Error fetching health records:", err);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อเริ่มต้น
  useEffect(() => {
    fetchHealthData();
  }, []);

  const handlePrevious = () => {
    const newIndex =
      currentIndex === 0 ? statsData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex === statsData.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const chartConfig = {
    backgroundColor: "#FFF",
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(57, 114, 240, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#3972F0",
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <BackButton title="หน้าหลัก" />

        <Card>
          {loading ? (
            <View className="h-96 justify-center items-center">
              <Loading />
            </View>
          ) : error ? (
            <View className="h-96 justify-center items-center">
              <Text className="text-description text-secondary text-center">
                {error}
              </Text>
            </View>
          ) : (
            <View className="w-full items-center">
              {/* Header with Navigation */}
              <View className="flex-row items-center justify-between w-full bg-primary rounded-lg p-4 mb-4">
                <TouchableOpacity onPress={handlePrevious}>
                  <Image
                    source={require("../../../assets/Home/arrow-square-left.png")}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text className="text-headline text-card font-regular">
                  {statsData[currentIndex].title}
                </Text>
                <TouchableOpacity onPress={handleNext}>
                  <Image
                    source={require("../../../assets/Home/arrow-square-right.png")}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Subtitle */}
              <Text className="text-description text-secondary font-regular text-center mb-4">
                จากการบันทึก 5 ครั้งล่าสุด
              </Text>

              {/* Chart or No Data Message */}
              {statsData[currentIndex].data.length === 0 ? (
                <View className="h-56 justify-center items-center">
                  <Text className="text-description text-secondary text-center">
                    ไม่มีข้อมูล{statsData[currentIndex].title}
                  </Text>
                  <Text className="text-tag text-secondary text-center mt-2">
                    กรุณาเพิ่มข้อมูลสุขภาพ
                  </Text>
                </View>
              ) : (
                <View className="items-center mb-2 justify-center">
                  <LineChart
                    data={{
                      labels: statsData[currentIndex].data.map(
                        (_, index) => `${index + 1}`
                      ),
                      datasets: [
                        {
                          data: statsData[currentIndex].data,
                        },
                      ],
                    }}
                    width={screenWidth - 80}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
              )}

              <BreakLine />

              {/* Stats Section */}
              {statsData[currentIndex].data.length === 0 ? (
                <View className="items-center py-4">
                  <Text className="text-description text-secondary text-center">
                    ไม่มีข้อมูลเชิงสถิติสำหรับ{statsData[currentIndex].title}
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-body font-bold text-secondary mb-4">
                    ข้อมูลเชิงสถิติ
                  </Text>
                  <View>
                    {/* Highest Value */}
                    <View className="flex-row justify-between items-center p-4 mx-2 bg-background rounded-[10px] mb-2">
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../../assets/Home/stat-max.png")}
                          className="w-10 h-10 mr-1"
                          resizeMode="contain"
                        />
                        <Text className="text-description font-regular">
                          {`${statsData[currentIndex].title}สูงสุด`}
                        </Text>
                      </View>
                      <View className="flex-col items-center">
                        <Text className="text-description font-regular">
                          {`${statsData[currentIndex].stats.highest} `}
                        </Text>
                        <Text className="text-description text-secondary font-regular">
                          {`${statsData[currentIndex].unit}`}
                        </Text>
                      </View>
                    </View>

                    {/* Average Value */}
                    <View className="flex-row justify-between items-center p-4 mx-2 bg-background rounded-[10px] mb-2">
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../../assets/Home/stat-mean.png")}
                          className="w-10 h-10 mr-1"
                          resizeMode="contain"
                        />
                        <Text className="text-description font-regular">
                          {`${statsData[currentIndex].title}โดยประมาณ`}
                        </Text>
                      </View>
                      <View className="flex-col items-center font-regular pl-2">
                        <Text className="text-description font-regular">
                          {`${statsData[currentIndex].stats.average} `}
                        </Text>
                        <Text className="text-description text-secondary font-regular">{`${statsData[currentIndex].unit}`}</Text>
                      </View>
                    </View>

                    {/* Lowest Value */}
                    <View className="flex-row justify-between items-center p-4 mx-2 bg-background rounded-[10px] mb-2">
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../../assets/Home/stat-min.png")}
                          className="w-10 h-10 mr-1"
                          resizeMode="contain"
                        />
                        <Text className="text-description font-regular">
                          {`${statsData[currentIndex].title}ต่ำสุด`}
                        </Text>
                      </View>
                      <View className="flex-col items-center font-regular">
                        <Text className="text-description font-regular">
                          {`${statsData[currentIndex].stats.lowest}`}
                        </Text>
                        <Text className="text-description text-secondary font-regular">
                          {` ${statsData[currentIndex].unit}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
