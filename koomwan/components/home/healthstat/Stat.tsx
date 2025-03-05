import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { useLocalSearchParams, useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function HealthStats() {
  // รับค่า index จาก path parameter
  const { id } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(Number(id) || 0);

  const statsData = [
    {
      title: "ดัชนีมวลกาย",
      data: [21, 22, 21.5, 22.3, 22.1, 22.4, 22.2, 22.39],
      unit: "กก./ม.²",
      stats: {
        highest: Math.max(...[21, 22, 21.5, 22.3, 22.1, 22.4, 22.2, 22.39]),
        average: (
          [21, 22, 21.5, 22.3, 22.1, 22.4, 22.2, 22.39].reduce(
            (a, b) => a + b
          ) / 8
        ).toFixed(2),
        lowest: Math.min(...[21, 22, 21.5, 22.3, 22.1, 22.4, 22.2, 22.39]),
      },
    },
    {
      title: "น้ำตาล",
      data: [85, 83, 86, 82, 84, 83, 81, 82],
      unit: "มก./ดล.",
      stats: {
        highest: Math.max(...[85, 83, 86, 82, 84, 83, 81, 82]),
        average: (
          [85, 83, 86, 82, 84, 83, 81, 82].reduce((a, b) => a + b) / 8
        ).toFixed(2),
        lowest: Math.min(...[85, 83, 86, 82, 84, 83, 81, 82]),
      },
    },
    {
      title: "น้ำหนัก",
      data: [63, 64, 64.5, 65, 64.8, 65.2, 64.9, 65],
      unit: "กก.",
      stats: {
        highest: Math.max(...[63, 64, 64.5, 65, 64.8, 65.2, 64.9, 65]),
        average: (
          [63, 64, 64.5, 65, 64.8, 65.2, 64.9, 65].reduce((a, b) => a + b) / 8
        ).toFixed(2),
        lowest: Math.min(...[63, 64, 64.5, 65, 64.8, 65.2, 64.9, 65]),
      },
    },
    {
      title: "น้ำตาลเฉลี่ยสะสม",
      data: [5.1, 5.0, 4.9, 4.8, 4.9, 4.7, 4.8, 4.8],
      unit: "%",
      stats: {
        highest: Math.max(...[5.1, 5.0, 4.9, 4.8, 4.9, 4.7, 4.8, 4.8]),
        average: (
          [5.1, 5.0, 4.9, 4.8, 4.9, 4.7, 4.8, 4.8].reduce((a, b) => a + b) / 8
        ).toFixed(2),
        lowest: Math.min(...[5.1, 5.0, 4.9, 4.8, 4.9, 4.7, 4.8, 4.8]),
      },
    },
  ];

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
    decimalPlaces: 1,
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
          <View className="w-full items-center ">
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
              จากการบันทึกล่าสุด
            </Text>

            {/* Chart */}
            <View className="items-center mb-2">
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

            <BreakLine />

            {/* Stats Section */}
            <View className=" items-center">
              <Text className="text-body font-bold text-secondary mb-4">
                ข้อมูลเชิงสถิติ
              </Text>
              <View>
                {/* Highest Value */}
                <View className="flex-row justify-between items-center p-4 mx-2 bg-background rounded-[10px] mb-2">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../../assets/Home/stat-max.png")}
                      className=" w-10 h-10 mr-1"
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
                      className=" w-10 h-10 mr-1"
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
                      className=" w-10 h-10 mr-1"
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
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
