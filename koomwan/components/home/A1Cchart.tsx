import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";

const data = {
  labels: [""],
  datasets: [
    {
      data: [65, 82, 78, 75, 85, 78, 82],
      color: (opacity = 1) => `rgba(57, 114, 240, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const HealthChart = () => {
  const screenWidth = Dimensions.get("window").width - 48; // Full width minus padding

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(57, 114, 240, ${opacity})`,
    labelColor: () => "#3E3B5B",
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
    <Card>
      <View className="w-full justify-center items-center ">
        <Text className="text-title font-bold text-secondary ">
          สุขภาพโดยรวม
        </Text>
        <BreakLine />

        <Text className="text-headline font-regular text-secondary mb-2">
          ระดับน้ำตาลในเลือดของฉัน
        </Text>

        <Text className="text-tag font-regular text-secondary mb-2">
          บันทึกล่าสุด ณ วันจันทร์ที่ 2 ธันวาคม
        </Text>

        <Text className="text-tag font-regular text-secondary mb-4">
          {data.datasets[0].data[data.datasets[0].data.length - 1]} มก./ดล.
        </Text>

        <View className="w-full justify-center items-center p-1">
          <LineChart
            data={data}
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
            yAxisSuffix=""
            yAxisInterval={20}
            fromZero={false}
            segments={4}
          />
        </View>
      </View>
    </Card>
  );
};

export default HealthChart;
