import { useFocusEffect, useRouter } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../config";
import Loading from "../../global/components/Loading";
import { calculateBMI } from "../../util/bmi";

interface HealthStatsCardProps {
  title: string;
  suffix?: string;
  data?: number[];
  color?: string;
  isLoading?: boolean;
  onPress?: () => void;
  isClickable?: boolean;
}

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

const HealthStatsCard: React.FC<HealthStatsCardProps> = ({
  title,
  suffix = "",
  data = [],
  color = "#3972F0",
  isLoading = false,
  onPress,
  isClickable = true,
}) => {
  const cardWidth = (Dimensions.get("window").width - 48) / 2; // for padding

  if (isLoading) {
    return <Loading />;
  }

  // Card content component to avoid duplication
  const CardContent = () => (
    <View className="bg-card p-4 rounded-[20px]" style={{ width: cardWidth }}>
      <View className="space-y-2">
        <Text className="text-description text-secondary font-regular text-center">
          {title}
        </Text>
        {data.length === 0 ? (
          <>
            <Text className="text-description text-primary font-regular text-center">
              ไม่มีข้อมูล
            </Text>
            <View className="h-[100px] justify-center items-center">
              <Text className="text-secondary text-tag font-regular text-center">
                กรุณาเพิ่มข้อมูลสุขภาพ
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text className="text-description text-primary font-regular text-center">
              {data[data.length - 1].toFixed(1)}
              {suffix}
            </Text>
            <View className="justify-center">
              <LineChart
                data={{
                  labels: [],
                  datasets: [
                    {
                      data: data.length > 0 ? data : [0],
                    },
                  ],
                }}
                width={cardWidth - 16} // Subtract padding
                height={100}
                yAxisLabel=""
                yAxisSuffix=""
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                withShadow={true}
                renderDotContent={({ x, y, index }) => {
                  if (index === data.length - 1) {
                    return (
                      <View
                        key={index}
                        style={{
                          position: "absolute",
                          left: x - 4,
                          top: y - 4,
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: color,
                        }}
                      />
                    );
                  }
                  return null;
                }}
                chartConfig={{
                  backgroundColor: "transparent",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 1,
                  color: () => color,
                  labelColor: () => "transparent",
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "0",
                    strokeWidth: "0",
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  paddingRight: 0,
                }}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );

  // If the card is not clickable or there's no data, just return the card without TouchableOpacity
  if (!isClickable || data.length === 0) {
    return <CardContent />;
  }

  // Otherwise, wrap in TouchableOpacity
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <CardContent />
    </TouchableOpacity>
  );
};

const HealthDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [healthInfoId, setHealthInfoId] = useState<string | null>(null);
  const [bmiData, setBmiData] = useState<number[]>([]);
  const [sugarData, setSugarData] = useState<number[]>([]);
  const [weightData, setWeightData] = useState<number[]>([]);
  const [hba1cData, setHba1cData] = useState<number[]>([]);

  // Fetch health records data
  const fetchHealthData = async () => {
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
      const userHealthInfoId = healthInfoId || auth.user.healthinfo;

      if (!userHealthInfoId) {
        throw new Error("Health information not found");
      }

      // Use the getRecord
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Debug - log the response structure to see what we're getting
      console.log(
        "API Response structure:",
        Object.keys(response.data),
        response.data.success ? "Success: true" : "Success: false"
      );

      // Check if the API request was successful
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch health data");
      }

      // Extract records
      const records: HealthRecordData[] = response.data.records || [];
      console.log(`Found ${records.length} records`);

      // Only proceed with sorting if we have records
      if (records && records.length > 0) {
        // Sort records by date (newest first)
        const sortedRecords = records.sort(
          (a, b) =>
            new Date(b.recordtime).getTime() - new Date(a.recordtime).getTime()
        );

        // Get the last 5 records (or fewer if less than 5 exist)
        const recentRecords = sortedRecords.slice(0, 5).reverse();

        // Extract data for each metric
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

        // Update state with the extracted data
        setWeightData(weightValues);
        setBmiData(bmiValues);
        setSugarData(sugarValues);
        setHba1cData(hba1cValues);
      } else {
        // If no records, set empty arrays for all data
        setWeightData([]);
        setBmiData([]);
        setSugarData([]);
        setHba1cData([]);
        console.log("No health records found for this user");
      }
    } catch (error) {
      console.error("Error fetching health records:", error);
      // Reset all data arrays
      setWeightData([]);
      setBmiData([]);
      setSugarData([]);
      setHba1cData([]);
      /*  Alert.alert(
        "Error",
        "Failed to load health data. Please try again later."
      ); */
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHealthData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHealthData();
      return () => {
        // Optional cleanup if needed
      };
    }, [])
  );

  // Handler functions for card presses
  const handleBMIPress = () => {
    if (bmiData.length > 0) {
      router.push("/home/stat/0");
    }
  };

  const handleSugarPress = () => {
    if (sugarData.length > 0) {
      router.push("/home/stat/1");
    }
  };

  const handleWeightPress = () => {
    if (weightData.length > 0) {
      router.push("/home/stat/2");
    }
  };

  const handleHba1cPress = () => {
    if (hba1cData.length > 0) {
      router.push("/home/stat/3");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Text className="text-headline font-regular text-center mt-4">
        ข้อมูลสถิติ
      </Text>
      <View className="flex-row justify-between p-6 gap-4">
        <HealthStatsCard
          title="ดัชนีมวลกาย"
          data={bmiData}
          isLoading={loading}
          suffix=" กก./ม."
          onPress={handleBMIPress}
          isClickable={bmiData.length > 0}
        />
        <HealthStatsCard
          title="น้ำตาล"
          color="#3972F0"
          data={sugarData}
          isLoading={loading}
          suffix=" มก./ดล."
          onPress={handleSugarPress}
          isClickable={sugarData.length > 0}
        />
      </View>
      <View className="flex-row justify-between pt-0 px-6 mb-8 gap-4">
        <HealthStatsCard
          title="น้ำหนัก"
          color="#3972F0"
          data={weightData}
          isLoading={loading}
          suffix=" กก."
          onPress={handleWeightPress}
          isClickable={weightData.length > 0}
        />
        <HealthStatsCard
          title="น้ำตาลเฉลี่ยสะสม"
          suffix="%"
          color="#3972F0"
          data={hba1cData}
          isLoading={loading}
          onPress={handleHba1cPress}
          isClickable={hba1cData.length > 0}
        />
      </View>
    </View>
  );
};

export default HealthDashboard;
