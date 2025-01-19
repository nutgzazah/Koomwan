import React from "react";
import {
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";

type AuthLayoutProps = {
  children: React.ReactNode;
  backgroundImage: any;
};

export function AuthLayout({ children, backgroundImage }: AuthLayoutProps) {
  {
    /* Get screen height for minimum content container height */
  }
  const screenHeight = Dimensions.get("window").height;
  const imageContainerHeight = 320;
  const minContentHeight = screenHeight - imageContainerHeight;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Background Image Container */}
        <View className="relative h-80">
          <Image
            source={backgroundImage}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* White Overlay */}
          <View className="absolute bottom-0 w-full h-8 bg-card rounded-t-[50px] mb-1" />
        </View>

        {/* Content Container - Added minHeight to ensure it fills remaining space */}
        <View
          className="flex-1 bg-card px-6 "
          style={{ minHeight: minContentHeight }}
        >
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
