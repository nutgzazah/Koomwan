import React from "react";
import { SafeAreaView, Text, View, Image } from "react-native";

const Loading = () => {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      {/* <Image
        source={require("../../assets/koomwan2.png")}
        className="w-24 h-24 mb-4"
      /> */}
      <Text className="font-regular text-body mb-2">Loading...</Text>
      <View className="w-12 h-12 border-t-4 border-b-4 border-secondary rounded-full animate-spin"></View>
    </SafeAreaView>
  );
};

export default Loading;
