import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface HealthStatsCardProps {
  title: string;
  suffix?: string;
  data?: number[];
  color?: string;
}

const HealthStatsCard: React.FC<HealthStatsCardProps> = ({
  title,
  suffix = "",
  data,
  color = "#3972F0",
}) => {
  // Sample data for the graph
  const sampleData = [30, 45, 35, 50, 40, 55, 45, 60, 50];
  const currentData = data || sampleData;

  // Get the latest value from data array
  const latestValue = currentData[currentData.length - 1].toFixed(1);
  const displayValue = suffix ? `${latestValue}${suffix}` : latestValue;

  const cardWidth = (Dimensions.get("window").width - 48) / 2; // for padding

  return (
    <View className="bg-card p-4 rounded-[20px]" style={{ width: cardWidth }}>
      <View className="space-y-2">
        <Text className="text-description text-secondary font-regular text-center">
          {title}
        </Text>
        <Text className="text-description text-primary font-regular text-center">
          {displayValue}
        </Text>
        <View className="justify-center">
          <LineChart
            data={{
              labels: [],
              datasets: [
                {
                  data: currentData,
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
              if (index === currentData.length - 1) {
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
            }} // Function to Show dot only on the latest value
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
      </View>
    </View>
  );
};

const HealthDashboard: React.FC = () => {
  const router = useRouter();
  // Sample data arrays
  const bmiData = [21, 22, 21.5, 22.3, 22.1, 22.4, 22.2, 22.39];
  const sugarData = [85, 83, 86, 82, 84, 83, 81, 82];
  const weightData = [63, 64, 64.5, 65, 64.8, 65.2, 64.9, 65];
  const hba1cData = [5.1, 5.0, 4.9, 4.8, 4.9, 4.7, 4.8, 4.8];

  return (
    <View className="flex-1 bg-background">
      <Text className="text-headline font-regular text-center">
        ข้อมูลสถิติ
      </Text>
      <View className="flex-row justify-between p-6 gap-4">
        <TouchableOpacity onPress={() => router.push("/home/stat/0")}>
          <HealthStatsCard title="ดัชนีมวลกาย" data={bmiData} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/home/stat/1")}>
          <HealthStatsCard title="น้ำตาล" color="#3972F0" data={sugarData} />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between pt-0 px-6 mb-8 gap-4">
        <TouchableOpacity onPress={() => router.push("/home/stat/2")}>
          <HealthStatsCard title="น้ำหนัก" color="#3972F0" data={weightData} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/home/stat/3")}>
          <HealthStatsCard
            title="น้ำตาลเฉลี่ยสะสม"
            suffix="%"
            color="#3972F0"
            data={hba1cData}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HealthDashboard;
