import {
  View,
  Text,
  Image,
  FlatList,
  useWindowDimensions,
  ViewToken,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

{
  /* Type definitions for onboarding data structure */
}
interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

interface SlideItemProps {
  item: OnboardingSlide;
  width: number;
}

{
  /* Static onboarding content data */
}
const onboardingData: OnboardingSlide[] = [
  {
    id: "1",
    title: "ติดตามสุขภาพ",
    description:
      "ตัวช่วยในการติดตามสุขภาพ เก็บข้อมูลต่างๆ\nและแสดงผลออกมาให้เข้าใจง่าย!",
    image: require("../../assets/Welcome/onboard1.png"),
  },
  {
    id: "2",
    title: "ประเมินสุขภาพ",
    description:
      "รับคำประเมินสุขภาพโดยรวม คำแนะนำ\nและแนวทางพฤติกรรมที่ดียิ่งขึ้น!",
    image: require("../../assets/Welcome/onboard2.png"),
  },
  {
    id: "3",
    title: "แจ้งเตือน",
    description:
      "แจ้งเตือนการทานยาที่จำเป็น\nและสร้างวินัยในการดูแลสุขภาพที่ดี!",
    image: require("../../assets/Welcome/onboard3.png"),
  },
  {
    id: "4",
    title: "พูดคุยกับผู้เชี่ยวชาญ",
    description:
      "พูดคุยกับผู้เชี่ยวชาญด้านสุขภาพในฟอรั่ม\nพร้อมทั้งได้รับข้อมูลความรู้ที่มีประโยชน์",
    image: require("../../assets/Welcome/onboard4.png"),
  },
];

{
  /* Slide component */
}
const SlideItem = ({ item, width }: SlideItemProps) => (
  <View style={{ width }} className="flex-1">
    {/* Top section with image */}
    <View className="h-3/5 bg-white rounded-b-[50px]">
      <View className="flex-1 items-center justify-center px-4 pt-20 pb-8">
        <Image source={item.image} className="w-96 h-96" resizeMode="contain" />
      </View>
    </View>
    {/* Bottom section with text content */}
    <View className="bg-background px-4 py-6">
      <Text className="text-title font-bold mb-2 text-center mt-4 color-primary">
        {item.title}
      </Text>
      <Text className="text-description text-secondary text-center px-4 mt-3 font-regular">
        {item.description}
      </Text>
    </View>
  </View>
);

{
  /* Dot indicator component */
}
const PaginationDot = ({ isActive }: { isActive: boolean }) => (
  <View
    className={`h-1.5 rounded-full mr-1 ${
      isActive ? "w-10 bg-primary" : "w-10 bg-unread"
    }`}
  />
);

{
  /* Main Onboarding component */
}
export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  {
    /* Navigation handlers */
  }
  const scrollToIndex = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  }, []);

  const handleNext = useCallback(async () => {
    if (currentIndex === onboardingData.length - 1) {
      /* try {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        router.replace("/(auth)/login");
      } catch (error) {
        console.error("Error saving onboarding status:", error);
      } */
      router.replace("/user/login");
    } else {
      scrollToIndex(currentIndex + 1);
    }
  }, [currentIndex, router, scrollToIndex]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  }, [currentIndex, scrollToIndex]);

  const handleSkip = useCallback(() => {
    scrollToIndex(onboardingData.length - 1);
  }, [scrollToIndex]);

  {
    /* FlatList handlers */
  }
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(Number(viewableItems[0].index));
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: OnboardingSlide }) => (
      <SlideItem item={item} width={width} />
    ),
    [width]
  );

  return (
    <View className="flex-1 bg-background">
      {/* Slides carousel */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />

      {/* Bottom navigation section */}
      <View className="px-4 pb-12">
        {/* Pagination dots */}
        <View className="flex-row justify-center space-x-2 mb-10">
          {onboardingData.map((_, index) => (
            <PaginationDot key={index} isActive={index === currentIndex} />
          ))}
        </View>

        {/* Navigation buttons */}
        <View className="flex-row space-x-4 gap-4 mt-5">
          {currentIndex > 0 && currentIndex < 3 && (
            <TouchableOpacity
              onPress={handleBack}
              className="flex-1 py-4 rounded-lg border border-gray"
            >
              <Text className="text-secondary text-center font-bold text-button">
                ย้อนกลับ
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 bg-primary py-4 rounded-lg"
          >
            <Text className="font-bold text-button text-center text-card">
              {currentIndex === onboardingData.length - 1
                ? "เริ่มต้นดูแลสุขภาพตอนนี้!"
                : "ถัดไป"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Skip button */}
        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity onPress={handleSkip} className="mt-4">
            <Text className="text-gray font-bold text-button text-center">
              ข้าม
            </Text>
          </TouchableOpacity>
        )}

        {/* Custom spacing for last slide */}
        {currentIndex === 3 && <View className="mt-12" />}
      </View>
    </View>
  );
}
